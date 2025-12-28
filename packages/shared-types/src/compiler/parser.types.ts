/**
 * Parser Types - AST generation stage
 */

import { SourceLocation, SourceRange } from './lexer.types';

export enum NodeType {
  // Top-level
  CONTRACT = 'Contract',
  
  // Declarations
  RESOURCE_DECLARATION = 'ResourceDeclaration',
  FUNCTION_DECLARATION = 'FunctionDeclaration',
  STRUCT_DECLARATION = 'StructDeclaration',
  FIELD_DECLARATION = 'FieldDeclaration',
  PARAMETER_DECLARATION = 'ParameterDeclaration',
  
  // Statements
  EXPRESSION_STATEMENT = 'ExpressionStatement',
  RETURN_STATEMENT = 'ReturnStatement',
  IF_STATEMENT = 'IfStatement',
  WHILE_STATEMENT = 'WhileStatement',
  FOR_STATEMENT = 'ForStatement',
  ASSERT_STATEMENT = 'AssertStatement',
  BLOCK_STATEMENT = 'BlockStatement',
  
  // Expressions
  IDENTIFIER = 'Identifier',
  NUMBER_LITERAL = 'NumberLiteral',
  STRING_LITERAL = 'StringLiteral',
  BOOLEAN_LITERAL = 'BooleanLiteral',
  BINARY_EXPRESSION = 'BinaryExpression',
  UNARY_EXPRESSION = 'UnaryExpression',
  ASSIGNMENT_EXPRESSION = 'AssignmentExpression',
  CALL_EXPRESSION = 'CallExpression',
  MEMBER_EXPRESSION = 'MemberExpression',
  INDEX_EXPRESSION = 'IndexExpression',
  
  // Types
  TYPE_ANNOTATION = 'TypeAnnotation',
}

export interface ASTNode {
  type: NodeType;
  location: SourceLocation;
  range?: SourceRange;
}

// ============================================
// TOP-LEVEL NODES
// ============================================

export interface ContractNode extends ASTNode {
  type: NodeType.CONTRACT;
  name: IdentifierNode;
  body: ContractBodyNode[];
}

export type ContractBodyNode = 
  | ResourceDeclarationNode 
  | FunctionDeclarationNode 
  | StructDeclarationNode;

// ============================================
// DECLARATION NODES
// ============================================

export interface ResourceDeclarationNode extends ASTNode {
  type: NodeType.RESOURCE_DECLARATION;
  name: IdentifierNode;
  fields?: FieldDeclarationNode[];
}

export interface StructDeclarationNode extends ASTNode {
  type: NodeType.STRUCT_DECLARATION;
  name: IdentifierNode;
  fields: FieldDeclarationNode[];
}

export interface FieldDeclarationNode extends ASTNode {
  type: NodeType.FIELD_DECLARATION;
  name: IdentifierNode;
  typeAnnotation: TypeAnnotationNode;
}

export interface FunctionDeclarationNode extends ASTNode {
  type: NodeType.FUNCTION_DECLARATION;
  name: IdentifierNode;
  parameters: ParameterDeclarationNode[];
  returnType?: TypeAnnotationNode;
  body: BlockStatementNode;
}

export interface ParameterDeclarationNode extends ASTNode {
  type: NodeType.PARAMETER_DECLARATION;
  name: IdentifierNode;
  typeAnnotation: TypeAnnotationNode;
}

// ============================================
// STATEMENT NODES
// ============================================

export type StatementNode = 
  | ExpressionStatementNode
  | ReturnStatementNode
  | IfStatementNode
  | WhileStatementNode
  | ForStatementNode
  | AssertStatementNode
  | BlockStatementNode;

export interface ExpressionStatementNode extends ASTNode {
  type: NodeType.EXPRESSION_STATEMENT;
  expression: ExpressionNode;
}

