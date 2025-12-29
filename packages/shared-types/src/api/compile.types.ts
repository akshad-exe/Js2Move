/**
 * API Types - Compilation endpoints
 */

import { GeneratorOptions } from '../compiler';

export interface CompileRequest {
  source: string;
  options?: GeneratorOptions;
}

export interface CompileResponse {
  success: boolean;
  output?: string;
  errors?: CompileError[];
  warnings?: CompileWarning[];
  executionTime?: number;
}

export interface CompileError {
  stage: 'lexer' | 'parser' | 'generator';
  message: string;
  line: number;
  column: number;
  code: string;
  suggestion?: string;
}

export interface CompileWarning {
  message: string;
  line: number;
  column: number;
  code: string;
}

export interface ValidationRequest {
  source: string;
}

export interface ValidationResponse {
  valid: boolean;
  errors: CompileError[];
  warnings: CompileWarning[];
}
