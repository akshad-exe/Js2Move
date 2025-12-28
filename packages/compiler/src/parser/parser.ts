/**
 * Parser - Builds AST from tokens
 */

import {
  Token,
  TokenType,
  ParserResult,
  ParserErrorInfo,
  ContractNode,
  ResourceDeclarationNode,
  FunctionDeclarationNode,
  ParameterDeclarationNode,
  BlockStatementNode,
  StatementNode,
  ExpressionNode,
  IdentifierNode,
  TypeAnnotationNode,
  NodeType,
  BinaryExpressionNode,
  AssignmentExpressionNode,
  CallExpressionNode,
  MemberExpressionNode,
  IndexExpressionNode,
  NumberLiteralNode,
  StringLiteralNode,
  BooleanLiteralNode,
  ReturnStatementNode,
  IfStatementNode,
  WhileStatementNode,
  AssertStatementNode,
  ExpressionStatementNode,
  FieldDeclarationNode,
} from '@js2move/shared-types';

export class Parser {
  private tokens: Token[];
  private current: number = 0;
  private errors: ParserErrorInfo[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  /**
   * Parse tokens into AST
   */
  parse(): ParserResult {
    try {
      const ast = this.parseContract();
      return { ast, errors: this.errors };
    } catch (error: any) {
      this.errors.push({
        message: error?.message || 'Unknown error',
        location: this.currentToken().location,
        code: 'PARSE_ERROR',
      });
      throw error;
    }
  }

  // ============================================
  // CONTRACT PARSING
  // ============================================

  private parseContract(): ContractNode {
    this.expect(TokenType.CONTRACT, 'Expected "contract" keyword');
    const name = this.parseIdentifier();
    this.expect(TokenType.LBRACE, 'Expected "{"');

    const body: (ResourceDeclarationNode | FunctionDeclarationNode)[] = [];

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.check(TokenType.RESOURCE)) {
        body.push(this.parseResourceDeclaration());
      } else if (this.check(TokenType.IDENTIFIER)) {
        body.push(this.parseFunctionDeclaration());
      } else {
        this.error('Expected resource or function declaration');
        this.advance(); // Skip invalid token
      }
    }

    this.expect(TokenType.RBRACE, 'Expected "}"');

