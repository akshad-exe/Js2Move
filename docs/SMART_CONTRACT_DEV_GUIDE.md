# 🎯 Smart Contract Developer Guide

**Role**: Move/Smart Contract Expert for Js2Move Compiler Project

---

## 📋 Overview

As the smart contract developer, you are the **Move language expert** responsible for ensuring that our MoveJS DSL compiles to correct, secure, and idiomatic Move code. You bridge the gap between JavaScript-like syntax and Movement blockchain requirements.

**Your Mission**: Make sure everything we generate works perfectly on Movement blockchain.

---

## 🎯 Core Responsibilities

### 1. **Define DSL-to-Move Mappings** ⭐ CRITICAL

You decide: "When user writes X in MoveJS, we generate Y in Move"

#### Example Mapping:

**Input (MoveJS):**
```javascript
contract Token {
  resource Balance;
  
  transfer(from: signer, to: address, amount: u64) {
    Balance[from] -= amount;
    Balance[to] += amount;
  }
}
```

**Output (Move) - You Design This:**
```move
module Token {
  struct Balance has key {
    value: u64
  }
  
  public entry fun transfer(from: &signer, to: address, amount: u64) 
    acquires Balance {
    let from_addr = signer::address_of(from);
    let from_balance = borrow_global_mut<Balance>(from_addr);
    assert!(from_balance.value >= amount, ERROR_INSUFFICIENT_BALANCE);
    
    from_balance.value = from_balance.value - amount;
    
    if (exists<Balance>(to)) {
      let to_balance = borrow_global_mut<Balance>(to);
      to_balance.value = to_balance.value + amount;
    } else {
      move_to(&to, Balance { value: amount });
    }
  }
}
```

#### Your Tasks:
- [ ] Document all MoveJS constructs
- [ ] Define Move equivalent for each
- [ ] Handle edge cases
- [ ] Ensure safety and correctness

---

### 2. **Create Move Code Templates**

**Location**: `packages/compiler/src/templates/`

#### Current State (Needs Your Work):
```handlebars
// contract.move.hbs (too simple!)
module {{moduleName}} {
  {{#each resources}}
  resource struct {{this}} { value: u64 }
  {{/each}}
}
```

#### What You Should Create:

```
packages/compiler/src/templates/
├── module.move.hbs              # Module structure
├── resource.move.hbs            # Resource definitions
├── struct.move.hbs              # Struct definitions
├── function.move.hbs            # Function templates
├── entry-function.move.hbs      # Public entry functions
├── view-function.move.hbs       # View/read functions
├── init.move.hbs                # Initialization logic
├── transfer.move.hbs            # Transfer patterns
├── assert.move.hbs              # Assertion templates
├── events.move.hbs              # Event emission
├── errors.move.hbs              # Error definitions
└── imports.move.hbs             # Standard library imports
```

#### Example Template You Should Write:

```handlebars
{{!-- templates/entry-function.move.hbs --}}
public entry fun {{name}}(
  {{#each params}}
  {{name}}: {{#if isSigner}}&signer{{else if isReference}}&{{type}}{{else}}{{type}}{{/if}}{{#unless @last}},{{/unless}}
  {{/each}}
){{#if acquires}} acquires {{#each acquires}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}} {
  {{#if needsSigner}}
  let sender = signer::address_of({{signerParam}});
  {{/if}}
  
  {{#each assertions}}
  assert!({{condition}}, {{errorCode}});
  {{/each}}
  
  {{#each statements}}
  {{> statement this}}
  {{/each}}
  
  {{#if emitEvent}}
  event::emit({{eventName}} {
    {{#each eventFields}}
    {{name}}: {{value}},
    {{/each}}
  });
  {{/if}}
}
```

---

### 3. **Write Comprehensive Examples**

**Location**: `packages/compiler/examples/`

#### Examples You Should Create:

