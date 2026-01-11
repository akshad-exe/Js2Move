# Move Transpiler Issues and Fixes

## Overview
During the deployment testing of Js2Move generated Move contracts, several critical issues were identified that prevent successful compilation and deployment to Movement blockchain. This document summarizes the issues found and the required fixes for the transpiler.

## Issues Identified

### 1. Incorrect Module Address Declaration
**Problem**: Generated Move code uses `address 0x1` for all modules, but custom modules should use their named address from Move.toml.

**Example (Wrong)**:
```move
address 0x1 {
module MyModule {
    // ...
}
}
```

**Fix**: Use the named address defined in Move.toml.
```move
address my-module {
module MyModule {
    // ...
}
}
```

**Move.toml**:
```toml
[addresses]
my-module = "0x..."
```

### 2. Incorrect Function Signatures for Entry Functions
**Problem**: Entry functions (transaction entry points) cannot return values. Getters should be `public fun`, not `public entry fun`.

**Example (Wrong)**:
```move
public entry fun get_balance(addr: address): u64 {
    return borrow_global<Balance>(addr).value;
}
```

**Fix**: Change to `public fun` for getters.
```move
public fun get_balance(addr: address): u64 acquires Balance {
    borrow_global<Balance>(addr).value
}
```

### 3. Wrong Parameter Types for move_to
**Problem**: `move_to` function requires `&signer`, not `address`.

**Example (Wrong)**:
```move
public entry fun init(owner: address, amount: u64) {
    move_to(owner, Resource { value: amount });
}
```

**Fix**: Use `&signer`.
```move
public entry fun init(owner: &signer, amount: u64) {
    move_to(owner, Resource { value: amount });
}
```

### 4. Missing Acquires Annotations
**Problem**: Functions that use `borrow_global` must declare which resources they acquire.

**Example (Wrong)**:
```move
public fun get_value(addr: address): u64 {
    borrow_global<MyResource>(addr).value
}
```

**Fix**: Add `acquires MyResource`.
```move
public fun get_value(addr: address): u64 acquires MyResource {
    borrow_global<MyResource>(addr).value
}
```

### 5. String Handling Issues
**Problem**: 
- `string` type doesn't exist; should be `String` from `std::string`
- `String` cannot be returned by value from borrowed resources (no copy ability)
- Returning references to borrowed data is invalid

**Example (Wrong)**:
```move
struct Data has key {
    value: string  // Wrong type
}

public fun get_value(addr: address): &String acquires Data {
    &borrow_global<Data>(addr).value  // Invalid return
}
```

**Fix**: Use primitive types like `u64` for simple examples, or handle strings properly.
```move
struct Data has key {
    value: u64  // Use copyable type
}

public fun get_value(addr: address): u64 acquires Data {
    borrow_global<Data>(addr).value
}
```

### 6. Unused Imports
**Problem**: Generated code includes unused imports, causing warnings.

**Fix**: Only import what's actually used.

### 7. Move.toml Address Mismatch
**Problem**: The address in `[addresses]` section must match the deployer's account address.

**Fix**: Ensure Move.toml has the correct deployer address:
```toml
[addresses]
my-module = "0xdf7530cf8405b200c2b87c8ff0dad54b2f4376a8b32b79841fdfd6be52b6f644"
```

## Required Transpiler Changes

### Code Generation Rules
1. **Module Declaration**: Use named address from package name, not `0x1`
2. **Function Classification**: 
   - Transaction functions → `public entry fun`
   - Read-only getters → `public fun` with return types
3. **Parameter Types**: Use `&signer` for functions that create/modify resources
4. **Resource Access**: Always add `acquires` annotations for `borrow_global`
5. **Type Mapping**: 
   - JavaScript `string` → Move `u64` (for simple cases) or proper string handling
   - JavaScript `number` → Move `u64`
6. **Import Management**: Only generate used imports

### Move.toml Generation
- Set module address to deployer address
- Ensure `std = "0x1"` for standard library

## Testing Recommendations
- Compile locally before deployment
- Test deployment with Movement CLI
- Verify bytecode compatibility
- Check for unused imports and warnings

## Examples of Fixed Code

### Before (Broken)
```move
address 0x1 {
module SimpleToken {
    use std::signer;
    use std::vector;
    
    struct Balance has key, store {
        value: u64
    }
    
    public entry fun init(owner: address, amount: u64) {
        move_to(owner, Balance { value: amount });
    }
    
    public entry fun get_balance(addr: address): u64 {
        return borrow_global<Balance>(addr).value;
    }
}
}
```

### After (Fixed)
```move
address simple-token {
module SimpleToken {
    use std::signer;
    
    struct Balance has key, store {
        value: u64
    }
    
    public entry fun init(owner: &signer, amount: u64) {
        move_to(owner, Balance { value: amount });
    }
    
    public fun get_balance(addr: address): u64 acquires Balance {
        borrow_global<Balance>(addr).value
    }
}
}
```

### 9. Unused Import Warnings
**Problem**: Generated code includes unused imports, causing compilation warnings.

**Example (Wrong)**:
```move
module MyModule {
    use std::signer;  // Not used
    use std::string::String;  // Not used
```

**Fix**: Only import what's actually used in the code.
```move
module MyModule {
    // Only include used imports
```</content>
<parameter name="filePath">e:\Codebase\Hackathon\Js2Move\docs\MoveTranspilerIssues.md