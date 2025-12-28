/**
 * Compiler Error Classes
 */

import { CompileError } from '../api';

export class CompilationError extends Error {
  constructor(
    public errors: CompileError[],
    message?: string
  ) {
    super(message || 'Compilation failed');
    this.name = 'CompilationError';
  }
}

export class LexerError extends Error {
  constructor(
    public line: number,
    public column: number,
    message: string
  ) {
    super(`Lexer error at ${line}:${column}: ${message}`);
    this.name = 'LexerError';
  }
}

export class ParserError extends Error {
  constructor(
    public line: number,
    public column: number,
    message: string
  ) {
    super(`Parser error at ${line}:${column}: ${message}`);
    this.name = 'ParserError';
  }
}

export class GeneratorError extends Error {
  constructor(message: string) {
    super(`Generator error: ${message}`);
    this.name = 'GeneratorError';
  }
}