| File | Pattern | Difficulty |
|------|---------|------------|
| `05-coin-standard.movejs` | Aptos Coin standard | Intermediate |
| `06-nft-collection.movejs` | NFT with metadata | Intermediate |
| `07-staking.movejs` | Token staking | Advanced |
| `08-multisig.movejs` | Multi-signature wallet | Advanced |
| `09-dao-governance.movejs` | DAO voting | Advanced |
| `10-dex-swap.movejs` | Token swap | Expert |
| `11-lending.movejs` | Lending protocol | Expert |
| `12-oracle.movejs` | Price oracle | Expert |

#### Example You Should Write:

```javascript
// examples/05-coin-standard.movejs
/**
 * Token Standard (Following Aptos Coin Standard)
 * 
 * This implements a fungible token that follows Movement/Aptos
 * coin standards for maximum compatibility.
 */
contract MyToken {
  // Coin metadata - stored once at module address
  resource CoinInfo {
    name: string,
    symbol: string,
    decimals: u8,
    totalSupply: u64
  }
  
  // Individual coin store - one per account
  resource CoinStore {
    balance: u64,
    frozen: bool
  }
  
  // Mint capability - only holder can mint
  resource MintCapability;
  
  // Burn capability - only holder can burn
  resource BurnCapability;
  
  /**
   * Initialize the coin
   * Can only be called once by the module publisher
   */
  init(
    publisher: signer,
    name: string,
    symbol: string,
    decimals: u8
  ) {
    // Store coin info at module address
    CoinInfo[publisher] = {
      name: name,
      symbol: symbol,
      decimals: decimals,
      totalSupply: 0
    };
    
    // Grant mint/burn capabilities to publisher
    MintCapability[publisher] = {};
    BurnCapability[publisher] = {};
  }
  
  /**
   * Register an account to hold this coin
   */
  register(account: signer) {
    CoinStore[account] = {
      balance: 0,
      frozen: false
    };
  }
  
  /**
   * Mint new tokens (requires MintCapability)
   */
  mint(
    minter: signer,
    to: address,
    amount: u64
  ) {
    // Check minter has capability
    assert(has_resource<MintCapability>(minter));
    
    // Ensure recipient is registered
    assert(has_resource<CoinStore>(to));
    
    // Mint tokens
    CoinStore[to].balance += amount;
    CoinInfo[contract].totalSupply += amount;
    
    // Emit mint event
    emit MintEvent {
      minter: address_of(minter),
      recipient: to,
      amount: amount
    };
  }
  
  /**
   * Transfer tokens between accounts
   */
  transfer(
    from: signer,
    to: address,
    amount: u64
  ) {
    // Check sender has enough balance
    assert(CoinStore[from].balance >= amount);
    
    // Check sender not frozen
    assert(!CoinStore[from].frozen);
    
    // Check recipient is registered
    assert(has_resource<CoinStore>(to));
    
    // Check recipient not frozen
    assert(!CoinStore[to].frozen);
    
    // Transfer
    CoinStore[from].balance -= amount;
    CoinStore[to].balance += amount;
    
    // Emit transfer event
    emit TransferEvent {
      from: address_of(from),
      to: to,
      amount: amount
    };
  }
  
  /**
   * Burn tokens (requires BurnCapability)
   */
  burn(
    burner: signer,
    amount: u64
  ) {
    // Check burner has capability
    assert(has_resource<BurnCapability>(burner));
    
    // Check burner has enough balance
    assert(CoinStore[burner].balance >= amount);
    
    // Burn tokens
    CoinStore[burner].balance -= amount;
    CoinInfo[contract].totalSupply -= amount;
    
    // Emit burn event
    emit BurnEvent {
      burner: address_of(burner),
      amount: amount
    };
  }
  
  /**
   * View functions (read-only)
   */
  function balanceOf(account: address): u64 {
    return CoinStore[account].balance;
  }
  
  function totalSupply(): u64 {
    return CoinInfo[contract].totalSupply;
  }
  
  function name(): string {
    return CoinInfo[contract].name;
  }
  
  function symbol(): string {
    return CoinInfo[contract].symbol;
  }
  
  function decimals(): u8 {
    return CoinInfo[contract].decimals;
  }
}
```

