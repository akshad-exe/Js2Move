/**
 * MoveJS Error Analysis Service
 * 
 * Analyzes MoveJS compilation errors and provides fix suggestions
 */

interface ErrorAnalysis {
  error: string;
  description: string;
  suggestions: string[];
  examples?: {
    wrong: string;
    correct: string;
  };
  canAutoFix: boolean;
  suggestedFix?: string | null;
}

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  resourceCount: number;
  hasInit: boolean;
}

interface ErrorReport {
  error: string;
  description: string;
  analysis: ErrorAnalysis;
  validation: ValidationResult;
  recommendations: string[];
  autoFixAvailable: boolean;
  suggestedFix?: string | null;
}

const COMMON_ERRORS: Record<string, {
  description: string;
  suggestions: string[];
  examples: { wrong: string; correct: string };
}> = {
  'Expected ")"': {
    description: 'Missing closing parenthesis in function declaration or parameters',
    suggestions: [
      'Check function declarations: fun name(...) {',
      'Verify all opening parentheses have closing ones',
      'Look for missing commas between parameters: (param1: type1, param2: type2)',
      'Check resource declarations: resource Name { fields };'
    ],
    examples: {
      wrong: 'contract Foo {\n  resource Bar { value: u64 }\n  init(owner: address {\n    // Missing closing paren\n  }\n}',
      correct: 'contract Foo {\n  resource Bar { value: u64 };\n  init(owner: address) {\n    // Correct\n  }\n}'
    }
  },
  'Expected ";"': {
    description: 'Missing semicolon after statement or resource declaration',
    suggestions: [
      'Add semicolon after resource declarations: resource Name { ... };',
      'Add semicolon after variable assignments: let x = value;',
      'Check function declarations end with closing brace, not semicolon',
      'Resource fields must end with semicolon'
    ],
    examples: {
      wrong: 'resource Balance { value: u64 }\ninit() {}',
      correct: 'resource Balance { value: u64 };\ninit() {}'
    }
  },
  'Expected "("': {
    description: 'Missing opening parenthesis in function call or declaration',
    suggestions: [
      'Check function calls have parentheses: functionName(...)',
      'Verify function declarations have parameters: fun name(...) {',
      'Look for missing parentheses in conditions: if (...) {',
      'Check getter/setter syntax'
    ],
    examples: {
      wrong: 'getBalance owner: address): u64 { }',
      correct: 'getBalance(owner: address): u64 { }'
    }
  }
};

/**
 * Analyze MoveJS compilation error and return suggestions
 */
export function analyzeMoveJSError(error: string, code: string): ErrorAnalysis {
  const trimmedError = error.trim();
  
  // Find matching error pattern
  const matchedError = Object.entries(COMMON_ERRORS).find(
    ([pattern]) => trimmedError.includes(pattern)
  );
  
  if (!matchedError) {
    return {
      error: trimmedError,
      description: 'Unknown compilation error',
      suggestions: [
        'Check MoveJS syntax against documentation',
        'Verify all resource declarations end with semicolon',
        'Ensure all opening braces/parentheses have closing counterparts',
        'Check function parameter syntax'
      ],
      canAutoFix: false
    };
  }
  
  const [errorPattern, errorInfo] = matchedError;
  
  return {
    error: errorPattern,
    description: errorInfo.description,
    suggestions: errorInfo.suggestions,
    examples: errorInfo.examples,
    canAutoFix: attemptAutoFix(errorPattern, code) !== null,
    suggestedFix: attemptAutoFix(errorPattern, code)
  };
}

/**
 * Attempt to automatically fix common compilation errors
 */
function attemptAutoFix(errorPattern: string, code: string): string | null {
  let fixed = code;
  
  // Fix missing semicolons after resource declarations
  if (errorPattern === 'Expected ";"') {
    fixed = fixed.replace(/(\bresource\s+\w+\s*\{[^}]+\})(\s*\n|\s*init|\s*[a-z])/g, '$1;$2');
    if (fixed !== code) return fixed;
  }
  
  // Fix missing closing parens in init/function declarations
  if (errorPattern === 'Expected ")"') {
    fixed = fixed.replace(/(\b(?:init|function)\s+\w*\s*\([^)]*)\s*\{/g, '$1) {');
    if (fixed !== code) return fixed;
  }
  
  // Fix missing opening parens in function declarations
  if (errorPattern === 'Expected "("') {
    fixed = fixed.replace(/(\b(?:init|function)\s+\w+)\s+([a-zA-Z])/g, '$1($2');
    if (fixed !== code) return fixed;
  }
  
  return null;
}

/**
 * Validate MoveJS code structure
 */
export function validateMoveJSStructure(code: string): ValidationResult {
  const warnings: string[] = [];
  
  // Check for contract declaration
  if (!code.includes('contract ')) {
    warnings.push('No contract declaration found');
  }
  
  // Check for resource declarations
  const resources = code.match(/resource\s+\w+/g) || [];
  
  // Check for init function
  if (!code.includes('init(')) {
    warnings.push('No init() function found. Consider adding initialization logic.');
  }
  
  // Check for missing semicolons after resources
  const resourceRegex = /resource\s+\w+\s*\{[^}]+\}(?!\s*;)/g;
  if (resourceRegex.test(code)) {
    warnings.push('Resource declarations might be missing semicolons');
  }
  
  // Check for unmatched parentheses
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    warnings.push(`Parentheses mismatch: ${openParens} opening, ${closeParens} closing`);
  }
  
  // Check for unmatched braces
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    warnings.push(`Braces mismatch: ${openBraces} opening, ${closeBraces} closing`);
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    resourceCount: resources.length,
    hasInit: code.includes('init(')
  };
}

/**
 * Generate a detailed error report with fixes
 */
export function generateErrorReport(error: string, code: string): ErrorReport {
  const analysis = analyzeMoveJSError(error, code);
  const validation = validateMoveJSStructure(code);
  
  return {
    error: analysis.error,
    description: analysis.description,
    analysis,
    validation,
    recommendations: [
      ...analysis.suggestions,
      ...validation.warnings.map(w => `Fix: ${w}`)
    ],
    autoFixAvailable: analysis.canAutoFix,
    suggestedFix: analysis.suggestedFix
  };
}

/**
 * Auto-fix MoveJS code
 */
export function autoFixMoveJSCode(code: string): {
  canFix: boolean;
  fixedCode: string;
  changes: string[];
  requiresValidation: boolean;
} {
  let fixedCode = code;
  const changes: string[] = [];
  
  // Fix missing semicolons after resources
  const resourceBefore = fixedCode;
  fixedCode = fixedCode.replace(/(\bresource\s+\w+\s*\{[^}]+\})(\s*\n|\s*init|\s*[a-z])/g, '$1;$2');
  if (fixedCode !== resourceBefore) {
    changes.push('Added missing semicolons after resource declarations');
  }
  
  // Fix missing closing parens
  const parenBefore = fixedCode;
  fixedCode = fixedCode.replace(/(\b(?:init|function)\s+\w*\s*\([^)]*)\s*\{/g, '$1) {');
  if (fixedCode !== parenBefore) {
    changes.push('Added missing closing parenthesis in function declarations');
  }
  
  return {
    canFix: changes.length > 0,
    fixedCode: fixedCode !== code ? fixedCode : code,
    changes,
    requiresValidation: changes.length > 0
  };
}
