# Js2Move Architecture

Visual architecture and data flow diagrams for the Js2Move compiler project.

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interfaces                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   CLI Tool   │  │  Web UI      │  │  VS Code Extension   │  │
│  │              │  │  (Frontend)  │  │     (Future)         │  │
│  │  movejs      │  │              │  │                      │  │
│  │  compile     │  │  Next.js 14  │  │   Syntax Highlight   │  │
│  │  build       │  │              │  │   IntelliSense       │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │               │
└─────────┼─────────────────┼──────────────────────┼───────────────┘
          │                 │                      │
          │                 │ HTTP POST            │
          │                 ▼                      │
          │         ┌───────────────┐              │
          │         │   Backend     │              │
          │         │   API Server  │              │
          │         │               │              │
          │         │  /api/v1/     │              │
          │         │    compile    │              │
          │         └───────┬───────┘              │
          │                 │                      │
          └─────────────────┴──────────────────────┘
                            │
                            ▼
          ┌─────────────────────────────────────────┐
          │         @js2move/compiler               │
          │                                         │
          │   ┌──────────────────────────────┐     │
          │   │  Compilation Pipeline        │     │
          │   │                              │     │
          │   │  .movejs Source              │     │
          │   │       ▼                      │     │
          │   │  Lexer (Tokenize)            │     │
          │   │       ▼                      │     │
          │   │  Parser (Build AST)          │     │
          │   │       ▼                      │     │
          │   │  Semantic Analysis           │     │
          │   │       ▼                      │     │
          │   │  IR (Intermediate Rep)       │     │
          │   │       ▼                      │     │
          │   │  Code Generator              │     │
          │   │       ▼                      │     │
          │   │  .move Output                │     │
          │   └──────────────────────────────┘     │
          │                                         │
          └─────────────────────────────────────────┘
                            │
                            ▼
          ┌─────────────────────────────────────────┐
          │            Output                       │
          │                                         │
          │  • CLI: writes to file or stdout        │
          │  • API: returns JSON string             │
          │  • User deploys with Movement CLI       │
          └─────────────────────────────────────────┘
