/**
 * Lexer Types - Tokenization stage
 */

export enum TokenType {
  // Keywords
  CONTRACT = 'CONTRACT',
  RESOURCE = 'RESOURCE',
  FUNCTION = 'FUNCTION',
  STRUCT = 'STRUCT',
  RETURN = 'RETURN',
  IF = 'IF',
  ELSE = 'ELSE',
  FOR = 'FOR',
  WHILE = 'WHILE',
  ASSERT = 'ASSERT',
  EMIT = 'EMIT',
  HAS_RESOURCE = 'HAS_RESOURCE',
  
  // Types
  U8 = 'U8',
  U64 = 'U64',
  U128 = 'U128',
  BOOL = 'BOOL',
  ADDRESS = 'ADDRESS',
  SIGNER = 'SIGNER',
  STRING = 'STRING',
  VECTOR = 'VECTOR',
  
  // Identifiers & Literals
  IDENTIFIER = 'IDENTIFIER',
  NUMBER = 'NUMBER',
  STRING_LITERAL = 'STRING_LITERAL',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  
  // Operators
  PLUS = 'PLUS',              // +
  MINUS = 'MINUS',            // -
  MULTIPLY = 'MULTIPLY',      // *
  DIVIDE = 'DIVIDE',          // /
  MODULO = 'MODULO',          // %
  ASSIGN = 'ASSIGN',          // =
  PLUS_ASSIGN = 'PLUS_ASSIGN', // +=
  MINUS_ASSIGN = 'MINUS_ASSIGN', // -=
  EQUAL = 'EQUAL',            // ==
  NOT_EQUAL = 'NOT_EQUAL',    // !=
  LESS_THAN = 'LESS_THAN',    // <
  GREATER_THAN = 'GREATER_THAN', // >
  LESS_EQUAL = 'LESS_EQUAL',  // <=
  GREATER_EQUAL = 'GREATER_EQUAL', // >=
  AND = 'AND',                // &&
  OR = 'OR',                  // ||
  NOT = 'NOT',                // !
  
  // Delimiters
  LPAREN = 'LPAREN',          // (
  RPAREN = 'RPAREN',          // )
  LBRACE = 'LBRACE',          // {
  RBRACE = 'RBRACE',          // }
  LBRACKET = 'LBRACKET',      // [
  RBRACKET = 'RBRACKET',      // ]
  SEMICOLON = 'SEMICOLON',    // ;
  COMMA = 'COMMA',            // ,
  COLON = 'COLON',            // :
  DOT = 'DOT',                // .
  ARROW = 'ARROW',            // ->
  
  // Special
  EOF = 'EOF',
  NEWLINE = 'NEWLINE',
  WHITESPACE = 'WHITESPACE',
  COMMENT = 'COMMENT',
}

export interface SourceLocation {
  line: number;
  column: number;
  offset: number;
}

export interface SourceRange {
  start: SourceLocation;
  end: SourceLocation;
}

export interface Token {
  type: TokenType;
  value: string;
  location: SourceLocation;
  range?: SourceRange;
}

export interface LexerResult {
  tokens: Token[];
  errors: LexerErrorInfo[];
}

export interface LexerErrorInfo {
  message: string;
  location: SourceLocation;
  code: string;
}
