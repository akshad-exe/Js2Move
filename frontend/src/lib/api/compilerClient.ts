import { apiClient } from './axiosClient';
import type {
  AnalysisResponse, 
  ValidationResponse,
  CompileError 
} from '../types';

export interface CompileResponse {
  move: string;
  warnings?: string[];
}

/**
 * Compile MoveJS to Move code
 */
export async function compileCode(source: string): Promise<{ success: boolean; code: string; warnings: string[] }> {
  try {
    const response = await apiClient.post<CompileResponse>('/public/compiler/compile', {
      source,
    });

    const moveCode = response.data.move || '';
    return {
      success: !!moveCode,
      code: moveCode,
      warnings: response.data.warnings || [],
    };
  } catch (error) {
    console.error('Compilation error:', error);
    const message = error instanceof Error ? error.message : 'Compilation failed';
    return {
      success: false,
      code: '',
      warnings: [message],
    };
  }
}

/**
 * Validate MoveJS syntax (no errors required)
 */
export async function validateCode(source: string): Promise<ValidationResponse> {
  try {
    const response = await apiClient.post<ValidationResponse>('/public/compiler/validate', {
      source,
    });

    return response.data;
  } catch (error) {
    console.error('Validation error:', error);
    return {
      valid: false,
      errors: [{ stage: 'lexer', message: 'Network error during validation', line: 0, column: 0, code: 'NETWORK_ERROR' }],
      warnings: [],
    };
  }
}

/**
 * Analyze code semantically (warnings allowed)
 */
export async function analyzeCode(source: string): Promise<AnalysisResponse> {
  try {
    const response = await apiClient.post<AnalysisResponse>('/public/compiler/analyze', {
      source,
    });

    return response.data;
  } catch (error) {
    console.error('Analysis error:', error);
    return {
      valid: false,
      errors: ['Network error during analysis'],
      warnings: [],
    };
  }
}

/**
 * Format error message for display
 */
export function formatError(error: CompileError): string {
  return `[${error.stage}] Line ${error.line}:${error.column} - ${error.message}${
    error.suggestion ? `\nSuggestion: ${error.suggestion}` : ''
  }`;
}

/**
 * Format all errors
 */
export function formatErrors(errors: CompileError[]): string {
  return errors.map(formatError).join('\n\n');
}

/**
 * Check if code has validation issues
 */
export function hasValidationIssues(validation: ValidationResponse): boolean {
  return validation.errors.length > 0;
}

/**
 * Check if code has warnings
 */
export function hasWarnings(validation: ValidationResponse): boolean {
  return validation.warnings.length > 0;
}