    return {
      type: NodeType.CONTRACT,
      name,
      body,
      location: name.location,
    };
  }

  // ============================================
  // DECLARATION PARSING
  // ============================================

  private parseResourceDeclaration(): ResourceDeclarationNode {
    const location = this.currentToken().location;
    this.expect(TokenType.RESOURCE, 'Expected "resource"');
    const name = this.parseIdentifier();

    let fields: FieldDeclarationNode[] | undefined;

    if (this.match(TokenType.LBRACE)) {
      fields = [];
      while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
        fields.push(this.parseFieldDeclaration());
        if (!this.check(TokenType.RBRACE)) {
          this.expect(TokenType.COMMA, 'Expected ","');
        }
      }
      this.expect(TokenType.RBRACE, 'Expected "}"');
    }

    this.expect(TokenType.SEMICOLON, 'Expected ";"');

    return {
      type: NodeType.RESOURCE_DECLARATION,
      name,
      fields,
      location,
    };
  }

  private parseFieldDeclaration(): FieldDeclarationNode {
    const location = this.currentToken().location;
    const name = this.parseIdentifier();
    this.expect(TokenType.COLON, 'Expected ":"');
    const typeAnnotation = this.parseTypeAnnotation();

    return {
      type: NodeType.FIELD_DECLARATION,
      name,
      typeAnnotation,
      location,
    };
  }

  private parseFunctionDeclaration(): FunctionDeclarationNode {
    const location = this.currentToken().location;
    const name = this.parseIdentifier();

    this.expect(TokenType.LPAREN, 'Expected "("');
    const parameters = this.parseParameterList();
    this.expect(TokenType.RPAREN, 'Expected ")"');

    let returnType: TypeAnnotationNode | undefined;
    if (this.match(TokenType.COLON)) {
      returnType = this.parseTypeAnnotation();
    }

    const body = this.parseBlockStatement();

    return {
      type: NodeType.FUNCTION_DECLARATION,
      name,
      parameters,
      returnType,
      body,
      location,
    };
  }

  private parseParameterList(): ParameterDeclarationNode[] {
    const parameters: ParameterDeclarationNode[] = [];

    if (this.check(TokenType.RPAREN)) {
      return parameters;
    }

    do {
      const location = this.currentToken().location;
      const name = this.parseIdentifier();
      this.expect(TokenType.COLON, 'Expected ":"');
      const typeAnnotation = this.parseTypeAnnotation();

      parameters.push({
        type: NodeType.PARAMETER_DECLARATION,
        name,
        typeAnnotation,
        location,
      });
    } while (this.match(TokenType.COMMA));

    return parameters;
  }

  private parseTypeAnnotation(): TypeAnnotationNode {
    const location = this.currentToken().location;
    const typeName = this.advance().value;

    return {
      type: NodeType.TYPE_ANNOTATION,
      typeName,
      location,
    };
  }

  // ============================================
  // STATEMENT PARSING
  // ============================================

  private parseBlockStatement(): BlockStatementNode {
    const location = this.currentToken().location;
    this.expect(TokenType.LBRACE, 'Expected "{"');

    const statements: StatementNode[] = [];

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      statements.push(this.parseStatement());
    }

    this.expect(TokenType.RBRACE, 'Expected "}"');

    return {
      type: NodeType.BLOCK_STATEMENT,
      statements,
      location,
    };
  }

  private parseStatement(): StatementNode {
    if (this.check(TokenType.RETURN)) {
      return this.parseReturnStatement();
    }
    if (this.check(TokenType.IF)) {
      return this.parseIfStatement();
    }
    if (this.check(TokenType.WHILE)) {
      return this.parseWhileStatement();
    }
    if (this.check(TokenType.ASSERT)) {
      return this.parseAssertStatement();
    }
    if (this.check(TokenType.LBRACE)) {
      return this.parseBlockStatement();
    }

    return this.parseExpressionStatement();
  }

  private parseReturnStatement(): ReturnStatementNode {
    const location = this.currentToken().location;
    this.expect(TokenType.RETURN, 'Expected "return"');

    let argument: ExpressionNode | undefined;
    if (!this.check(TokenType.SEMICOLON)) {
      argument = this.parseExpression();
    }

    this.expect(TokenType.SEMICOLON, 'Expected ";"');

    return {
      type: NodeType.RETURN_STATEMENT,
      argument,
      location,
    };
  }

  private parseIfStatement(): IfStatementNode {
    const location = this.currentToken().location;
    this.expect(TokenType.IF, 'Expected "if"');
    this.expect(TokenType.LPAREN, 'Expected "("');
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN, 'Expected ")"');

    const consequent = this.parseStatement();

    let alternate: StatementNode | undefined;
    if (this.match(TokenType.ELSE)) {
      alternate = this.parseStatement();
    }

    return {
      type: NodeType.IF_STATEMENT,
      condition,
      consequent,
      alternate,
      location,
    };
  }

  private parseWhileStatement(): WhileStatementNode {
    const location = this.currentToken().location;
    this.expect(TokenType.WHILE, 'Expected "while"');
    this.expect(TokenType.LPAREN, 'Expected "("');
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN, 'Expected ")"');

    const body = this.parseStatement();

    return {
      type: NodeType.WHILE_STATEMENT,
      condition,
      body,
      location,
    };
  }

  private parseAssertStatement(): AssertStatementNode {
    const location = this.currentToken().location;
    this.expect(TokenType.ASSERT, 'Expected "assert"');
    this.expect(TokenType.LPAREN, 'Expected "("');
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN, 'Expected ")"');
    this.expect(TokenType.SEMICOLON, 'Expected ";"');

    return {
      type: NodeType.ASSERT_STATEMENT,
      condition,
      location,
    };
  }

  private parseExpressionStatement(): ExpressionStatementNode {
    const location = this.currentToken().location;
    const expression = this.parseExpression();
    this.expect(TokenType.SEMICOLON, 'Expected ";"');

    return {
      type: NodeType.EXPRESSION_STATEMENT,
      expression,
      location,
    };
  }

  // ============================================
  // EXPRESSION PARSING (Precedence Climbing)
  // ============================================

  private parseExpression(): ExpressionNode {
    return this.parseAssignment();
  }

  private parseAssignment(): ExpressionNode {
    const expr = this.parseOr();

    if (this.match(TokenType.ASSIGN, TokenType.PLUS_ASSIGN, TokenType.MINUS_ASSIGN)) {
      const operator = this.previous().value as '=' | '+=' | '-=';
      const right = this.parseAssignment();

      return {
        type: NodeType.ASSIGNMENT_EXPRESSION,
        operator,
        left: expr,
        right,
        location: expr.location,
      } as AssignmentExpressionNode;
    }

    return expr;
  }

  private parseOr(): ExpressionNode {
    let left = this.parseAnd();

    while (this.match(TokenType.OR)) {
      const operator = '||';
      const right = this.parseAnd();
      left = {
        type: NodeType.BINARY_EXPRESSION,
        operator,
        left,
        right,
        location: left.location,
      } as BinaryExpressionNode;
    }

    return left;
  }

  private parseAnd(): ExpressionNode {
    let left = this.parseEquality();

    while (this.match(TokenType.AND)) {
      const operator = '&&';
      const right = this.parseEquality();
      left = {
        type: NodeType.BINARY_EXPRESSION,
        operator,
        left,
        right,
        location: left.location,
      } as BinaryExpressionNode;
    }

    return left;
  }

  private parseEquality(): ExpressionNode {
    let left = this.parseComparison();

    while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
      const operator = this.previous().value as '==' | '!=';
      const right = this.parseComparison();
      left = {
        type: NodeType.BINARY_EXPRESSION,
        operator,
        left,
        right,
        location: left.location,
      } as BinaryExpressionNode;
    }

    return left;
  }

  private parseComparison(): ExpressionNode {
    let left = this.parseTerm();

    while (this.match(TokenType.LESS_THAN, TokenType.LESS_EQUAL, TokenType.GREATER_THAN, TokenType.GREATER_EQUAL)) {
      const operator = this.previous().value as '<' | '<=' | '>' | '>=';
      const right = this.parseTerm();
      left = {
        type: NodeType.BINARY_EXPRESSION,
        operator,
        left,
        right,
        location: left.location,
      } as BinaryExpressionNode;
    }

    return left;
  }

  private parseTerm(): ExpressionNode {
    let left = this.parseFactor();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().value as '+' | '-';
      const right = this.parseFactor();
      left = {
        type: NodeType.BINARY_EXPRESSION,
        operator,
        left,
        right,
        location: left.location,
      } as BinaryExpressionNode;
    }

    return left;
  }

  private parseFactor(): ExpressionNode {
    let left = this.parsePostfix();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
      const operator = this.previous().value as '*' | '/' | '%';
      const right = this.parsePostfix();
      left = {
        type: NodeType.BINARY_EXPRESSION,
        operator,
        left,
        right,
        location: left.location,
      } as BinaryExpressionNode;
    }

    return left;
  }

  private parsePostfix(): ExpressionNode {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.LPAREN)) {
        expr = this.parseCallExpression(expr);
      } else if (this.match(TokenType.LBRACKET)) {
        expr = this.parseIndexExpression(expr);
      } else if (this.match(TokenType.DOT)) {
        expr = this.parseMemberExpression(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  private parseCallExpression(callee: ExpressionNode): CallExpressionNode {
    const args: ExpressionNode[] = [];

    if (!this.check(TokenType.RPAREN)) {
      do {
        args.push(this.parseExpression());
      } while (this.match(TokenType.COMMA));
    }

    this.expect(TokenType.RPAREN, 'Expected ")"');

    return {
      type: NodeType.CALL_EXPRESSION,
      callee,
      arguments: args,
      location: callee.location,
    };
  }

  private parseIndexExpression(object: ExpressionNode): IndexExpressionNode {
    const index = this.parseExpression();
    this.expect(TokenType.RBRACKET, 'Expected "]"');

    return {
      type: NodeType.INDEX_EXPRESSION,
      object,
      index,
      location: object.location,
    };
  }

  private parseMemberExpression(object: ExpressionNode): MemberExpressionNode {
    const property = this.parseIdentifier();

    return {
      type: NodeType.MEMBER_EXPRESSION,
      object,
      property,
      location: object.location,
    };
  }

  private parsePrimary(): ExpressionNode {
    if (this.match(TokenType.NUMBER)) {
      return this.parseNumber();
    }
    if (this.match(TokenType.STRING_LITERAL)) {
      return this.parseString();
    }
    if (this.match(TokenType.TRUE, TokenType.FALSE)) {
      return this.parseBoolean();
    }
    if (this.match(TokenType.IDENTIFIER)) {
      const token = this.previous();
      return {
        type: NodeType.IDENTIFIER,
        name: token.value,
        location: token.location,
      };
    }
    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN, 'Expected ")"');
      return expr;
    }

    this.error('Expected expression');
    throw new Error('Expected expression');
  }

  private parseIdentifier(): IdentifierNode {
    this.expect(TokenType.IDENTIFIER, 'Expected identifier');
    const token = this.previous();
    return {
      type: NodeType.IDENTIFIER,
      name: token.value,
      location: token.location,
    };
  }

  private parseNumber(): NumberLiteralNode {
    const token = this.previous();
    return {
      type: NodeType.NUMBER_LITERAL,
      value: parseInt(token.value, 10),
      location: token.location,
    };
  }

  private parseString(): StringLiteralNode {
    const token = this.previous();
    return {
      type: NodeType.STRING_LITERAL,
      value: token.value,
      location: token.location,
    };
  }

  private parseBoolean(): BooleanLiteralNode {
    const token = this.previous();
    return {
      type: NodeType.BOOLEAN_LITERAL,
      value: token.type === TokenType.TRUE,
      location: token.location,
    };
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.currentToken().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.currentToken().type === TokenType.EOF;
  }

  private currentToken(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private expect(type: TokenType, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }

    this.error(message);
    throw new Error(message);
  }

  private error(message: string): void {
    this.errors.push({
      message,
      location: this.currentToken().location,
      code: 'PARSE_ERROR',
      expected: message,
      found: this.currentToken().value,
    });
  }
}

/**
 * Parse tokens into AST
 */
export function parse(tokens: Token[]): ParserResult {
  const parser = new Parser(tokens);
  return parser.parse();
}
