/**
 * Semantic Analyzer
 * Performs type checking, scope resolution, and validation
 */

import { BaseASTVisitor } from '../ast/visitor.js';
import {
  ContractNode,
  ResourceDeclarationNode,
  FunctionDeclarationNode,
  ParameterDeclarationNode,
  IdentifierNode,
  BinaryExpressionNode,
  AssignmentExpressionNode,
  CallExpressionNode,
  IndexExpressionNode,
  MemberExpressionNode,
  ExpressionNode,
  SourceLocation,
  NodeType,
} from '@js2move/shared-types';

/**
 * Symbol information
 */
interface Symbol {
  name: string;
  type: string;
  kind: 'resource' | 'function' | 'parameter' | 'variable';
  location: SourceLocation;
}

/**
 * Scope for symbol resolution
 */
class Scope {
  private symbols = new Map<string, Symbol>();
  private parent?: Scope;

  constructor(parent?: Scope) {
    this.parent = parent;
  }

  define(symbol: Symbol): void {
    if (this.symbols.has(symbol.name)) {
      throw new Error(`Symbol '${symbol.name}' already defined in this scope`);
    }
    this.symbols.set(symbol.name, symbol);
  }

  resolve(name: string): Symbol | undefined {
    const symbol = this.symbols.get(name);
    if (symbol) return symbol;
    return this.parent?.resolve(name);
  }

  has(name: string): boolean {
    return this.symbols.has(name);
  }
}

/**
 * Semantic error
 */
export interface SemanticError {
  message: string;
  location: SourceLocation;
  code: string;
}

/**
 * Semantic analysis result
 */
export interface SemanticResult {
  errors: SemanticError[];
  warnings: string[];
  symbolTable: Map<string, Symbol>;
}

/**
 * Semantic Analyzer
 */
export class SemanticAnalyzer extends BaseASTVisitor<string> {
  private currentScope: Scope;
  private errors: SemanticError[] = [];
  private warnings: string[] = [];
  private resources = new Set<string>();
  private resourceFields = new Map<string, { name: string; type: string } | null>();
  private functions = new Map<string, FunctionDeclarationNode>();

  constructor() {
    super();
    this.currentScope = new Scope();
    this.initializeBuiltins();
  }

  /**
   * Analyze AST
   */
  analyze(ast: ContractNode): SemanticResult {
    try {
      this.visit(ast);
    } catch (error: any) {
      // Catch any unhandled errors
      this.errors.push({
        message: error.message,
        location: ast.location,
        code: 'SEMANTIC_ERROR',
      });
    }

    return {
      errors: this.errors,
      warnings: this.warnings,
      symbolTable: this.getAllSymbols(),
    };
  }

  /**
   * Initialize built-in types and functions
   */
  private initializeBuiltins(): void {
    // Built-in types
    const builtinTypes = ['u8', 'u64', 'u128', 'bool', 'address', 'signer', 'string', 'vector'];
    builtinTypes.forEach(type => {
      this.currentScope.define({
        name: type,
        type: 'type',
        kind: 'variable',
        location: { line: 0, column: 0, offset: 0 },
      });
    });
  }

  /**
   * Contract visitor
   */
  visitContract(node: ContractNode): string {
    // First pass: collect all resources and function signatures
    for (const decl of node.body) {
      if (decl.type === NodeType.RESOURCE_DECLARATION) {
        const resource = decl as ResourceDeclarationNode;
        this.resources.add(resource.name.name);
        this.currentScope.define({
          name: resource.name.name,
          type: 'resource',
          kind: 'resource',
          location: resource.location,
        });
      } else if (decl.type === NodeType.FUNCTION_DECLARATION) {
        const func = decl as FunctionDeclarationNode;
        this.functions.set(func.name.name, func);
        this.currentScope.define({
          name: func.name.name,
          type: 'function',
          kind: 'function',
          location: func.location,
        });
      }
    }

    // Second pass: analyze function bodies
    for (const decl of node.body) {
      this.visit(decl);
    }

    return 'contract';
  }

