/**
 * Intermediate Representation (IR) Builder
 * Converts AST to a lower-level IR for optimization
 */

import { BaseASTVisitor } from '../ast/visitor.js';
import {
  ContractNode,
  ResourceDeclarationNode,
  FunctionDeclarationNode,
  BlockStatementNode,
  ExpressionNode,
  BinaryExpressionNode,
  CallExpressionNode,
  IdentifierNode,
  SourceLocation,
  NodeType,
} from '@js2move/shared-types';

/**
 * IR Instruction Types
 */
export enum IROpCode {
  // Stack operations
  LOAD,        // Load value onto stack
  STORE,       // Store value from stack
  PUSH,        // Push constant
  POP,         // Pop from stack
  
  // Arithmetic
  ADD,
  SUB,
  MUL,
  DIV,
  MOD,
  
  // Comparison
  EQ,
  NEQ,
  LT,
  LTE,
  GT,
  GTE,
  
  // Logical
  AND,
  OR,
  NOT,
  
  // Control flow
  JUMP,        // Unconditional jump
  JUMP_IF,     // Conditional jump
  JUMP_IF_NOT, // Conditional jump (inverted)
  LABEL,       // Jump target
  CALL,        // Function call
  RETURN,      // Return from function
  
  // Move-specific
  MOVE_TO,     // Move resource to address
  MOVE_FROM,   // Move resource from address
  BORROW,      // Borrow reference
  BORROW_MUT,  // Borrow mutable reference
  
  // Memory
  ALLOC,       // Allocate memory
  DEREF,       // Dereference pointer
}

/**
 * IR Instruction
 */
export interface IRInstruction {
  opcode: IROpCode;
  operands: (string | number)[];
  location?: SourceLocation;
  comment?: string;
}

/**
 * IR Basic Block
 */
export interface IRBasicBlock {
  label: string;
  instructions: IRInstruction[];
  successors: string[];
}

/**
 * IR Function
 */
export interface IRFunction {
  name: string;
  parameters: Array<{ name: string; type: string }>;
  returnType?: string;
  blocks: IRBasicBlock[];
  localCount: number;
}

/**
 * IR Module
 */
export interface IRModule {
  name: string;
  resources: Array<{
    name: string;
    fields: Array<{ name: string; type: string }>;
  }>;
  functions: IRFunction[];
}

/**
 * IR Builder - converts AST to IR
 */
export class IRBuilder extends BaseASTVisitor<void> {
  private currentModule: IRModule | null = null;
  private currentFunction: IRFunction | null = null;
  private currentBlock: IRBasicBlock | null = null;
  private labelCounter = 0;
  private localCounter = 0;
  private tempCounter = 0;

  /**
   * Build IR from AST
   */
  build(ast: ContractNode): IRModule {
    this.currentModule = {
      name: ast.name.name,
      resources: [],
      functions: [],
    };

    this.visit(ast);

    return this.currentModule;
  }

  /**
   * Contract visitor
   */
  visitContract(node: ContractNode): void {
    for (const decl of node.body) {
      this.visit(decl);
    }
  }

  /**
   * Resource visitor
   */
  visitResourceDeclaration(node: ResourceDeclarationNode): void {
    this.currentModule!.resources.push({
      name: node.name.name,
      fields: node.fields?.map(f => ({
        name: f.name.name,
        type: f.typeAnnotation.typeName,
      })) || [],
    });
  }

  /**
   * Function visitor
   */
  visitFunctionDeclaration(node: FunctionDeclarationNode): void {
    this.currentFunction = {
      name: node.name.name,
      parameters: node.parameters.map(p => ({
        name: p.name.name,
        type: p.typeAnnotation.typeName,
      })),
      returnType: node.returnType?.typeName,
      blocks: [],
      localCount: 0,
    };

    this.localCounter = 0;
    this.labelCounter = 0;
    this.tempCounter = 0;

    // Create entry block
    const entryBlock = this.createBlock('entry');
    this.currentBlock = entryBlock;

    // Visit function body
    this.visit(node.body);

    // Add function to module
    this.currentModule!.functions.push(this.currentFunction);
    this.currentFunction = null;
    this.currentBlock = null;
  }

  /**
   * Block statement visitor
   */
  visitBlockStatement(node: BlockStatementNode): void {
    for (const stmt of node.statements) {
      this.visit(stmt);
    }
  }

  /**
   * Binary expression visitor
   */
  visitBinaryExpression(node: BinaryExpressionNode): void {
    // Evaluate left operand
    this.visit(node.left);
    
    // Evaluate right operand
    this.visit(node.right);

    // Emit operation
    const opMap: Record<string, IROpCode> = {
      '+': IROpCode.ADD,
      '-': IROpCode.SUB,
      '*': IROpCode.MUL,
      '/': IROpCode.DIV,
      '%': IROpCode.MOD,
      '==': IROpCode.EQ,
      '!=': IROpCode.NEQ,
      '<': IROpCode.LT,
      '<=': IROpCode.LTE,
      '>': IROpCode.GT,
      '>=': IROpCode.GTE,
      '&&': IROpCode.AND,
      '||': IROpCode.OR,
    };

    const opcode = opMap[node.operator];
    if (opcode) {
      this.emit(opcode, [], `${node.operator} operation`);
    }
  }

  /**
   * Call expression visitor
   */
  visitCallExpression(node: CallExpressionNode): void {
    // Push arguments onto stack
    for (const arg of node.arguments) {
      this.visit(arg);
    }

    // Emit call instruction
    if (node.callee.type === NodeType.IDENTIFIER) {
      const funcName = (node.callee as IdentifierNode).name;
      this.emit(IROpCode.CALL, [funcName, node.arguments.length], `call ${funcName}`);
    }
  }

  /**
   * Identifier visitor
   */
  visitIdentifier(node: IdentifierNode): void {
    this.emit(IROpCode.LOAD, [node.name], `load ${node.name}`);
  }

  /**
   * Number literal visitor
   */
  visitNumberLiteral(node: any): void {
    this.emit(IROpCode.PUSH, [node.value], `push ${node.value}`);
  }

  /**
   * Helper: Create new basic block
   */
  private createBlock(name: string): IRBasicBlock {
    const block: IRBasicBlock = {
      label: name,
      instructions: [],
      successors: [],
    };
    this.currentFunction!.blocks.push(block);
    return block;
  }

  /**
   * Helper: Generate unique label
   */
  private generateLabel(prefix: string = 'L'): string {
    return `${prefix}${this.labelCounter++}`;
  }

  /**
   * Helper: Generate temporary variable
   */
  private generateTemp(): string {
    return `$t${this.tempCounter++}`;
  }

  /**
   * Helper: Emit instruction
   */
  private emit(opcode: IROpCode, operands: (string | number)[], comment?: string): void {
    if (this.currentBlock) {
      this.currentBlock.instructions.push({
        opcode,
        operands,
        comment,
      });
    }
  }
}

/**
 * Build IR from AST
 */
export function buildIR(ast: ContractNode): IRModule {
  const builder = new IRBuilder();
  return builder.build(ast);
}
