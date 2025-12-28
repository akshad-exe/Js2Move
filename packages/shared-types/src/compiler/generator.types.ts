/**
 * Generator Types - Code generation stage
 */

export enum Visibility {
  PUBLIC = 'public',
  ENTRY = 'entry',
  PRIVATE = 'private',
}

export enum Ability {
  KEY = 'key',
  STORE = 'store',
  COPY = 'copy',
  DROP = 'drop',
}

// ============================================
// TEMPLATE DATA STRUCTURES
// ============================================

export interface TemplateData {
  moduleName: string;
  address?: string;
  imports: TemplateImport[];
  structs: TemplateStruct[];
  functions: TemplateFunction[];
  constants?: TemplateConstant[];
}

export interface TemplateImport {
  module: string;
  items?: string[];
}

export interface TemplateStruct {
  name: string;
  abilities: string[];
  fields: TemplateField[];
  isResource: boolean;
}

export interface TemplateField {
  name: string;
  type: string;
  hasDefault?: boolean;
  defaultValue?: string;
}

export interface TemplateFunction {
  visibility: string;
  name: string;
  params: TemplateParam[];
  returnType?: string;
  acquires: string[];
  statements: TemplateStatement[];
  hasReturn: boolean;
}

export interface TemplateParam {
  name: string;
  type: string;
  isSigner: boolean;
  isReference: boolean;
  isMutable: boolean;
}

export interface TemplateStatement {
  type: 'assignment' | 'call' | 'return' | 'if' | 'while' | 'assert';
  code: string;
}

export interface TemplateConstant {
  name: string;
  type: string;
  value: string;
}

// ============================================
// GENERATOR OPTIONS
// ============================================

export interface GeneratorOptions {
  optimize?: boolean;
  includeComments?: boolean;
  format?: 'pretty' | 'minified';
  indentSize?: number;
}

export interface GeneratorResult {
  code: string;
  warnings?: GeneratorWarning[];
}

export interface GeneratorWarning {
  message: string;
  code: string;
}