  /**
   * Resource visitor
   */
  visitResourceDeclaration(node: ResourceDeclarationNode): string {
    // Check for duplicate fields
    const fieldNames = new Set<string>();
    const fields: Array<{ name: string; type: string }> = [];

    node.fields?.forEach(field => {
      if (fieldNames.has(field.name.name)) {
        this.error(
          `Duplicate field '${field.name.name}' in resource '${node.name.name}'`,
          field.location,
          'DUPLICATE_FIELD'
        );
      }
      fieldNames.add(field.name.name);

      // Validate field types
      this.validateType(field.typeAnnotation.typeName, field.location);
      fields.push({ name: field.name.name, type: field.typeAnnotation.typeName });
    });

    // Record single-field resource information to allow shorthand assignments like Resource[index] = value
    if (fields.length === 1) {
      this.resourceFields.set(node.name.name, { name: fields[0].name, type: fields[0].type });
    } else {
      this.resourceFields.set(node.name.name, null);
    }

    return 'resource';
  }

  /**
   * Function visitor
   */
  visitFunctionDeclaration(node: FunctionDeclarationNode): string {
    // Enter new scope
    const previousScope = this.currentScope;
    this.currentScope = new Scope(previousScope);

    // Add parameters to scope
    const paramNames = new Set<string>();
    for (const param of node.parameters) {
      if (paramNames.has(param.name.name)) {
        this.error(
          `Duplicate parameter '${param.name.name}'`,
          param.location,
          'DUPLICATE_PARAMETER'
        );
      }
      paramNames.add(param.name.name);

      // Validate parameter types
      this.validateType(param.typeAnnotation.typeName, param.location);

      // Define in scope
      this.currentScope.define({
        name: param.name.name,
        type: param.typeAnnotation.typeName,
        kind: 'parameter',
        location: param.location,
      });
    }

    // Validate return type
    if (node.returnType) {
      this.validateType(node.returnType.typeName, node.returnType.location);
    }

    // Analyze function body
    this.visit(node.body);

    // Exit scope
    this.currentScope = previousScope;

    return 'function';
  }

  /**
   * Binary expression visitor
   */
  visitBinaryExpression(node: BinaryExpressionNode): string {
    const leftType = this.visit(node.left) || 'unknown';
    const rightType = this.visit(node.right) || 'unknown';

    // Type checking for binary operations
    const arithmeticOps = ['+', '-', '*', '/', '%'];
    const comparisonOps = ['<', '<=', '>', '>='];
    const equalityOps = ['==', '!='];
    const logicalOps = ['&&', '||'];

    if (arithmeticOps.includes(node.operator)) {
      if (!this.isNumericType(leftType) || !this.isNumericType(rightType)) {
        this.error(
          `Arithmetic operation requires numeric types, got ${leftType} and ${rightType}`,
          node.location,
          'TYPE_MISMATCH'
        );
      }
      return leftType; // Result has same type as operands
    }

    if (comparisonOps.includes(node.operator)) {
      if (!this.isNumericType(leftType) || !this.isNumericType(rightType)) {
        this.error(
          `Comparison requires numeric types, got ${leftType} and ${rightType}`,
          node.location,
          'TYPE_MISMATCH'
        );
      }
      return 'bool';
    }

    if (equalityOps.includes(node.operator)) {
      // Equality can work on any type, but both sides must match
      if (leftType !== rightType) {
        this.warning(`Comparing different types: ${leftType} and ${rightType}`);
      }
      return 'bool';
    }

    if (logicalOps.includes(node.operator)) {
      if (leftType !== 'bool' || rightType !== 'bool') {
        this.error(
          `Logical operation requires boolean types, got ${leftType} and ${rightType}`,
          node.location,
          'TYPE_MISMATCH'
        );
      }
      return 'bool';
    }

    return 'unknown';
  }

  /**
   * Assignment expression visitor
   */
  visitAssignmentExpression(node: AssignmentExpressionNode): string {
    const leftType = this.visit(node.left) || 'unknown';
    const rightType = this.visit(node.right) || 'unknown';

    // Special-case: allow shorthand assignment into single-field resources
    // e.g., Resource[index] = <value> where Resource has one field of the same type
    if (node.left.type === NodeType.INDEX_EXPRESSION && this.resourceFields.has(leftType)) {
      const info = this.resourceFields.get(leftType);
      if (info && info.type === rightType) {
        // allowed shorthand; underlying codegen will construct the resource
        return leftType;
      }
    }

    // Check type compatibility
    if (leftType !== rightType && leftType !== 'unknown' && rightType !== 'unknown') {
      this.error(
        `Cannot assign ${rightType} to ${leftType}`,
        node.location,
        'TYPE_MISMATCH'
      );
    }

    return leftType;
  }

