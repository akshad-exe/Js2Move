/**
 * @js2move/compiler
 * 
 * Main entry point - exports compiler pipeline
 */

// Export individual stages
export { tokenize } from './lexer/lexer.js';
export { parse } from './parser/parser.js';
export { generate } from './generator/generator.js';

// Export AST utilities
export * from './ast/index.js';

// Export semantic analyzer
export { analyze } from './semantic/index.js';

// Export IR
export { buildIR, optimize } from './ir/index.js';

// Full compilation pipeline
import { tokenize } from './lexer/lexer.js';
import { parse } from './parser/parser.js';
import { analyze } from './semantic/index.js';
import { buildIR, optimize } from './ir/index.js';
import { generate } from './generator/generator.js';
import { GeneratorOptions } from '@js2move/shared-types';

/**
 * Compilation options
 */
export interface CompileOptions extends GeneratorOptions {
  skipSemanticAnalysis?: boolean;
  optimizationLevel?: 0 | 1 | 2 | 3;
  outputIR?: boolean;
}

/**
 * Compilation result
 */
export interface CompileResult {
  code: string;
  warnings?: string[];
  ir?: any;
}

/**
 * Complete compilation: MoveJS source → Move code
 */
export function compile(source: string, options?: CompileOptions): string | CompileResult {
  // 1. Tokenize
  const lexerResult = tokenize(source);
  if (lexerResult.errors.length > 0) {
    const errors = lexerResult.errors.map(e => 
      `${e.location.line}:${e.location.column} - ${e.message}`
    ).join('\n');
    throw new Error(`Lexer errors:\n${errors}`);
  }

  // 2. Parse
  const parserResult = parse(lexerResult.tokens);
  if (parserResult.errors.length > 0) {
    const errors = parserResult.errors.map(e => 
      `${e.location.line}:${e.location.column} - ${e.message}`
    ).join('\n');
    throw new Error(`Parser errors:\n${errors}`);
  }

  // 3. Semantic Analysis (optional)
  let warnings: string[] = [];
  if (!options?.skipSemanticAnalysis) {
    const semanticResult = analyze(parserResult.ast);
    if (semanticResult.errors.length > 0) {
      const errors = semanticResult.errors.map(e => 
        `${e.location.line}:${e.location.column} - ${e.message}`
      ).join('\n');
      throw new Error(`Semantic errors:\n${errors}`);
    }
    warnings = semanticResult.warnings;
  }

  // 4. IR Generation & Optimization (optional)
  let ir: any;
  if (options?.optimizationLevel && options.optimizationLevel > 0) {
    ir = buildIR(parserResult.ast);
    ir = optimize(ir, options.optimizationLevel);
  }

  // 5. Code Generation
  const generatorResult = generate(parserResult.ast, options);
  
  // Return result
  if (options?.outputIR || warnings.length > 0) {
    const allWarnings = [
      ...warnings,
      ...(generatorResult.warnings?.map(w => typeof w === 'string' ? w : w.message) || [])
    ];
    return {
      code: generatorResult.code,
      warnings: allWarnings,
      ir,
    };
  }
  
  return generatorResult.code;
}
