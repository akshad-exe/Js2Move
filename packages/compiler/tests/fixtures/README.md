# Test Fixtures

This directory contains test fixtures for the MoveJS compiler test suite.

## 📂 Structure

```
fixtures/
├── input/       # MoveJS source files (.movejs)
└── expected/    # Expected Move output files (.move)
```

## 🎯 Purpose

Fixtures are used for **automated regression testing**. Each `.movejs` file in `input/` should have a corresponding `.move` file in `expected/` with the correct compiled output.

## 🧪 How Tests Use Fixtures

Tests automatically discover all fixtures and create test cases:

```typescript
// Test suite auto-discovers and tests all fixtures
const fixtures = glob.sync('fixtures/input/**/*.movejs');

fixtures.forEach((inputPath) => {
  test(`compiles ${inputPath}`, () => {
    const input = readFile(inputPath);
    const expected = readFile(inputPath.replace('/input/', '/expected/'));
    const output = compile(input);
    expect(output).toBe(expected);
  });
});
```

## ➕ Adding New Tests

1. **Create input file**: `fixtures/input/my-test.movejs`
2. **Create expected output**: `fixtures/expected/my-test.move`
3. **Run tests**: `pnpm test`

The test suite will automatically discover and run your new test!

## 📝 Fixture Categories

### Basic Syntax
- `minimal.movejs` - Simplest valid contract
- `empty-contract.movejs` - Contract with no content
- `comments.movejs` - Various comment styles

### Resources
- `single-resource.movejs` - One resource definition
- `multiple-resources.movejs` - Multiple resources
- `resource-with-fields.movejs` - Resources with typed fields

### Functions
- `simple-function.movejs` - Basic function definition
- `function-with-params.movejs` - Functions with parameters
- `function-with-return.movejs` - Functions with return types

### Edge Cases
- `unicode-identifiers.movejs` - Unicode in names
- `max-nesting.movejs` - Deeply nested structures
- `long-identifiers.movejs` - Very long names

### Error Cases (should fail gracefully)
- `syntax-error.movejs` - Invalid syntax
- `type-error.movejs` - Type mismatch
- `undefined-resource.movejs` - Reference to undefined resource

## 🔍 Fixture Naming Convention

Use descriptive names that indicate what is being tested:

- `feature-name.movejs` - Test a specific feature
- `edge-case-description.movejs` - Test edge cases
- `error-type.movejs` - Test error handling

## 💡 Tips

- Keep fixtures focused on one feature/case
- Use meaningful names
- Include comments explaining what's being tested
- Keep expected output formatted and readable
- Test both success and failure cases

## 🚫 What NOT to Put Here

- ❌ User-facing examples (use `examples/` instead)
- ❌ Documentation samples
- ❌ Complex real-world contracts (use `examples/`)

Fixtures are for testing, not teaching!