  /**
   * Call expression visitor
   */
  visitCallExpression(node: CallExpressionNode): string {
    // Get function name
    let funcName: string | undefined;
    if (node.callee.type === NodeType.IDENTIFIER) {
      funcName = (node.callee as IdentifierNode).name;
    }

    if (funcName) {
      const func = this.functions.get(funcName);
      if (!func) {
        this.error(
          `Unknown function '${funcName}'`,
          node.location,
          'UNDEFINED_FUNCTION'
        );
        return 'unknown';
      }

      // Check argument count
      if (node.arguments.length !== func.parameters.length) {
        this.error(
          `Function '${funcName}' expects ${func.parameters.length} arguments, got ${node.arguments.length}`,
          node.location,
          'ARGUMENT_COUNT_MISMATCH'
        );
      }

      // Check argument types
      for (let i = 0; i < Math.min(node.arguments.length, func.parameters.length); i++) {
        const argType = this.visit(node.arguments[i]);
        const paramType = func.parameters[i].typeAnnotation.typeName;
        
        if (argType !== paramType && argType !== 'unknown') {
          this.error(
            `Argument ${i + 1} type mismatch: expected ${paramType}, got ${argType}`,
            node.arguments[i].location,
            'TYPE_MISMATCH'
          );
        }
      }

      return func.returnType?.typeName || 'void';
    }

    return 'unknown';
  }

  /**
   * Index expression visitor (resource access)
   */
  visitIndexExpression(node: IndexExpressionNode): string {
    const objectType = this.visit(node.object) || 'unknown';
    const indexType = this.visit(node.index) || 'unknown';

    // Check if object is a resource
    if (!this.resources.has(objectType)) {
      this.error(
        `Cannot index non-resource type '${objectType}'`,
        node.location,
        'INVALID_INDEX'
      );
    }

    // Index should be address or signer
    if (indexType !== 'address' && indexType !== 'signer') {
      this.error(
        `Resource index must be address or signer, got '${indexType}'`,
        node.index.location,
        'INVALID_INDEX_TYPE'
      );
    }

    return objectType;
  }

  /**
   * Identifier visitor
   */
  visitIdentifier(node: IdentifierNode): string {
    const symbol = this.currentScope.resolve(node.name);
    if (!symbol) {
      this.error(
        `Undefined identifier '${node.name}'`,
        node.location,
        'UNDEFINED_IDENTIFIER'
      );
      return 'unknown';
    }
    // For resources, return the resource name itself (not the generic type 'resource')
    // so that visitIndexExpression can check if it's in this.resources
    if (symbol.kind === 'resource') {
      return symbol.name;
    }
    return symbol.type;
  }

  /**
   * Literal visitors
   */
  visitNumberLiteral(): string {
    return 'u64'; // Default numeric type
  }

  visitStringLiteral(): string {
    return 'string';
  }

  visitBooleanLiteral(): string {
    return 'bool';
  }

  /**
   * Helper: Validate type exists
   */
  private validateType(typeName: string, location: SourceLocation): void {
    const symbol = this.currentScope.resolve(typeName);
    if (!symbol && !this.resources.has(typeName)) {
      this.error(
        `Unknown type '${typeName}'`,
        location,
        'UNKNOWN_TYPE'
      );
    }
  }

  /**
   * Helper: Check if type is numeric
   */
  private isNumericType(type: string): boolean {
    return ['u8', 'u64', 'u128'].includes(type);
  }

  /**
   * Helper: Record error
   */
  private error(message: string, location: SourceLocation, code: string): void {
    this.errors.push({ message, location, code });
  }

  /**
   * Helper: Record warning
   */
  private warning(message: string): void {
    this.warnings.push(message);
  }

  /**
   * Get all symbols from all scopes
   */
  private getAllSymbols(): Map<string, Symbol> {
    const symbols = new Map<string, Symbol>();
    // This is simplified - in real implementation, collect from all scopes
    return symbols;
  }
}

/**
 * Analyze AST for semantic errors
 */
export function analyze(ast: ContractNode): SemanticResult {
  const analyzer = new SemanticAnalyzer();
  return analyzer.analyze(ast);
}