export interface ReturnStatementNode extends ASTNode {
  type: NodeType.RETURN_STATEMENT;
  argument?: ExpressionNode;
}

export interface IfStatementNode extends ASTNode {
  type: NodeType.IF_STATEMENT;
  condition: ExpressionNode;
  consequent: StatementNode;
  alternate?: StatementNode;
}

export interface WhileStatementNode extends ASTNode {
  type: NodeType.WHILE_STATEMENT;
  condition: ExpressionNode;
  body: StatementNode;
}

export interface ForStatementNode extends ASTNode {
  type: NodeType.FOR_STATEMENT;
  init?: ExpressionNode;
  condition?: ExpressionNode;
  update?: ExpressionNode;
  body: StatementNode;
}

export interface AssertStatementNode extends ASTNode {
  type: NodeType.ASSERT_STATEMENT;
  condition: ExpressionNode;
  message?: ExpressionNode;
}

export interface BlockStatementNode extends ASTNode {
  type: NodeType.BLOCK_STATEMENT;
  statements: StatementNode[];
}

// ============================================
// EXPRESSION NODES
// ============================================

export type ExpressionNode =
  | IdentifierNode
  | NumberLiteralNode
  | StringLiteralNode
  | BooleanLiteralNode
  | BinaryExpressionNode
  | UnaryExpressionNode
  | AssignmentExpressionNode
  | CallExpressionNode
  | MemberExpressionNode
  | IndexExpressionNode;

export interface IdentifierNode extends ASTNode {
  type: NodeType.IDENTIFIER;
  name: string;
}

export interface NumberLiteralNode extends ASTNode {
  type: NodeType.NUMBER_LITERAL;
  value: number;
}

export interface StringLiteralNode extends ASTNode {
  type: NodeType.STRING_LITERAL;
  value: string;
}

export interface BooleanLiteralNode extends ASTNode {
  type: NodeType.BOOLEAN_LITERAL;
  value: boolean;
}

export interface BinaryExpressionNode extends ASTNode {
  type: NodeType.BINARY_EXPRESSION;
  operator: BinaryOperator;
  left: ExpressionNode;
  right: ExpressionNode;
}

export type BinaryOperator = 
  | '+' | '-' | '*' | '/' | '%'
  | '==' | '!=' | '<' | '>' | '<=' | '>='
  | '&&' | '||';

export interface UnaryExpressionNode extends ASTNode {
  type: NodeType.UNARY_EXPRESSION;
  operator: UnaryOperator;
  argument: ExpressionNode;
}

export type UnaryOperator = '!' | '-' | '+';

export interface AssignmentExpressionNode extends ASTNode {
  type: NodeType.ASSIGNMENT_EXPRESSION;
  operator: AssignmentOperator;
  left: ExpressionNode;
  right: ExpressionNode;
}

export type AssignmentOperator = '=' | '+=' | '-=';

export interface CallExpressionNode extends ASTNode {
  type: NodeType.CALL_EXPRESSION;
  callee: ExpressionNode;
  arguments: ExpressionNode[];
}

export interface MemberExpressionNode extends ASTNode {
  type: NodeType.MEMBER_EXPRESSION;
  object: ExpressionNode;
  property: IdentifierNode;
}

export interface IndexExpressionNode extends ASTNode {
  type: NodeType.INDEX_EXPRESSION;
  object: ExpressionNode;
  index: ExpressionNode;
}

// ============================================
// TYPE NODES
// ============================================

export interface TypeAnnotationNode extends ASTNode {
  type: NodeType.TYPE_ANNOTATION;
  typeName: string;
  isReference?: boolean;
  isMutable?: boolean;
}

// ============================================
// PARSER RESULT
// ============================================

export interface ParserResult {
  ast: ContractNode;
  errors: ParserErrorInfo[];
}

export interface ParserErrorInfo {
  message: string;
  location: SourceLocation;
  code: string;
  expected?: string;
  found?: string;
}