---

### 4. **Create Test Fixtures**

**Location**: `packages/compiler/tests/fixtures/`

#### Test Categories You Should Cover:

**Basic Features:**
- [ ] Simple resource definition
- [ ] Resource with multiple fields
- [ ] Function with parameters
- [ ] Function with return value
- [ ] Multiple resources in one contract

**Resource Operations:**
- [ ] Resource creation (move_to)
- [ ] Resource reading (borrow_global)
- [ ] Resource mutation (borrow_global_mut)
- [ ] Resource destruction (move_from)
- [ ] Resource existence check (exists)

**Advanced Patterns:**
- [ ] Capability-based access control
- [ ] Event emission
- [ ] Error handling
- [ ] Generic types
- [ ] Cross-module calls

#### Example Fixture:

```javascript
// fixtures/input/capability-pattern.movejs
contract Vault {
  resource Balance;
  resource AdminCapability;
  
  init(admin: signer) {
    AdminCapability[admin] = {};
  }
  
  deposit(user: signer, amount: u64) {
    Balance[user] += amount;
  }
  
  withdraw_admin(admin: signer, from: address, amount: u64) {
    assert(has_resource<AdminCapability>(admin));
    Balance[from] -= amount;
  }
}
```

**Expected Output:**
```move
// fixtures/expected/capability-pattern.move
module Vault {
  struct Balance has key {
    value: u64
  }
  
  struct AdminCapability has key {}
  
  public entry fun init(admin: &signer) {
    move_to(admin, AdminCapability {});
  }
  
  public entry fun deposit(user: &signer, amount: u64) acquires Balance {
    let user_addr = signer::address_of(user);
    if (exists<Balance>(user_addr)) {
      let balance = borrow_global_mut<Balance>(user_addr);
      balance.value = balance.value + amount;
    } else {
      move_to(user, Balance { value: amount });
    }
  }
  
  public entry fun withdraw_admin(
    admin: &signer,
    from: address,
    amount: u64
  ) acquires Balance, AdminCapability {
    let admin_addr = signer::address_of(admin);
    assert!(exists<AdminCapability>(admin_addr), ERROR_NOT_ADMIN);
    
    let balance = borrow_global_mut<Balance>(from);
    assert!(balance.value >= amount, ERROR_INSUFFICIENT_BALANCE);
    balance.value = balance.value - amount;
  }
}
```

---

### 5. **Implement Deployment Service** 🚀

**Location**: `packages/backend/src/services/deployment.service.ts`

#### Your Implementation:

