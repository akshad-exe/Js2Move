# MoveJS Examples

This directory contains example `.movejs` files demonstrating the MoveJS DSL syntax.

## 📚 Learning Path

Follow the examples in order for progressive learning:

1. **01-hello-world.movejs** - Simplest possible contract
2. **02-simple-token.movejs** - Basic token with balance tracking
3. **03-nft.movejs** - Non-fungible token pattern
4. **04-defi-vault.movejs** - Advanced DeFi pattern

## 🚀 Using Examples

### Compile a Single Example:
```bash
cd packages/compiler/examples
movejs compile -s 02-simple-token.movejs -o token.move
```

### View Generated Output:
```bash
movejs compile -s 01-hello-world.movejs
```

### Copy and Modify:
```bash
# Copy an example to your project
cp packages/compiler/examples/02-simple-token.movejs my-project/src/

# Modify and compile
cd my-project
movejs build --out-dir out/
```

## 📖 Example Descriptions

### 01-hello-world.movejs
A minimal contract showing basic structure and syntax.

### 02-simple-token.movejs
Demonstrates:
- Resource definitions
- Balance tracking
- Transfer functions
- Access control

### 03-nft.movejs
Demonstrates:
- Unique token IDs
- Ownership tracking
- Minting and burning

### 04-defi-vault.movejs
Demonstrates:
- Deposit/withdraw patterns
- Yield calculation
- Complex state management

## 💡 Tips

- Read the inline comments for explanations
- Start simple and gradually add complexity
- Use these as templates for your own contracts
- Compile and inspect the generated Move code to learn

## 🐛 Issues?

If an example doesn't compile, please file an issue with:
- The example file name
- Error message
- Expected behavior
