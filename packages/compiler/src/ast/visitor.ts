/**
 * AST Visitor Pattern
 * Provides traversal mechanism for AST nodes
 */

import {
  ContractNode,
  ResourceDeclarationNode,
  FunctionDeclarationNode,
  ParameterDeclarationNode,
  FieldDeclarationNode,
  StatementNode,
  ExpressionNode,
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
  TypeAnnotationNode,
  NodeType,
} from '@js2move/shared-types';

/**
 * Visitor interface - implement methods for nodes you want to visit
 */
export interface ASTVisitor<T = void> {
  visitContract?(node: ContractNode): T | undefined;
  visitResourceDeclaration?(node: ResourceDeclarationNode): T | undefined;
  visitFunctionDeclaration?(node: FunctionDeclarationNode): T | undefined;
  visitParameterDeclaration?(node: ParameterDeclarationNode): T | undefined;
  visitFieldDeclaration?(node: FieldDeclarationNode): T | undefined;
  visitTypeAnnotation?(node: TypeAnnotationNode): T | undefined;
  
  visitBlockStatement?(node: BlockStatementNode): T | undefined;
  visitReturnStatement?(node: ReturnStatementNode): T | undefined;
  visitIfStatement?(node: IfStatementNode): T | undefined;
  visitWhileStatement?(node: WhileStatementNode): T | undefined;
  visitAssertStatement?(node: AssertStatementNode): T | undefined;
  visitExpressionStatement?(node: ExpressionStatementNode): T | undefined;
  
  visitBinaryExpression?(node: BinaryExpressionNode): T | undefined;
  visitAssignmentExpression?(node: AssignmentExpressionNode): T | undefined;
  visitCallExpression?(node: CallExpressionNode): T | undefined;
  visitMemberExpression?(node: MemberExpressionNode): T | undefined;
  visitIndexExpression?(node: IndexExpressionNode): T | undefined;
  visitIdentifier?(node: IdentifierNode): T | undefined;
  visitNumberLiteral?(node: NumberLiteralNode): T | undefined;
  visitStringLiteral?(node: StringLiteralNode): T | undefined;
  visitBooleanLiteral?(node: BooleanLiteralNode): T | undefined;
}

/**
 * Base visitor class with default traversal behavior
 */
export class BaseASTVisitor<T = void> implements ASTVisitor<T> {
  visit(node: any): T | undefined {
    switch (node.type) {
      case NodeType.CONTRACT:
        return this.visitContract(node);
      case NodeType.RESOURCE_DECLARATION:
        return this.visitResourceDeclaration(node);
      case NodeType.FUNCTION_DECLARATION:
        return this.visitFunctionDeclaration(node);
      case NodeType.PARAMETER_DECLARATION:
        return this.visitParameterDeclaration(node);
      case NodeType.FIELD_DECLARATION:
        return this.visitFieldDeclaration(node);
      case NodeType.TYPE_ANNOTATION:
        return this.visitTypeAnnotation(node);
      case NodeType.BLOCK_STATEMENT:
        return this.visitBlockStatement(node);
      case NodeType.RETURN_STATEMENT:
        return this.visitReturnStatement(node);
      case NodeType.IF_STATEMENT:
        return this.visitIfStatement(node);
      case NodeType.WHILE_STATEMENT:
        return this.visitWhileStatement(node);
      case NodeType.ASSERT_STATEMENT:
        return this.visitAssertStatement(node);
      case NodeType.EXPRESSION_STATEMENT:
        return this.visitExpressionStatement(node);
      case NodeType.BINARY_EXPRESSION:
        return this.visitBinaryExpression(node);
      case NodeType.ASSIGNMENT_EXPRESSION:
        return this.visitAssignmentExpression(node);
      case NodeType.CALL_EXPRESSION:
        return this.visitCallExpression(node);
      case NodeType.MEMBER_EXPRESSION:
        return this.visitMemberExpression(node);
      case NodeType.INDEX_EXPRESSION:
        return this.visitIndexExpression(node);
      case NodeType.IDENTIFIER:
        return this.visitIdentifier(node);
      case NodeType.NUMBER_LITERAL:
        return this.visitNumberLiteral(node);
      case NodeType.STRING_LITERAL:
        return this.visitStringLiteral(node);
      case NodeType.BOOLEAN_LITERAL:
        return this.visitBooleanLiteral(node);
      default:
        return undefined;
    }
  }

  visitContract(node: ContractNode): T | undefined {
    this.visit(node.name);
    node.body.forEach(decl => this.visit(decl));
    return undefined;
  }

  visitResourceDeclaration(node: ResourceDeclarationNode): T | undefined {
    this.visit(node.name);
    node.fields?.forEach(field => this.visit(field));
    return undefined;
  }

  visitFunctionDeclaration(node: FunctionDeclarationNode): T | undefined {
    this.visit(node.name);
    node.parameters.forEach(param => this.visit(param));
    if (node.returnType) this.visit(node.returnType);
    this.visit(node.body);
    return undefined;
  }

  visitParameterDeclaration(node: ParameterDeclarationNode): T | undefined {
    this.visit(node.name);
    this.visit(node.typeAnnotation);
    return undefined;
  }

  visitFieldDeclaration(node: FieldDeclarationNode): T | undefined {
    this.visit(node.name);
    this.visit(node.typeAnnotation);
    return undefined;
  }

  visitTypeAnnotation(node: TypeAnnotationNode): T | undefined {
    return undefined;
  }

  visitBlockStatement(node: BlockStatementNode): T | undefined {
    node.statements.forEach(stmt => this.visit(stmt));
    return undefined;
  }

  visitReturnStatement(node: ReturnStatementNode): T | undefined {
    if (node.argument) this.visit(node.argument);
    return undefined;
  }

  visitIfStatement(node: IfStatementNode): T | undefined {
    this.visit(node.condition);
    this.visit(node.consequent);
    if (node.alternate) this.visit(node.alternate);
    return undefined;
  }

  visitWhileStatement(node: WhileStatementNode): T | undefined {
    this.visit(node.condition);
    this.visit(node.body);
    return undefined;
  }

  visitAssertStatement(node: AssertStatementNode): T | undefined {
    this.visit(node.condition);
    return undefined;
  }

  visitExpressionStatement(node: ExpressionStatementNode): T | undefined {
    this.visit(node.expression);
    return undefined;
  }

  visitBinaryExpression(node: BinaryExpressionNode): T | undefined {
    this.visit(node.left);
    this.visit(node.right);
    return undefined;
  }

  visitAssignmentExpression(node: AssignmentExpressionNode): T | undefined {
    this.visit(node.left);
    this.visit(node.right);
    return undefined;
  }

  visitCallExpression(node: CallExpressionNode): T | undefined {
    this.visit(node.callee);
    node.arguments.forEach(arg => this.visit(arg));
    return undefined;
  }

  visitMemberExpression(node: MemberExpressionNode): T | undefined {
    this.visit(node.object);
    this.visit(node.property);
    return undefined;
  }

  visitIndexExpression(node: IndexExpressionNode): T | undefined {
    this.visit(node.object);
    this.visit(node.index);
    return undefined;
  }

  visitIdentifier(node: IdentifierNode): T | undefined {
    return undefined;
  }

  visitNumberLiteral(node: NumberLiteralNode): T | undefined {
    return undefined;
  }

  visitStringLiteral(node: StringLiteralNode): T | undefined {
    return undefined;
  }

  visitBooleanLiteral(node: BooleanLiteralNode): T | undefined {
    return undefined;
  }
}