```typescript
import { AptosClient, AptosAccount, TxnBuilderTypes, BCS } from 'aptos';
import { compile } from '@js2move/compiler';

export interface DeployOptions {
  source: string;           // MoveJS source code
  network: 'testnet' | 'mainnet';
  privateKey?: string;      // Optional: for backend deploy
  moduleName?: string;
}

export interface DeployResult {
  success: boolean;
  address: string;
  txHash: string;
  gasUsed?: number;
  error?: string;
}

export class DeploymentService {
  private testnetClient: AptosClient;
  private mainnetClient: AptosClient;
  
  constructor() {
    this.testnetClient = new AptosClient('https://fullnode.testnet.movementlabs.xyz');
    this.mainnetClient = new AptosClient('https://fullnode.mainnet.movementlabs.xyz');
  }
  
  /**
   * Deploy a MoveJS contract to Movement blockchain
   */
  async deploy(options: DeployOptions): Promise<DeployResult> {
    try {
      // 1. Compile MoveJS to Move source
      const moveSource = compile(options.source);
      
      // 2. Compile Move to bytecode
      const bytecode = await this.compileMoveToBytes(moveSource);
      
      // 3. Get client for network
      const client = options.network === 'testnet' 
        ? this.testnetClient 
        : this.mainnetClient;
      
      // 4. Create account
      const account = options.privateKey
        ? new AptosAccount(Buffer.from(options.privateKey, 'hex'))
        : new AptosAccount(); // Generate new if not provided
      
      // 5. Create publish transaction
      const payload = this.createPublishPayload(bytecode, options.moduleName);
      
      // 6. Submit transaction
      const txnRequest = await client.generateTransaction(
        account.address(),
        payload,
        { max_gas_amount: '100000' }
      );
      
      const signedTxn = await client.signTransaction(account, txnRequest);
      const txnResult = await client.submitTransaction(signedTxn);
      
      // 7. Wait for confirmation
      await client.waitForTransaction(txnResult.hash);
      
      // 8. Get gas used
      const txnInfo = await client.getTransactionByHash(txnResult.hash);
      const gasUsed = (txnInfo as any).gas_used || 0;
      
      return {
        success: true,
        address: account.address().hex(),
        txHash: txnResult.hash,
        gasUsed: parseInt(gasUsed)
      };
      
    } catch (error) {
      return {
        success: false,
        address: '',
        txHash: '',
        error: error.message
      };
    }
  }
  
  /**
   * Compile Move source to bytecode
   */
  private async compileMoveToBytes(moveSource: string): Promise<Uint8Array> {
    // TODO: Implement Move compiler integration
    // Options:
    // 1. Call Movement CLI via child_process
    // 2. Use Aptos SDK compiler
    // 3. Call remote compilation service
    
    throw new Error('Move compilation not yet implemented');
  }
  
  /**
   * Create module publish payload
   */
  private createPublishPayload(
    bytecode: Uint8Array,
    moduleName?: string
  ): TxnBuilderTypes.TransactionPayload {
    return new TxnBuilderTypes.TransactionPayloadEntryFunction(
      TxnBuilderTypes.EntryFunction.natural(
        '0x1::code',
        'publish_package_txn',
        [],
        [
          BCS.bcsSerializeBytes(bytecode),
          BCS.bcsSerializeBytes(Buffer.from('{}')) // Metadata
        ]
      )
    );
  }
  
  /**
   * Estimate gas for deployment
   */
  async estimateGas(source: string, network: 'testnet' | 'mainnet'): Promise<number> {
    // Simulate deployment and return estimated gas
    return 50000; // Placeholder
  }
  
  /**
   * Get deployment status
   */
  async getDeploymentStatus(txHash: string, network: 'testnet' | 'mainnet'): Promise<string> {
    const client = network === 'testnet' ? this.testnetClient : this.mainnetClient;
    
    try {
      const txn = await client.getTransactionByHash(txHash);
      return (txn as any).success ? 'success' : 'failed';
    } catch {
      return 'pending';
    }
  }
}
```

---

### 6. **Define Security Rules** 🔒

**Location**: `packages/compiler/src/security/rules.ts`

```typescript
export interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  line?: number;
  suggestion?: string;
}

export class SecurityAnalyzer {
  /**
   * Check for reentrancy vulnerabilities
   */
  checkReentrancy(ast: AST): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    
    // Look for patterns like:
    // 1. External call
    // 2. State change after external call
    
    return issues;
  }
  
  /**
   * Check for integer overflow/underflow
   */
  checkArithmetic(ast: AST): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    
    // Check all arithmetic operations
    // Ensure proper bounds checking
    
    return issues;
  }
  
  /**
   * Check resource safety
   */
  checkResourceSafety(ast: AST): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    
    // Ensure:
    // - Resources are properly moved
    // - No resource leaks
    // - Proper borrow/mut usage
    
    return issues;
  }
  
  /**
   * Check access control
   */
  checkAccessControl(ast: AST): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    
    // Ensure:
    // - Admin functions have signer checks
    // - Capabilities are used correctly
    // - No unauthorized access
    
    return issues;
  }
  
  /**
   * Run all security checks
   */
  analyze(ast: AST): SecurityIssue[] {
    return [
      ...this.checkReentrancy(ast),
      ...this.checkArithmetic(ast),
      ...this.checkResourceSafety(ast),
      ...this.checkAccessControl(ast)
    ];
  }
}
```

