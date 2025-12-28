/**
 * AST Pretty Printer
 * Converts AST back to readable source code (for debugging)
 */

import { BaseASTVisitor } from './visitor.js';
import {
  ContractNode,
  ResourceDeclarationNode,
  FunctionDeclarationNode,
  ParameterDeclarationNode,
  FieldDeclarationNode,
  BlockStatementNode,
  ReturnStatementNode,
  IfStatementNode,
  WhileStatementNode,
  AssertStatementNode,
  ExpressionStatementNode,
  BinaryExpressionNode,
  AssignmentExpressionNode,
  CallExpressionNode,
  MemberExpressionNode,
  IndexExpressionNode,
  IdentifierNode,
  NumberLiteralNode,
  StringLiteralNode,
  BooleanLiteralNode,
} from '@js2move/shared-types';

export class ASTPrinter extends BaseASTVisitor<string> {
  private indent = 0;

  print(node: any): string {
    return this.visit(node) || '';
  }

  private indentation(): string {
    return '  '.repeat(this.indent);
  }

  visitContract(node: ContractNode): string {
    let result = `contract ${node.name.name} {\n`;
    this.indent++;
    
    for (const decl of node.body) {
      result += this.indentation() + this.visit(decl) + '\n';
    }
    
    this.indent--;
    result += '}';
    return result;
  }

  visitResourceDeclaration(node: ResourceDeclarationNode): string {
    let result = `resource ${node.name.name}`;
    
    if (node.fields && node.fields.length > 0) {
      result += ' {\n';
      this.indent++;
      node.fields.forEach((field, i) => {
        result += this.indentation() + this.visit(field);
        if (i < node.fields!.length - 1) result += ',';
        result += '\n';
      });
      this.indent--;
      result += this.indentation() + '}';
    }
    
    result += ';';
    return result;
  }

  visitFunctionDeclaration(node: FunctionDeclarationNode): string {
    const params = node.parameters.map(p => this.visit(p)).join(', ');
    let result = `${node.name.name}(${params})`;
    
    if (node.returnType) {
      result += `: ${node.returnType.typeName}`;
    }
    
    result += ' ' + this.visit(node.body);
    return result;
  }

  visitParameterDeclaration(node: ParameterDeclarationNode): string {
    return `${node.name.name}: ${node.typeAnnotation.typeName}`;
  }

  visitFieldDeclaration(node: FieldDeclarationNode): string {
    return `${node.name.name}: ${node.typeAnnotation.typeName}`;
  }

  visitBlockStatement(node: BlockStatementNode): string {
    let result = '{\n';
    this.indent++;
    
    for (const stmt of node.statements) {
      result += this.indentation() + this.visit(stmt) + '\n';
    }
    
    this.indent--;
    result += this.indentation() + '}';
    return result;
  }

  visitReturnStatement(node: ReturnStatementNode): string {
    if (node.argument) {
      return `return ${this.visit(node.argument)};`;
    }
    return 'return;';
  }

  visitIfStatement(node: IfStatementNode): string {
    let result = `if (${this.visit(node.condition)}) ${this.visit(node.consequent)}`;
    if (node.alternate) {
      result += ` else ${this.visit(node.alternate)}`;
    }
    return result;
  }

  visitWhileStatement(node: WhileStatementNode): string {
    return `while (${this.visit(node.condition)}) ${this.visit(node.body)}`;
  }

  visitAssertStatement(node: AssertStatementNode): string {
    return `assert(${this.visit(node.condition)});`;
  }

  visitExpressionStatement(node: ExpressionStatementNode): string {
    return `${this.visit(node.expression)};`;
  }

  visitBinaryExpression(node: BinaryExpressionNode): string {
    return `${this.visit(node.left)} ${node.operator} ${this.visit(node.right)}`;
  }

  visitAssignmentExpression(node: AssignmentExpressionNode): string {
    return `${this.visit(node.left)} ${node.operator} ${this.visit(node.right)}`;
  }

  visitCallExpression(node: CallExpressionNode): string {
    const args = node.arguments.map(arg => this.visit(arg)).join(', ');
    return `${this.visit(node.callee)}(${args})`;
  }

  visitMemberExpression(node: MemberExpressionNode): string {
    return `${this.visit(node.object)}.${this.visit(node.property)}`;
  }

  visitIndexExpression(node: IndexExpressionNode): string {
    return `${this.visit(node.object)}[${this.visit(node.index)}]`;
  }

  visitIdentifier(node: IdentifierNode): string {
    return node.name;
  }

  visitNumberLiteral(node: NumberLiteralNode): string {
    return node.value.toString();
  }

  visitStringLiteral(node: StringLiteralNode): string {
    return `"${node.value}"`;
  }

  visitBooleanLiteral(node: BooleanLiteralNode): string {
    return node.value.toString();
  }
}

/**
 * Pretty print AST to source code
 */
export function printAST(ast: ContractNode): string {
  const printer = new ASTPrinter();
  return printer.print(ast);
}
