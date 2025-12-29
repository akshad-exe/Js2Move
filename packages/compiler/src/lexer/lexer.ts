/**
 * Lexer - Tokenizes MoveJS source code
 */

import { Token, TokenType, LexerResult, LexerErrorInfo, SourceLocation } from '@js2move/shared-types';

export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];
  private errors: LexerErrorInfo[] = [];

  // Keywords mapping
  private keywords: Map<string, TokenType> = new Map([
    ['contract', TokenType.CONTRACT],
    ['resource', TokenType.RESOURCE],
    ['function', TokenType.FUNCTION],
    ['struct', TokenType.STRUCT],
    ['return', TokenType.RETURN],
    ['if', TokenType.IF],
    ['else', TokenType.ELSE],
    ['for', TokenType.FOR],
    ['while', TokenType.WHILE],
    ['assert', TokenType.ASSERT],
    ['emit', TokenType.EMIT],
    ['has_resource', TokenType.HAS_RESOURCE],
    ['true', TokenType.TRUE],
    ['false', TokenType.FALSE],
    // Types
    ['u8', TokenType.U8],
    ['u64', TokenType.U64],
    ['u128', TokenType.U128],
    ['bool', TokenType.BOOL],
    ['address', TokenType.ADDRESS],
    ['signer', TokenType.SIGNER],
    ['string', TokenType.STRING],
    ['vector', TokenType.VECTOR],
  ]);

  constructor(source: string) {
    this.source = source;
  }

  /**
   * Tokenize the entire source code
   */
  tokenize(): LexerResult {
    while (!this.isAtEnd()) {
      this.scanToken();
    }

    // Add EOF token
    this.addToken(TokenType.EOF, '');

    return {
      tokens: this.tokens,
      errors: this.errors,
    };
  }

  private scanToken(): void {
    const start = this.getCurrentLocation();
    const char = this.advance();

    switch (char) {
      // Single-character tokens
      case '(': this.addToken(TokenType.LPAREN, char); break;
      case ')': this.addToken(TokenType.RPAREN, char); break;
      case '{': this.addToken(TokenType.LBRACE, char); break;
      case '}': this.addToken(TokenType.RBRACE, char); break;
      case '[': this.addToken(TokenType.LBRACKET, char); break;
      case ']': this.addToken(TokenType.RBRACKET, char); break;
      case ';': this.addToken(TokenType.SEMICOLON, char); break;
      case ',': this.addToken(TokenType.COMMA, char); break;
      case ':': this.addToken(TokenType.COLON, char); break;
      case '.': this.addToken(TokenType.DOT, char); break;
      case '%': this.addToken(TokenType.MODULO, char); break;

      // Operators (potentially multi-character)
      case '+':
        if (this.match('=')) {
          this.addToken(TokenType.PLUS_ASSIGN, '+=');
        } else {
          this.addToken(TokenType.PLUS, char);
        }
        break;

      case '-':
        if (this.match('=')) {
          this.addToken(TokenType.MINUS_ASSIGN, '-=');
        } else if (this.match('>')) {
          this.addToken(TokenType.ARROW, '->');
        } else {
          this.addToken(TokenType.MINUS, char);
        }
        break;

      case '*': this.addToken(TokenType.MULTIPLY, char); break;
      case '/':
        if (this.match('/')) {
          // Single-line comment
          this.skipLineComment();
        } else if (this.match('*')) {
          // Multi-line comment
          this.skipBlockComment();
        } else {
          this.addToken(TokenType.DIVIDE, char);
        }
        break;

      case '=':
        if (this.match('=')) {
          this.addToken(TokenType.EQUAL, '==');
        } else {
          this.addToken(TokenType.ASSIGN, char);
        }
        break;

      case '!':
        if (this.match('=')) {
          this.addToken(TokenType.NOT_EQUAL, '!=');
        } else {
          this.addToken(TokenType.NOT, char);
        }
        break;

      case '<':
        if (this.match('=')) {
          this.addToken(TokenType.LESS_EQUAL, '<=');
        } else {
          this.addToken(TokenType.LESS_THAN, char);
        }
        break;

      case '>':
        if (this.match('=')) {
          this.addToken(TokenType.GREATER_EQUAL, '>=');
        } else {
          this.addToken(TokenType.GREATER_THAN, char);
        }
        break;

      case '&':
        if (this.match('&')) {
          this.addToken(TokenType.AND, '&&');
        } else {
          this.addError('Unexpected character: &', start);
        }
        break;

      case '|':
        if (this.match('|')) {
          this.addToken(TokenType.OR, '||');
        } else {
          this.addError('Unexpected character: |', start);
        }
        break;

      // String literals
      case '"':
      case "'":
        this.scanString(char);
        break;

      // Whitespace
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace
        break;

      case '\n':
        this.line++;
        this.column = 1;
        break;

      default:
        if (this.isDigit(char)) {
          this.scanNumber(char);
        } else if (this.isAlpha(char)) {
          this.scanIdentifier(char);
        } else {
          this.addError(`Unexpected character: ${char}`, start);
        }
        break;
    }
  }

  private scanString(quote: string): void {
    const start = this.getCurrentLocation();
    let value = '';

    while (!this.isAtEnd() && this.peek() !== quote) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      value += this.advance();
    }

    if (this.isAtEnd()) {
      this.addError('Unterminated string', start);
      return;
    }

    // Consume closing quote
    this.advance();

    this.addToken(TokenType.STRING_LITERAL, value);
  }

  private scanNumber(firstDigit: string): void {
    let value = firstDigit;

    while (this.isDigit(this.peek())) {
      value += this.advance();
    }

    this.addToken(TokenType.NUMBER, value);
  }

  private scanIdentifier(firstChar: string): void {
    let value = firstChar;

    while (this.isAlphaNumeric(this.peek())) {
      value += this.advance();
    }

    // Check if it's a keyword
    const type = this.keywords.get(value) || TokenType.IDENTIFIER;
    this.addToken(type, value);
  }

  private skipLineComment(): void {
    while (!this.isAtEnd() && this.peek() !== '\n') {
      this.advance();
    }
  }

  private skipBlockComment(): void {
    while (!this.isAtEnd()) {
      if (this.peek() === '*' && this.peekNext() === '/') {
        this.advance(); // *
        this.advance(); // /
        return;
      }
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') ||
           (char >= 'A' && char <= 'Z') ||
           char === '_';
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.position) !== expected) return false;

    this.position++;
    this.column++;
    return true;
  }

  private advance(): string {
    const char = this.source.charAt(this.position);
    this.position++;
    this.column++;
    return char;
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.position);
  }

  private peekNext(): string {
    if (this.position + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.position + 1);
  }

  private isAtEnd(): boolean {
    return this.position >= this.source.length;
  }

  private getCurrentLocation(): SourceLocation {
    return {
      line: this.line,
      column: this.column,
      offset: this.position,
    };
  }

  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type,
      value,
      location: this.getCurrentLocation(),
    });
  }

  private addError(message: string, location: SourceLocation): void {
    this.errors.push({
      message,
      location,
      code: 'LEXER_ERROR',
    });
  }
}

/**
 * Tokenize MoveJS source code
 */
export function tokenize(source: string): LexerResult {
  const lexer = new Lexer(source);
  return lexer.tokenize();
}