```

## 🔄 Compilation Pipeline (Detailed)

```
┌────────────────────────────────────────────────────────────────┐
│                    Input: .movejs File                          │
│                                                                 │
│  contract Token {                                               │
│    resource Balance;                                            │
│    transfer(from: signer, to: address, amount: u64) { ... }    │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│  STAGE 1: LEXER (Tokenization)                                 │
│                                                                 │
│  Output: Token Stream                                          │
│  [                                                              │
│    { type: 'KEYWORD', value: 'contract' },                     │
│    { type: 'IDENTIFIER', value: 'Token' },                     │
│    { type: 'LBRACE', value: '{' },                             │
│    { type: 'KEYWORD', value: 'resource' },                     │
│    { type: 'IDENTIFIER', value: 'Balance' },                   │
│    ...                                                          │
│  ]                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│  STAGE 2: PARSER (AST Construction)                            │
│                                                                 │
│  Output: Abstract Syntax Tree                                  │
│  {                                                              │
│    type: 'Contract',                                            │
│    name: 'Token',                                               │
│    resources: [                                                 │
│      { name: 'Balance', fields: [] }                            │
│    ],                                                           │
│    functions: [                                                 │
│      {                                                          │
│        name: 'transfer',                                        │
│        params: [...],                                           │
│        body: [...]                                              │
│      }                                                          │
│    ]                                                            │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│  STAGE 3: SEMANTIC ANALYSIS                                    │
│                                                                 │
│  • Type checking                                               │
│  • Resource ownership validation                               │
│  • Scope resolution                                            │
│  • Error detection                                             │
│                                                                 │
│  Output: Validated AST + Symbol Tables                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│  STAGE 4: IR GENERATION (Intermediate Representation)          │
│                                                                 │
│  • Platform-independent representation                         │
│  • Optimization passes                                         │
│  • Simplified structure                                        │
│                                                                 │
│  Output: IR Nodes                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│  STAGE 5: CODE GENERATOR                                       │
│                                                                 │
│  • Uses Handlebars templates                                   │
│  • Generates Move syntax                                       │
│  • Formats output                                              │
│                                                                 │
│  Templates: compiler/src/templates/*.hbs                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                    Output: .move File                          │
│                                                                 │
│  module Token {                                                │
│    resource struct Balance { value: u64 }                      │
│                                                                 │
│    public entry fun transfer(                                  │
│      from: &signer,                                            │
│      to: address,                                              │
│      amount: u64                                               │
│    ) { ... }                                                   │
│  }                                                              │
└────────────────────────────────────────────────────────────────┘
```

## 🗂️ Directory Structure & Data Flow

```
packages/compiler/
│
├── src/
│   ├── lexer/              ← Stage 1: Tokenization
│   │   └── index.ts            • Input: source string
│   │                           • Output: Token[]
│   │
│   ├── parser/             ← Stage 2: AST Building
│   │   └── index.ts            • Input: Token[]
│   │                           • Output: AST nodes
│   │
│   ├── ast/                ← AST Type Definitions
│   │   └── index.ts            • TypeScript interfaces for AST
│   │
│   ├── semantic/           ← Stage 3: Validation
│   │   └── index.ts            • Input: AST
│   │                           • Output: Validated AST
│   │
│   ├── ir/                 ← Stage 4: Intermediate Rep
│   │   └── index.ts            • Input: AST
│   │                           • Output: IR nodes
│   │
│   ├── generator/          ← Stage 5: Code Generation
│   │   └── index.ts            • Input: IR
│   │                           • Output: Move code string
│   │
│   └── templates/          ← Code Templates
│       └── contract.move.hbs   • Handlebars templates
│
├── examples/               ← User-Facing Examples
│   ├── 01-hello-world.movejs
│   ├── 02-simple-token.movejs
│   └── ...
│
└── tests/
    └── fixtures/           ← Test Cases
        ├── input/              • .movejs test inputs
        └── expected/           • .move expected outputs
```

## 🔀 API Request Flow

```
┌─────────┐
│ Client  │ (Web UI / curl / Postman)
└────┬────┘
     │
     │ POST /api/v1/compile
     │ { "source": "contract Token { ... }" }
     ▼
┌─────────────────────┐
│  Backend API        │
│  Express.js         │
│                     │
│  compiler.controller│
└────┬────────────────┘
     │
     │ calls compile(source)
     ▼
┌─────────────────────┐
│  Compiler Service   │
│                     │
│  tokenize()         │
│  parse()            │
│  toIR()             │
│  generateMove()     │
└────┬────────────────┘
     │
     │ returns Move code string
     ▼
┌─────────────────────┐
│  Backend API        │
│                     │
│  Returns JSON:      │
│  { "move": "..." }  │
└────┬────────────────┘
     │
     ▼
┌─────────┐
│ Client  │ receives compiled Move code
└─────────┘
```

## 📊 CLI Workflow

```
User's Project:
  src/
    Token.movejs
    NFT.movejs

User runs: movejs build --out-dir out/

┌──────────────────────┐
│   CLI (build.ts)     │
│                      │
│  1. Find *.movejs    │
│  2. For each file:   │
│     • Read source    │
│     • Compile        │
│     • Write output   │
└──────────────────────┘
          │
          ▼
  out/
    Token.move      ← Generated
    NFT.move        ← Generated

User runs: movement move publish
           (Standard Move deployment)
```

## 🧪 Test Flow

```
Test Suite Runs:
  pnpm test

┌──────────────────────────────┐
│  Auto-Discovery              │
│                              │
│  Scans:                      │
│    tests/fixtures/input/     │
│                              │
│  Finds:                      │
│    minimal.movejs            │
│    single-resource.movejs    │
│    simple-functions.movejs   │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  For each fixture:           │
│                              │
│  1. Read input file          │
│  2. Read expected output     │
│  3. Run compiler             │
│  4. Compare actual vs expect │
│  5. Assert equality          │
└──────────┬───────────────────┘
           │
           ▼
    Test Results
    ✓ minimal
    ✓ single-resource
    ✓ simple-functions
```

## 🎯 Key Insight: No Runtime

```
Traditional dApp:
  Write contracts → Build → Deploy → Execute on blockchain ✓

Js2Move (Compiler):
  Write .movejs → Compile → Generate .move → [User deploys]
                                             ▲
                                             └─ We stop here!
                                                Output is source code,
                                                not executable
```

## 📦 Package Dependencies

```
┌─────────────┐
│  CLI        │──┐
└─────────────┘  │
                 │
┌─────────────┐  │
│  Backend    │──┼──► ┌─────────────┐
│  (API)      │  │    │  Compiler   │
└─────────────┘  │    │   (Core)    │
                 ├───►│             │
┌─────────────┐  │    └─────────────┘
│  Frontend   │──┤             │
│  (Web UI)   │  │             │
└─────────────┘  │             ▼
                 │    ┌─────────────┐
┌─────────────┐  │    │ Shared      │
│  SDK        │──┘    │ Types       │
│  (Future)   │       └─────────────┘
└─────────────┘
```

---

**Visual Summary**: Js2Move is a **text-to-text compiler**. We transform one source format (MoveJS DSL) into another (Move language). No execution, no deployment, no runtime - just code generation.
