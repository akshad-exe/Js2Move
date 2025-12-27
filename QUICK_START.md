# Js2Move Quick Start Guide

**For New Team Members** | Last Updated: December 27, 2025

## ⚡ TL;DR

- This is a **compiler**, not a dApp
- We convert `.movejs` → `.move` (JavaScript-like syntax → Move language)
- No blockchain needed to compile, just text transformation
- Users write `.movejs`, we generate `.move` files for them

## 🚀 Get Started in 5 Minutes

### 1. Clone & Install
```bash
git clone <repo-url>
cd Js2Move
pnpm install
```

### 2. Build the Project
```bash
pnpm build
```

### 3. Try the Compiler
```bash
cd packages/compiler/examples
pnpm --filter @js2move/cli dev

# In another terminal
node packages/cli/dist/index.js compile -s 01-hello-world.movejs
```

### 4. See the Output
You should see generated Move code in your terminal!

## 📁 Where Things Are

| What | Where |
|------|-------|
| **Compiler core** | `packages/compiler/src/` |
| **CLI tool** | `packages/cli/` |
| **API server** | `packages/backend/` |
| **User examples** | `packages/compiler/examples/` |
| **Test fixtures** | `packages/compiler/tests/fixtures/` |
| **Templates** | `packages/compiler/src/templates/` |

## 🎯 Common Tasks

### Add a New Language Feature
1. Update lexer: `packages/compiler/src/lexer/`
2. Update parser: `packages/compiler/src/parser/`
3. Update generator: `packages/compiler/src/generator/`
4. Add test fixture in `tests/fixtures/`
5. Run tests: `pnpm test`

### Add a New Example
1. Create `examples/XX-name.movejs`
2. Add comments explaining the feature
3. Test it compiles: `movejs compile -s XX-name.movejs`

### Run Tests
```bash
# All tests
pnpm test

# Specific package
pnpm --filter @js2move/compiler test

# Watch mode
pnpm test -- --watch
```

### Start Backend API
```bash
pnpm dev:backend
# API runs on http://localhost:3001
```

### Test API Endpoint
```bash
curl -X POST http://localhost:3001/api/v1/compile \
  -H "Content-Type: application/json" \
  -d '{"source": "contract Test { resource Data; }"}'
```

## 📚 Key Documents

- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Complete project explanation
- **[MoveSDK-doc.md](./MoveSDK-doc.md)** - Detailed compiler architecture
- **[packages/compiler/examples/](./packages/compiler/examples/)** - Example contracts
- **[README.md](./README.md)** - Original project README

## 🤔 FAQ

### Q: Where are the smart contracts?
**A:** There aren't any! We're a compiler that **generates** contracts. Users write `.movejs` files and we output `.move` files. They deploy those using standard Move tools.

### Q: Why was the `contracts` folder removed?
**A:** Because we don't deploy contracts ourselves. That folder implied we were a traditional dApp. We're a development tool.

### Q: Where do compiled files go?
**A:** 
- CLI: User specifies with `-o` or `--out-dir` (default: `./out/`)
- API: Returns string, no file
- Users write `.movejs` in their projects, we generate `.move` in their output folders

### Q: What's the difference between examples and fixtures?
**A:**
- **Examples** (`examples/`): Beautiful, documented, for users to learn from
- **Fixtures** (`tests/fixtures/`): Test cases, auto-discovered by tests, internal only

### Q: How do I test my changes?
1. Add a fixture in `tests/fixtures/input/`
2. Add expected output in `tests/fixtures/expected/`
3. Run `pnpm test`
4. Test auto-discovers and runs your fixture!

### Q: Can I use the compiler programmatically?
**A:** Yes!
```typescript
import { tokenize, parse, toIR, generateMove } from '@js2move/compiler';

const source = 'contract Token { resource Balance; }';
const move = generateMove(toIR(parse(tokenize(source))));
console.log(move);
```

## 🐛 Debugging

### Compiler not working?
```bash
# Rebuild everything
pnpm clean
pnpm install
pnpm build

# Check for errors
pnpm lint
```

### Tests failing?
```bash
# See detailed output
pnpm test -- --reporter=verbose

# Run single test
pnpm test -- minimal
```

### API not responding?
```bash
# Check backend logs
pnpm dev:backend

# Check database connection
# Edit packages/backend/.env
```

## 🎨 Development Workflow

### Daily Development
```bash
# Terminal 1: Watch compiler
pnpm --filter @js2move/compiler dev

# Terminal 2: Watch CLI
pnpm --filter @js2move/cli dev

# Terminal 3: Watch tests
pnpm test -- --watch
```

### Before Pushing Code
```bash
pnpm lint          # Check code quality
pnpm test          # Run all tests
pnpm build         # Ensure builds work
```

### Making a PR
1. Create feature branch
2. Make changes
3. Add tests
4. Update docs if needed
5. Run `pnpm test` and `pnpm lint`
6. Push and create PR

## 💬 Getting Help

- **Architecture questions?** Read [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- **Compiler internals?** Read [MoveSDK-doc.md](./MoveSDK-doc.md)
- **Can't find something?** Use `grep` or `git grep`
- **Still stuck?** Ask the team!

## 🎉 You're Ready!

Now read [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for the complete picture, then dive into the code!

---

**Pro Tip**: Start by reading an example in `packages/compiler/examples/`, then trace through the compiler to see how it gets transformed into Move code.
