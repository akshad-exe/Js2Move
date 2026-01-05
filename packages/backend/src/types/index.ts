/**
 * Backend Types - Barrel Export
 * 
 * Re-exports all types from backend modules
 */

export * from './api.types';
export * from './service.types';
export * from './config.types';

// Re-export from @js2move/shared-types for convenience
export type { 
  CompileError,
  CompileWarning,
  CompileRequest,
  CompileResponse,
  ValidationRequest,
  ValidationResponse
} from '@js2move/shared-types';
