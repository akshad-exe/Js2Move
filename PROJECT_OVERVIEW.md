# Js2Move Project Overview

**Last Updated**: December 27, 2025

## 🎯 What Is This Project?

Js2Move is a **complete development platform** that allows developers to write, compile, test, and deploy Move smart contracts using a JavaScript-like syntax.

**Think of it as Hardhat/Foundry for Movement blockchain.**

## 🚀 Core Features

**Compilation:**
- ✅ Write contracts in JavaScript-like DSL (`.movejs`)
- ✅ Compile to Move language (`.move`)
- ✅ Full type checking and validation

**Deployment (NEW):**
- ✅ One-click deployment from web UI
- ✅ CLI deployment: `movejs deploy Token.movejs`
- ✅ Track deployment history and contract addresses
- ✅ Support for testnet and mainnet

**Developer Tools:**
- ✅ CLI for local development
- ✅ Web-based IDE with deployment
- ✅ API for programmatic access
- ✅ Future: VS Code extension

**This is NOT:**
- ❌ A JavaScript runtime on blockchain
- ❌ A JavaScript-to-bytecode compiler

**This IS:**
- ✅ A complete development platform (compile + deploy)
- ✅ A DSL compiler (MoveJS → Move)
- ✅ Like Hardhat, but for Movement blockchain

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer's Workflow                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Write .movejs files (JavaScript-like syntax)            │
│     ↓                                                        │
│  2. Run: movejs compile MyToken.movejs                       │
│     ↓                                                        │
│  3. Get: MyToken.move (valid Move source code)              │
│     ↓                                                        │
│  4. Deploy using Movement CLI (standard Move deployment)     │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Compiler Pipeline:
.movejs Source → Lexer → Parser → AST → Semantic → IR → Generator → .move Output
```

---

## 📦 Project Structure

```
Js2Move/
├── packages/
│   ├── compiler/          # Core compiler (lexer, parser, generator)
│   │   ├── src/
│   │   │   ├── lexer/     # Tokenization
│   │   │   ├── parser/    # AST building
│   │   │   ├── ast/       # AST type definitions
│   │   │   ├── semantic/  # Semantic analysis
│   │   │   ├── ir/        # Intermediate representation
│   │   │   ├── generator/ # Move code generation
│   │   │   └── templates/ # Handlebars templates for Move code
│   │   ├── examples/      # Sample .movejs files for users
│   │   └── tests/
│   │       └── fixtures/  # Test input/output pairs
│   │
│   ├── cli/               # Command-line interface
│   │   └── src/
│   │       └── commands/
│   │           ├── compile.ts  # Single file compilation
│   │           └── build.ts    # Batch compilation
│   │
│   ├── backend/           # API service + blockchain indexer
│   │   └── src/
│   │       ├── api/       # REST API endpoints
│   │       │   └── controllers/v1/public/
│   │       │       └── compiler.controller.ts  # POST /compile endpoint
│   │       └── indexer/   # Blockchain event indexer
│   │
│   ├── sdk/               # JavaScript/TypeScript SDK (future)
│   └── shared-types/      # Shared TypeScript types
│
├── frontend/              # Web UI (Next.js 14)
├── docs/                  # Documentation
├── docker/                # Docker configurations
└── scripts/               # Development scripts
```

---

## 🔄 How the Compiler Works

### Compilation Pipeline:

```
1. LEXER (Tokenization)
   Input:  contract Token { resource Balance; }
   Output: [KEYWORD(contract), IDENTIFIER(Token), LBRACE, ...]

2. PARSER (AST Building)
   Input:  Tokens
   Output: Abstract Syntax Tree (AST)

3. SEMANTIC ANALYZER
   - Type checking
   - Resource ownership validation
   - Scope resolution

4. INTERMEDIATE REPRESENTATION (IR)
   - Platform-independent representation
   - Optimizations

5. CODE GENERATOR
   Input:  IR
   Output: Valid Move source code
```

### Example:

**Input (`.movejs`):**
```javascript
contract Token {
  resource Balance;

  init(owner: address, supply: u64) {
    Balance[owner] = supply;
  }

  transfer(from: signer, to: address, amount: u64) {
    assert(Balance[from] >= amount);
    Balance[from] -= amount;
    Balance[to] += amount;
  }
}
```

**Output (`.move`):**
```move
module Token {
  resource struct Balance { value: u64 }

  public entry fun init(owner: address, supply: u64) {
    move_to(&owner, Balance { value: supply });
  }

  public entry fun transfer(from: &signer, to: address, amount: u64) {
    // ... generated Move code
  }
}
```

---

## 🚀 Usage Patterns

### 1. CLI Usage (Local Development)

```bash
# Single file compilation
movejs compile -s MyToken.movejs -o MyToken.move

# Batch compilation (all .movejs files in current dir)
movejs build --out-dir out/

# Output structure:
# src/
#   Token.movejs
#   NFT.movejs
# out/
#   Token.move    # ← Generated
#   NFT.move      # ← Generated
```

### 2. API Usage (Web UI / CI/CD)

```bash
POST /api/v1/compile
Content-Type: application/json

{
  "source": "contract Token { resource Balance; }"
}

