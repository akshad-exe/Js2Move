# @template/sdk

JavaScript/TypeScript SDK for interacting with smart contracts in this template monorepo.

> Note: This package is part of a monorepo. Local secrets and build artifacts (e.g., `.env`, `node_modules/`) are excluded by `.gitignore`. Commit a `.env.example` with non-sensitive defaults.

## 📋 Overview

The SDK provides a simple, type-safe interface for:
- Connecting to a blockchain via RPC (configurable)
- Interacting with template smart contracts
- Managing wallets and transactions
- Querying on-chain data and contract state
- Real-time event subscriptions

## 🚀 Quick Start

### Installation

```bash
npm install @template/sdk
# or
yarn add @template/sdk
# or
pnpm add @template/sdk
```

### Basic Usage

```typescript
import { TemplateClient } from '@template/sdk';

// Initialize client
const client = new TemplateClient({
  network: 'testnet', // or 'mainnet'
  rpcUrl: 'https://full.testnet.movementinfra.xyz/v1'
});

// Connect wallet
await client.connect(wallet);

// Call a contract function (example)
const tx = await client.contracts.call({
  contractAddress: '0x...',
  method: 'doSomething',
  args: []
});

console.log('Transaction:', tx.hash);
```

## 📚 API Reference

### Client Initialization

```typescript
import { TemplateClient, NetworkType } from '@template/sdk';

const client = new TemplateClient({
  network: 'testnet' as NetworkType,
  rpcUrl: 'https://full.testnet.movementinfra.xyz/v1',
  chainId: 250
});
```

### Contracts

#### Get All Contracts

```typescript
const contracts = await client.contracts.getAll();
```

#### Get Contract by Address

```typescript
const contract = await client.contracts.getByAddress('0x...');
```

#### Deploy Contract

```typescript
const tx = await client.contracts.deploy({
  name: 'MyContract',
  bytecode: '0x...'
});
```

#### Get Contract State

```typescript
const state = await client.contracts.getState('0x...');
```

### Calls / Transactions

#### Call Contract Method

```typescript
const tx = await client.contracts.call({
  contractAddress: '0x...',
  method: 'transfer',
  args: ['0xrecipient', '100']
});
```

#### Get Transaction Status

```typescript
const txStatus = await client.transactions.getStatus(tx.hash);
```

#### Get Account Transactions

```typescript
const txs = await client.transactions.getByAccount('0x...');
```

### Wallet Management

#### Connect Wallet

```typescript
await client.connect(wallet);
```

#### Disconnect Wallet

```typescript
await client.disconnect();
```

#### Get Connected Account

```typescript
const account = client.account;
console.log('Address:', account?.address);
```

#### Sign Message

```typescript
const signature = await client.signMessage('Hello World');
```

### Events

#### Subscribe to Events

```typescript
// Subscribe to contract and chain events
client.on('ContractCalled', (event) => {
  console.log('Contract call:', event);
});

// Subscribe to transfer events
client.on('Transfer', (event) => {
  console.log('Transfer event:', event);
});

// Unsubscribe
client.off('ContractCalled', handler);
```

## 🔧 Configuration

### Network Configuration

```typescript
import { TemplateClient } from '@template/sdk';

// Testnet
const testnetClient = new TemplateClient({
  network: 'testnet',
  rpcUrl: 'https://full.testnet.movementinfra.xyz/v1',
  chainId: 250
});

// Mainnet
const mainnetClient = new TemplateClient({
  network: 'mainnet',
  rpcUrl: 'https://full.mainnet.movementinfra.xyz/v1',
  chainId: 126
});
```

### Custom Configuration

```typescript
const client = new TemplateClient({
  network: 'testnet',
  rpcUrl: 'https://custom-rpc.example.com',
  chainId: 250,
  timeout: 30000, // Request timeout in ms
  retries: 3 // Number of retries for failed requests
});
```

## 📦 TypeScript Support

The SDK is built with TypeScript and provides full type definitions:

```typescript
import type {
  Contract,
  ChainEvent,
  DeployContractParams,
  CallContractParams,
  TransactionResponse
} from '@template/sdk';

// Fully typed
const contract: Contract = await client.contracts.getByAddress('0x...');
const event: ChainEvent = await client.events.getLatest();
```

## 🧪 Testing

### Unit Tests

```bash
pnpm test
```

### Integration Tests

```bash
# Requires testnet connection
pnpm test:integration
```

### Example Test

```typescript
import { TemplateClient } from '@template/sdk';

describe('TemplateClient', () => {
  let client: TemplateClient;

  beforeEach(() => {
    client = new TemplateClient({
      network: 'testnet',
      rpcUrl: 'https://full.testnet.movementinfra.xyz/v1'
    });
  });

  it('should fetch markets', async () => {
    const contracts = await client.contracts.getAll();
    expect(markets).toBeInstanceOf(Array);
  });
});
```

## 🔍 Error Handling

```typescript
try {
  await client.positions.open({
    marketId: 1,
    amount: 1000,
    side: 'YES'
  });
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Not enough balance');
  } else if (error.code === 'USER_REJECTED') {
    console.error('User rejected transaction');
  } else {
    console.error('Transaction failed:', error.message);
  }
}
```

## 📊 Examples

### Example Contract Flow

```typescript
import { TemplateClient } from '@template/sdk';

async function exampleFlow() {
  const client = new TemplateClient({ network: 'testnet' });
  
  // Connect wallet
  await client.connect(wallet);
  
  // Deploy contract
  const deployTx = await client.contracts.deploy({
    name: 'MyContract',
    bytecode: '0x...'
  });
  
  // Call contract method
  const callTx = await client.contracts.call({
    contractAddress: deployTx.address,
    method: 'doSomething',
    args: []
  });
  
  // Query contract state
  const state = await client.contracts.getState(deployTx.address);
  console.log('Contract state:', state);
}
```
```
A typical contract interaction flow:
1. Instantiate and configure the client with the target network and RPC URL.
2. Connect a signing wallet to the client.
3. Deploy a contract or reference an existing contract address.
4. Call contract methods (send transactions) and wait for confirmations.
5. Query contract state to observe results and update application state accordingly.
```

## 🤝 Contributing

See the root [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT
