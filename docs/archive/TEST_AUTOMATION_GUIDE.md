# Move Contract Testing & Checking Guide

## 🤖 Smart Unit Test Generator

Automatically analyzes Move contracts and generates appropriate unit tests.

### Usage
```bash
node scripts/auto-gen-tests.js <path-to-move-file>
```

### Features
- **Struct Analysis**: Detects all structs and fields
- **Function Detection**: Finds all public functions
- **Smart Test Generation**: Creates meaningful tests based on contract structure
- **Signer Handling**: Auto-generates `#[test(account = @...)]` for functions with signer params
- **Return Type Tests**: Generates tests for view/query functions
- **Backup Creation**: Automatically backs up existing code

### Examples
```bash
# Generate tests for example contract
node scripts/auto-gen-tests.js packages/compiler/out/aptos/example-demonstrates/sources/demonstrates.move

# Generate tests for fixture
node scripts/auto-gen-tests.js packages/compiler/out/aptos/fixture-contract/sources/Contract.move
```

### Generated Test Types
1. **Smoke Test** - Verifies module compiles
2. **Init Tests** - Tests initialization functions
3. **Signer Function Tests** - Tests entry functions with signer parameter
4. **View Function Tests** - Tests read-only functions with return values
5. **Struct Tests** - Tests struct creation and field assignments

---

## 🔍 Error Checking (Without Build)

Check Move code for syntax and compilation errors without building.

### Usage
```bash
bash scripts/check-move-errors.sh <package-directory>
```

### Examples
```bash
# Check example-demonstrates
bash scripts/check-move-errors.sh packages/compiler/out/aptos/example-demonstrates

# Check current directory (if it's a Move package)
bash scripts/check-move-errors.sh .
```

### What It Does
- Compiles with bytecode-version 6
- Extracts and displays only errors and warnings
- Skips build output files
- Shows clean error summary

### Sample Output
```
========================================
Move Code Check (Syntax & Errors)
Package: example-demonstrates
========================================

Checking syntax...
✓ No errors or warnings found!

========================================
Check complete. If no errors shown above, code is valid.
```

---

## 🧪 Build & Test All Packages

Automatically builds and tests all Move packages.

### Usage
```bash
bash scripts/test-and-build.sh
```

### What It Does
- Finds all packages in `packages/compiler/out/aptos/`
- For each package:
  1. Validates Move.toml exists
  2. Runs `movement move build`
  3. Runs `movement move test`
- Shows colored pass/fail summary
- Lists all failures at the end

### Sample Output
```
========================================
Move Contract Build & Test Suite
========================================

[Package: example-demonstrates]
─────────────────────────────────────
Building...
✓ Build successful
Running unit tests...
✓ Tests passed (3/3)

[Package: fixture-contract]
─────────────────────────────────────
Building...
✓ Build successful
Running unit tests...
⚠ No tests found

========================================
Summary
========================================
Passed:
  ✓ example-demonstrates
Failed:
  ✗ fixture-empty (test)
```

---

## 🏃 Workflow Recommendations

### 1. **New Contract Testing**
```bash
# Generate tests automatically
node scripts/auto-gen-tests.js packages/compiler/out/aptos/my-contract/sources/MyContract.move

# Check for errors
bash scripts/check-move-errors.sh packages/compiler/out/aptos/my-contract

# Run tests
movement move test --package-dir packages/compiler/out/aptos/my-contract --bytecode-version 6
```

### 2. **Batch Testing All Packages**
```bash
# Full build and test suite
bash scripts/test-and-build.sh
```

### 3. **Error Fixing**
```bash
# Quick error check (no build artifacts)
bash scripts/check-move-errors.sh packages/compiler/out/aptos/problem-package

# Fix errors shown...

# Verify fix
bash scripts/check-move-errors.sh packages/compiler/out/aptos/problem-package
```

---

## 📋 Movement CLI Commands Reference

### Build
```bash
movement move build --bytecode-version 6
```

### Test
```bash
movement move test --bytecode-version 6
```

### Prove (Formal Verification)
```bash
movement move prove --bytecode-version 6
# Note: Requires Boogie executable installed
```

### Check (Syntax/Error Only)
```bash
# Note: Movement uses "build" for checking, not "check"
# To see only errors without artifacts, use our check-move-errors.sh script
```

---

## 🐛 Troubleshooting

### "Tests already exist" error
- The script detects existing tests to prevent duplication
- Remove existing tests or manually edit the file
- A backup is created automatically

### Build fails with "cannot return nothing"
- The transpiler may generate incomplete return statements
- Manual fix needed in the generated .move file
- Example: `return a + b` → `return { a + b }`

### "No tests found" warning
- Contract has no `#[test]` functions
- Either tests haven't been generated yet, or the contract is test-free by design
- Run `auto-gen-tests.js` to create test stubs

---

## 📊 Test Generation Algorithm

The smart generator analyzes:

1. **Struct Detection** - Regex: `struct (\w+) { ... }`
2. **Function Extraction** - Regex: `public fun (\w+)(...)`
3. **Parameter Analysis** - Detects signer, return types
4. **Test Selection** - Chooses test type based on contract structure
5. **Code Generation** - Creates parameterized test templates

Result: Meaningful, function-specific tests that compile and run immediately.
