# Fixture Testing System

## ✅ What We Built

Created an **automated fixture-based testing system** that:
- Auto-discovers all test cases in `fixtures/input/`
- Compiles them and compares with expected outputs in `fixtures/expected/`
- Makes it easy to add new test cases

## 📁 Structure

```
tests/
├── fixtures/
│   ├── input/           # MoveJS source files (.movejs)
│   │   ├── minimal.movejs
│   │   ├── complex-contract.movejs
│   │   ├── control-flow.movejs
│   │   ├── expressions.movejs
│   │   ├── simple-functions.movejs
│   │   └── single-resource.movejs
│   │
│   └── expected/        # Expected Move output (.move)
│       ├── minimal.move
│       ├── complex-contract.move
│       └── ...
│
├── fixtures.test.js              # Auto-discovers and tests all fixtures
├── regenerate-fixtures.js        # Regenerates all expected outputs
├── ast.test.js                   # Unit tests
├── compiler.test.js
└── ... (other unit tests)
```

## 🧪 Test Commands

```bash
# Run all tests (43 tests)
pnpm test

# Run only fixture tests (8 tests)
pnpm test:fixtures

# Run only unit tests (35 tests)
pnpm test:unit

# Regenerate expected outputs (after compiler changes)
pnpm regenerate:fixtures

# Run demo scripts
pnpm test:simple
pnpm test:full
```

## ➕ Adding New Test Cases

1. **Create input file**: `fixtures/input/my-test.movejs`
   ```javascript
   contract MyTest {
     resource Data { value: u64 };
   }
   ```

2. **Generate expected output**:
   ```bash
   pnpm regenerate:fixtures
   ```

3. **Run tests**:
   ```bash
   pnpm test:fixtures
   ```

The test will automatically be discovered and run!

## 📊 Current Coverage

**7 Fixture Tests:**
- ✅ `minimal` - Minimal contract
- ✅ `empty` - Empty contract
- ✅ `single-resource` - Resource with initialization
- ✅ `simple-functions` - Basic functions
- ✅ `complex-contract` - Multiple resources & functions
- ✅ `control-flow` - If/while statements
- ✅ `expressions` - Math/logical/comparison expressions

**35 Unit Tests:**
- ✅ Lexer tests (5)
- ✅ Parser tests (5)
- ✅ AST tests (3)
- ✅ Semantic tests (5)
- ✅ IR tests (5)
- ✅ Generator tests (5)
- ✅ Compiler fixture tests (5)
- ✅ Demo scripts (2)

**Total: 43 tests passing** 🎉

## 🔄 Maintenance

When you modify the compiler output format:
1. Run `pnpm regenerate:fixtures` to update all expected outputs
2. Run `pnpm test` to verify everything still passes

This ensures your fixtures always match the current compiler output!
