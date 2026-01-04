import { compile as js2moveCompile, tokenize, parse, analyze } from '@js2move/compiler';

export async function compile(source: string): Promise<string> {
  if (typeof source !== 'string') throw new Error('source must be a string');
  const result = js2moveCompile(source);
  if (typeof result === 'string') return result;
  return result.code;
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
