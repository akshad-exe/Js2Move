# Compiler Test Coverage

## Test Files (8 Tests)

### Component Tests (1 per component)
1. **test-lexer.js** - Tokenization
2. **test-parser.js** - AST generation  
3. **test-ast.js** - AST visitor & printer
4. **test-semantic.js** - Semantic analysis & type checking
5. **test-ir.js** - IR generation & optimization
6. **test-generator.js** - Code generation with Handlebars templates

### Integration Tests
7. **test-simple.js** - Basic end-to-end compilation
8. **test-comprehensive.js** - Full pipeline with all 7 components

## Coverage Matrix

| Component | Files Tested | Test Files |
|-----------|-------------|-----------|
| **Lexer** | `src/lexer/lexer.ts` | test-lexer.js, test-parser.js, test-expression.js, test-simple.js, test-all.js |
| **Parser** | `src/parser/parser.ts` | test-parser.js, test-expression.js, test-simple.js, test-all.js |
| **AST** | `src/ast/visitor.ts`, `src/ast/printer.ts` | test-ast.js ✨ NEW |
| **Semantic** | `src/semantic/analyzer.ts` | test-semantic.js ✨ NEW |
| **IR** | `src/ir/ir-builder.ts`, `src/ir/optimizer.ts` | test-ir.js ✨ NEW |
| **Generator** | `src/generator/generator.ts` | test-simple.js, test-all.js |
| **Compiler** | `src/compiler.ts` (full pipeline) | test-all.js ✨ NEW |

## What Each Test Validates

### test-lexer.js
- ✅ Tokenization of MoveJS syntax
- ✅ Token types recognition (keywords, operators, literals)
- ✅ Error reporting for invalid tokens

### test-parser.js
- ✅ AST construction from tokens
- ✅ Contract, resource, and function parsing
- ✅ Parser error messages with location

### test-expression.js
- ✅ Expression parsing (binary, assignment, index)
- ✅ Operator precedence
- ✅ Complex expression trees

### test-simple.js
- ✅ End-to-end: MoveJS → Move code
- ✅ Resource declaration compilation
- ✅ Function compilation
- ✅ Code formatting options

### test-ast.js ✨ NEW
- ✅ AST Visitor pattern functionality
- ✅ Node counting and traversal
- ✅ Pretty printer (AST → source code)
- ✅ Custom visitor implementations

### test-semantic.js ✨ NEW
- ✅ Type checking (numeric, boolean, etc.)
- ✅ Undefined identifier detection
- ✅ Duplicate parameter detection
- ✅ Type mismatch errors
- ✅ Scope resolution

### test-ir.js ✨ NEW
- ✅ IR generation from AST
- ✅ IR instruction emission
- ✅ Basic block creation
- ✅ Constant folding optimization
- ✅ Dead code elimination
- ✅ Optimization levels (0-3)

### test-all.js ✨ NEW
- ✅ Multiple test cases
- ✅ All compiler options (optimization, IR output)
- ✅ Control flow compilation (if/else)
- ✅ Comprehensive integration test

## Test Results

All 8 test files pass successfully! ✅

```
✅ test-lexer.js          - Lexer tokenization
✅ test-parser.js         - Parser AST construction
✅ test-ast.js            - AST visitor & printer
✅ test-semantic.js       - Semantic analyzer (4 error types)
✅ test-ir.js             - IR generation & optimization
✅ test-generator.js      - Handlebars template generation
✅ test-simple.js         - Basic compilation (Lexer→Parser→Generator)
✅ test-comprehensive.js  - Full pipeline (all 7 components)
```

## Running Tests

```bash
# All tests at once
cd packages/compiler
pnpm test

# Individual component tests
pnpm test:simple         # Quick basic test
pnpm test:full          # Comprehensive all-components test

# Or run individually
cd tests
node test-lexer.js
node test-parser.js
node test-ast.js
node test-semantic.js
node test-ir.js
node test-generator.js
node test-simple.js
node test-comprehensive.js
```

## Coverage Summary

✅ **100% Component Coverage** - All 7 compiler components tested
✅ **Integration Tests** - Full pipeline validated
✅ **Error Handling** - Parser, lexer, and semantic errors tested
✅ **Optimization** - IR optimizer validated with constant folding