---

### 7. **Create Move Optimizer** ⚡

**Location**: `packages/compiler/src/optimizer/optimizer.ts`

```typescript
export class MoveOptimizer {
  /**
   * Optimize generated Move code
   */
  optimize(moveCode: string): string {
    let optimized = moveCode;
    
    optimized = this.removeUnnecessaryBorrows(optimized);
    optimized = this.inlineSmallFunctions(optimized);
    optimized = this.optimizeStorageAccess(optimized);
    optimized = this.combineAssertions(optimized);
    
    return optimized;
  }
  
  private removeUnnecessaryBorrows(code: string): string {
    // Remove redundant borrow operations
    return code;
  }
  
  private inlineSmallFunctions(code: string): string {
    // Inline functions that are called once
    return code;
  }
  
  private optimizeStorageAccess(code: string): string {
    // Combine multiple storage reads
    return code;
  }
  
  private combineAssertions(code: string): string {
    // Combine related assertions
    return code;
  }
}
```

---

## 📋 Week-by-Week Plan

### Week 1: Foundation & Learning
**Goal**: Understand project and Movement blockchain

- [ ] Read all project documentation
- [ ] Set up Movement testnet account
- [ ] Deploy a simple Move contract manually
- [ ] Study current compiler structure
- [ ] Review existing templates
- [ ] Create MoveJS-to-Move mapping document

**Deliverable**: Mapping document with 10 basic patterns

---

### Week 2: Templates & Examples
**Goal**: Create comprehensive templates

- [ ] Rewrite all templates in `src/templates/`
- [ ] Create module template
- [ ] Create resource templates
- [ ] Create function templates
- [ ] Write 3 simple examples
- [ ] Test templates with examples

**Deliverable**: Working templates + 3 examples

---

### Week 3: Advanced Examples
**Goal**: Real-world contract patterns

- [ ] Write coin standard example
- [ ] Write NFT example
- [ ] Write staking example
- [ ] Write DAO example
- [ ] Document each example
- [ ] Test on Movement testnet

**Deliverable**: 7+ production-ready examples

---

### Week 4: Test Fixtures
**Goal**: Comprehensive test coverage

- [ ] Create 20+ test fixtures
- [ ] Cover all language features
- [ ] Cover edge cases
- [ ] Write expected Move outputs
- [ ] Document test cases

**Deliverable**: Complete test suite

---

### Week 5: Deployment Service
**Goal**: Working deployment pipeline

- [ ] Implement DeploymentService
- [ ] Integrate Movement SDK
- [ ] Test compilation pipeline
- [ ] Test deployment on testnet
- [ ] Add gas estimation
- [ ] Handle errors gracefully

**Deliverable**: Working deployment API

---

### Week 6: Security & Optimization
**Goal**: Production-ready code quality

- [ ] Implement security analyzer
- [ ] Create optimization rules
- [ ] Test security checks
- [ ] Optimize gas usage
- [ ] Document best practices

**Deliverable**: Secure, optimized compiler

---

### Week 7-8: Polish & Documentation
**Goal**: Production ready

- [ ] Fix any remaining bugs
- [ ] Complete all documentation
- [ ] Create video tutorials
- [ ] Write blog posts
- [ ] Prepare for launch

**Deliverable**: Launch-ready platform

---

## 📚 Files You Own

