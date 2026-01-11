import { compile as js2moveCompile, tokenize, parse, analyze } from '@js2move/compiler';
import {
  analyzeMoveJSError,
  autoFixMoveJSCode,
  validateMoveJSStructure
} from './movejs-error-analyzer.service';

export interface CompileResult {
  success: boolean;
  code?: string;
  error?: string;
  analysis?: {
    error: string;
    description: string;
    suggestions: string[];
    examples?: { wrong: string; correct: string };
    canAutoFix: boolean;
    suggestedFix?: string | null;
  };
  autoFixOptions?: {
    canFix: boolean;
    fixedCode: string;
    changes: string[];
    requiresValidation: boolean;
  };
}

export async function compile(source: string): Promise<CompileResult> {
  if (typeof source !== 'string') throw new Error('source must be a string');
  
  try {
    const result = js2moveCompile(source);
    const code = typeof result === 'string' ? result : result.code;
    
    return {
      success: true,
      code
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown compilation error';
    
    // Analyze the error to provide helpful suggestions
    const analysis = analyzeMoveJSError(errorMessage, source);
    const autoFix = autoFixMoveJSCode(source);
    
    return {
      success: false,
      error: errorMessage,
      analysis,
      autoFixOptions: autoFix
    };
  }
}

export async function validate(source: string): Promise<{ valid: boolean; errors?: string[] }> {
  if (typeof source !== 'string') throw new Error('source must be a string');

  try {
    // Tokenize
    const lexerResult = tokenize(source);
    if (lexerResult.errors.length > 0) {
      return {
        valid: false,
        errors: lexerResult.errors.map(e => `${e.location.line}:${e.location.column} - ${e.message}`)
      };
    }

    // Parse
    const parserResult = parse(lexerResult.tokens);
    if (parserResult.errors.length > 0) {
      return {
        valid: false,
        errors: parserResult.errors.map(e => `${e.location.line}:${e.location.column} - ${e.message}`)
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : 'Unknown validation error']
    };
  }
}

export async function analyzeCode(source: string): Promise<{ valid: boolean; errors?: string[]; warnings?: string[] }> {
  if (typeof source !== 'string') throw new Error('source must be a string');

  try {
    // Tokenize
    const lexerResult = tokenize(source);
    if (lexerResult.errors.length > 0) {
      return {
        valid: false,
        errors: lexerResult.errors.map(e => `${e.location.line}:${e.location.column} - ${e.message}`)
      };
    }

    // Parse
    const parserResult = parse(lexerResult.tokens);
    if (parserResult.errors.length > 0) {
      return {
        valid: false,
        errors: parserResult.errors.map(e => `${e.location.line}:${e.location.column} - ${e.message}`)
      };
    }

    // Analyze
    const semanticResult = analyze(parserResult.ast);
    if (semanticResult.errors.length > 0) {
      return {
        valid: false,
        errors: semanticResult.errors.map(e => `${e.location.line}:${e.location.column} - ${e.message}`),
        warnings: semanticResult.warnings
      };
    }

    return {
      valid: true,
      warnings: semanticResult.warnings
    };
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : 'Unknown analysis error']
    };
  }
}
