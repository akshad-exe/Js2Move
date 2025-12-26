# MoveJS Compiler

This package contains the compiler frontend for the MoveJS DSL: lexer, parser, AST, semantic analyzer, IR, and code generator.

It provides small, testable modules that convert `.movejs` DSL into Move source files.

## Development
- Build: `pnpm -w --filter @js2move/compiler build`
- Tests: `pnpm -w test` (not yet configured)

## Structure
- `src/lexer` — tokenization
- `src/parser` — AST building
- `src/ast` — AST (Abstract Syntax Tree) type definitions
- `src/semantic` — semantic checks
- `src/ir` — intermediate representation
- `src/generator` — Move code generation
- `src/templates` — templates for code generation
                                                                                                                