### Primary Ownership:
```
packages/compiler/
├── src/
│   ├── templates/          ✅ YOU OWN
│   ├── security/           ✅ YOU CREATE
│   └── optimizer/          ✅ YOU CREATE
├── examples/               ✅ YOU OWN
└── tests/fixtures/         ✅ YOU OWN

packages/backend/
└── src/services/
    └── deployment.service.ts  ✅ YOU OWN
```

### Collaborate On:
```
packages/compiler/
├── src/
│   ├── generator/          🤝 WORK WITH COMPILER TEAM
│   └── semantic/           🤝 WORK WITH COMPILER TEAM

docs/
└── *.md                    🤝 CONTRIBUTE TO DOCS
```

---

## 🎯 Success Metrics

### You're succeeding if:

**Code Quality:**
- ✅ Generated Move compiles without errors
- ✅ No security vulnerabilities in output
- ✅ Code follows Move best practices
- ✅ Gas-efficient implementations

**Testing:**
- ✅ 100+ test fixtures passing
- ✅ All examples deploy successfully
- ✅ Edge cases handled correctly

**Deployment:**
- ✅ Contracts deploy to testnet reliably
- ✅ Gas estimation within 10% accuracy
- ✅ Clear error messages

**Documentation:**
- ✅ All templates documented
- ✅ Examples well-commented
- ✅ Migration guide complete

---

## 🤝 Collaboration

### With Compiler Team:
**They build**: Lexer, Parser, AST  
**You define**: What Move code should be generated  
**Together**: Ensure output is correct

### With Backend Team:
**You provide**: Deployment service  
**They build**: API endpoints, database  
**Together**: Complete deployment pipeline

### With Frontend Team:
**You provide**: Deployment API specs  
**They build**: UI for deployment  
**Together**: One-click deployment

### With CLI Team:
**You provide**: Deployment functions  
**They build**: CLI commands  
**Together**: `movejs deploy` command

---

## 💡 First Day Checklist

### Morning:
- [ ] Clone repository
- [ ] Read DOCS_INDEX.md
- [ ] Read PROJECT_OVERVIEW.md
- [ ] Read this document
- [ ] Join team chat

### Afternoon:
- [ ] Set up development environment
- [ ] Install Movement CLI
- [ ] Create testnet account
- [ ] Deploy hello world manually
- [ ] Review current code

### End of Day:
- [ ] Create your first fixture test
- [ ] Share with team for feedback
- [ ] Plan Week 1 tasks

---

## 📚 Learning Resources

### Movement/Aptos Move:
- [Move Book](https://move-language.github.io/move/)
- [Aptos Developer Docs](https://aptos.dev/)
- [Movement Labs Docs](https://docs.movementlabs.xyz/)

### Project Docs:
- [QUICK_START.md](./QUICK_START.md)
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)

### Tools:
- Movement CLI
- Aptos SDK
- VS Code with Move extension

---

## 🚀 Getting Started

### Day 1:
```bash
# 1. Read docs
cat DOCS_INDEX.md

# 2. Set up environment
pnpm install
pnpm build

# 3. Look at current state
ls packages/compiler/src/templates/
ls packages/compiler/examples/

# 4. Make first contribution
# Create one test fixture
echo "contract Test { resource Data; }" > tests/fixtures/input/my-first-test.movejs
```

### Day 2:
```bash
# Write the Move output you expect
cat > tests/fixtures/expected/my-first-test.move << 'EOF'
module Test {
  struct Data has key {
    value: u64
  }
}
EOF

# Share with team for review
```

### Day 3:
```bash
# Start improving templates
code packages/compiler/src/templates/contract.move.hbs
```

---

## 🎉 Welcome to the Team!

You're joining at an exciting time. Your expertise in Move will be crucial to making Js2Move a success. Let's build the best development platform for Movement blockchain! 🚀

**Questions?** Ask in team chat or create a GitHub issue.

**Ready to start?** Check off that Day 1 checklist above!
