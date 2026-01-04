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

export interface ValidationResponse {
  valid: boolean;
  errors: CompileError[];
  warnings: CompileWarning[];
}

export interface AnalysisResponse {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface ValidateRequest {
  source: string;
}
