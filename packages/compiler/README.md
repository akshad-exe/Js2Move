# MoveJS Compiler

This package contains the compiler frontend for the MoveJS DSL: lexer, parser, AST, semantic analyzer, IR, and code generator.

It provides small, testable modules that convert `.movejs` DSL into Move source files.

## Development
- Build: `pnpm -w --filter @js2move/compiler build`
- Tests: `pnpm -w test` (not yet configured)

## Formatting 🔧
We use the official Move formatter (`movefmt`) for canonical formatting when available. The test suite will try the official formatter first and fall back to the internal formatter if none is found.

Quick setup

- Windows (PowerShell):
  ```powershell
  # Install via Aptos CLI
  aptos update movefmt.exe

  # (Optional) Persist env var for future shells
  setx FORMATTER_EXE "C:\Users\<you>\.aptoscli\bin\movefmt.exe"

  # Make it available immediately in the current session
  $env:FORMATTER_EXE = 'C:\Users\<you>\.aptoscli\bin\movefmt.exe'
  ```

- macOS / Linux (bash):
  ```bash
  aptos update movefmt
  # or place `movefmt` on your PATH and/or set:
  export FORMATTER_EXE="/path/to/movefmt"
  ```

How tests use it

- `packages/compiler` tests will use the `FORMATTER_EXE` if set, or auto-detect common install locations (`~/.aptoscli/bin/movefmt`, `/usr/local/bin/movefmt`, etc.).
- If an official formatter is found, fixtures are formatted with it before comparisons for deterministic results.

CI recommendation ✅

- Ensure CI installs `movefmt` (e.g., run `aptos update movefmt` during the job) or sets the `FORMATTER_EXE` environment variable for the runner so tests exercise the canonical formatter.


## Structure
- `src/lexer` — tokenization
- `src/parser` — AST building
- `src/ast` — AST (Abstract Syntax Tree) type definitions
- `src/semantic` — semantic checks
- `src/ir` — intermediate representation
- `src/generator` — Move code generation
- `src/templates` — templates for code generation
                                                                                                                