Response:
{
  "move": "module Token { ... }"
}
```

### 3. Programmatic Usage

```typescript
import { tokenize, parse, toIR, generateMove } from '@js2move/compiler';

const source = 'contract Token { resource Balance; }';
const tokens = tokenize(source);
const ast = parse(tokens);
const ir = toIR(ast);
const move = generateMove(ir);

console.log(move); // Valid Move code
```

---

## 🗂️ Key Directories Explained

### `packages/compiler/src/templates/`
- **Purpose**: Handlebars templates for generating Move code
- **Example**: `contract.move.hbs` - template for Move modules
- **Usage**: Used by the code generator to output properly formatted Move code

### `packages/compiler/examples/`
- **Purpose**: User-facing sample `.movejs` files
- **Audience**: Developers learning the MoveJS DSL
- **Characteristics**: 
  - Well-documented with comments
  - Progressive complexity (simple → advanced)
  - Shows best practices
  - Copy-paste ready

### `packages/compiler/tests/fixtures/`
- **Purpose**: Test cases for automated testing
- **Structure**:
  ```
  fixtures/
  ├── input/       # .movejs test inputs
  └── expected/    # .move expected outputs
  ```
- **Usage**: Auto-discovered by test suite for regression testing

### ⚠️ What We DON'T Have (Intentionally):

- ❌ `packages/contracts/` - **REMOVED** (we don't deploy contracts, we generate them)
- ❌ `artifacts/` - No build artifacts from contracts
- ❌ `deployments/` - No deployment scripts

---

## 🧪 Testing Strategy

### Auto-Generated Tests:

```typescript
// Tests automatically discover fixtures and generate test cases
const fixtures = glob.sync('tests/fixtures/input/**/*.movejs');

fixtures.forEach((inputPath) => {
  test(`compiles ${inputPath}`, () => {
    const input = readFile(inputPath);
    const expected = readFile(inputPath.replace('/input/', '/expected/'));
    
    const output = compile(input);
    expect(output).toBe(expected);
  });
});
```

**To add a new test:**
1. Add `my-test.movejs` to `tests/fixtures/input/`
2. Add `my-test.move` to `tests/fixtures/expected/`
3. Test automatically runs!

---

## 🎯 Development Workflow

### Setting Up:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development
pnpm dev:cli          # CLI development
pnpm dev:backend      # API server
pnpm dev:frontend     # Web UI
```

### Testing:

```bash
# Run all tests
pnpm test

# Test specific package
pnpm --filter @js2move/compiler test

# Update snapshots
pnpm test -- -u
```

### Building:

```bash
# Build all
pnpm build

# Build specific package
pnpm build:compiler
pnpm build:cli
```

---

## 📚 Key Concepts for Teammates

### 1. **This is a Compiler Project**
- We transform source code (MoveJS) → target code (Move)
- We DO NOT execute contracts
- We DO NOT deploy contracts
- We GENERATE contracts

### 2. **Output Goes to User's Project**
- Users write `.movejs` files in their projects
- They run our CLI: `movejs build`
- We generate `.move` files in their `out/` folder
- They deploy those `.move` files using Movement CLI

### 3. **No Blockchain Runtime Needed**
- Compilation is pure text transformation
- No blockchain connection needed to compile
- Only the backend indexer needs blockchain access (separate concern)

### 4. **Templates vs Examples vs Fixtures**
- **Templates** (`src/templates/`): Code generation templates (for our compiler)
- **Examples** (`examples/`): Sample code for users to learn from
- **Fixtures** (`tests/fixtures/`): Test cases for our test suite

---

## 🔮 Future Roadmap

- [ ] VS Code extension (syntax highlighting, IntelliSense)
- [ ] Advanced DSL features (generics, imports)
- [ ] Optimization passes in IR
- [ ] Source maps for debugging
- [ ] Interactive playground on website
- [ ] Package registry for reusable MoveJS modules

---

## 🤝 Contributing

### Adding a New Language Feature:

1. **Lexer**: Add token types in `compiler/src/lexer/`
2. **Parser**: Update AST nodes in `compiler/src/parser/`
3. **Semantic**: Add validation in `compiler/src/semantic/`
4. **Generator**: Update Move generation in `compiler/src/generator/`
5. **Templates**: Update templates if needed
6. **Tests**: Add fixtures for the new feature
7. **Examples**: Add user-facing example

### Testing Your Changes:

```bash
# Add test fixture
echo "contract Test { /* new feature */ }" > tests/fixtures/input/new-feature.movejs
echo "module Test { /* expected output */ }" > tests/fixtures/expected/new-feature.move

# Run tests
pnpm test
```

---

## 📖 Additional Resources

- [MoveSDK-doc.md](./MoveSDK-doc.md) - Detailed compiler architecture
- [packages/compiler/README.md](./packages/compiler/README.md) - Compiler package docs
- [packages/cli/README.md](./packages/cli/README.md) - CLI usage guide

---

## 💡 Quick Mental Model

Think of Js2Move like:
- **TypeScript → JavaScript** (but for blockchain)
- **Sass → CSS** (but for smart contracts)
- **Babel** (but for Move language)

We're a **transpiler/compiler**, not a runtime or deployment tool.
