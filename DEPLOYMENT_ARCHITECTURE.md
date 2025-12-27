# 🚀 Deployment Architecture

## Enhanced Vision: Compile + Deploy Platform

Js2Move is evolving from a simple compiler to a **complete deployment platform**:

```
Write .movejs → Compile to .move → Deploy to Blockchain
                (Current)          (NEW FEATURE)
```

---

## 🎯 Deployment Features

### 1. **CLI Deployment**
```bash
# Compile and deploy in one command
movejs deploy MyToken.movejs --network testnet

# Deploy all contracts in a directory
movejs deploy-all src/ --network mainnet
```

### 2. **Frontend Deployment**
```typescript
// One-click deployment from web UI
<Button onClick={handleDeploy}>
  Deploy to Blockchain
</Button>
```

### 3. **Programmatic Deployment**
```typescript
import { compile, deploy } from '@js2move/sdk';

const source = 'contract Token { ... }';
const compiled = compile(source);
const deployment = await deploy(compiled, {
  network: 'testnet',
  account: signerAccount
});
```

---

## 🏗️ Enhanced Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Interface Layer                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   CLI Tool   │  │  Web UI      │  │  VS Code Extension   │  │
│  │              │  │              │  │                      │  │
│  │  compile     │  │  [Compile]   │  │   Right-click →      │  │
│  │  deploy ⭐   │  │  [Deploy] ⭐ │  │   "Deploy Contract"  │  │
│  │  deploy-all  │  │              │  │                      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼──────────────────────┼───────────────┘
          │                 │                      │
          └─────────────────┴──────────────────────┘
                            │
                            ▼
          ┌─────────────────────────────────────────┐
          │         Backend API Server              │
          │                                         │
          │  /api/v1/compile   (existing)          │
          │  /api/v1/deploy    (NEW) ⭐            │
          │  /api/v1/status    (NEW)               │
          │  /api/v1/history   (NEW)               │
          └────────────┬────────────────────────────┘
                       │
                       ▼
          ┌─────────────────────────────────────────┐
          │       Deployment Service (NEW)          │
          │                                         │
          │  ┌────────────────────────────────┐    │
          │  │  1. Compile .movejs → .move    │    │
          │  │  2. Connect to Movement RPC    │    │
          │  │  3. Sign transaction           │    │
          │  │  4. Publish module             │    │
          │  │  5. Track deployment           │    │
          │  └────────────────────────────────┘    │
          └────────────┬────────────────────────────┘
                       │
                       ▼
          ┌─────────────────────────────────────────┐
          │         Database (Enhanced)             │
          │                                         │
          │  • Deployment history                   │
          │  • Contract addresses                   │
          │  • Transaction hashes                   │
          │  • Gas costs                            │
          │  • User deployments                     │
          └────────────┬────────────────────────────┘
                       │
                       ▼
          ┌─────────────────────────────────────────┐
          │      Movement Network / Blockchain      │
          │                                         │
          │  • Published contracts                  │
          │  • Contract addresses                   │
          │  • Transaction records                  │
          └─────────────────────────────────────────┘
```

---

## 📊 Deployment Flow

### Complete User Journey:

```
1. User writes Token.movejs in web UI or locally

2. User clicks "Deploy" or runs: movejs deploy Token.movejs

3. Backend compiles .movejs → .move

4. Backend connects to blockchain RPC

5. Backend signs and publishes contract

6. Backend tracks deployment in database

7. User receives contract address + tx hash

8. User can interact with deployed contract
```

---

## 🔧 Implementation Components

### 1. **Deployment Service** (Backend)

```typescript
// packages/backend/src/services/deployment.service.ts

export class DeploymentService {
  async deploy(options: DeployOptions): Promise<DeploymentResult> {
    // 1. Compile source
    const move = await compile(options.source);
    
    // 2. Connect to blockchain
    const client = await this.getBlockchainClient(options.network);
    
    // 3. Prepare transaction
    const tx = await client.publishModule({
      module: move,
      sender: options.account
    });
    
    // 4. Sign and submit
    const result = await client.signAndSubmit(tx, options.signer);
    
    // 5. Save to database
    await this.saveDeployment({
      source: options.source,
      contractAddress: result.address,
      txHash: result.hash,
      network: options.network,
      timestamp: Date.now()
    });
    
    return result;
  }
}
```

### 2. **CLI Commands**

```typescript
// packages/cli/src/commands/deploy.ts

export function deployCommand(program: Command) {
  program
    .command('deploy')
    .description('Compile and deploy a MoveJS contract')
    .option('-s, --source <file>', 'Source file')
    .option('-n, --network <network>', 'Network (testnet/mainnet)', 'testnet')
    .option('-a, --account <account>', 'Deployer account')
    .action(async (opts) => {
      const source = await fs.readFile(opts.source, 'utf8');
      
      // Compile
      console.log('Compiling...');
      const move = compile(source);
      
      // Deploy
      console.log('Deploying to', opts.network);
      const result = await deployToBlockchain(move, opts);
      
      console.log('✅ Deployed!');
      console.log('Contract Address:', result.address);
      console.log('Tx Hash:', result.txHash);
    });
}
```

### 3. **Frontend Deploy Button**

```typescript
// frontend/components/DeployButton.tsx

export function DeployButton({ source }: { source: string }) {
  const [deploying, setDeploying] = useState(false);
  const [result, setResult] = useState<DeploymentResult | null>(null);
  
  const handleDeploy = async () => {
    setDeploying(true);
    
    try {
      const response = await fetch('/api/v1/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          network: 'testnet',
          account: wallet.address
        })
      });
      
      const result = await response.json();
      setResult(result);
      
      toast.success(`Deployed! Address: ${result.address}`);
    } catch (error) {
      toast.error('Deployment failed');
    } finally {
      setDeploying(false);
    }
  };
  
  return (
    <Button onClick={handleDeploy} disabled={deploying}>
      {deploying ? 'Deploying...' : '🚀 Deploy to Blockchain'}
    </Button>
  );
}
```

### 4. **Database Schema**

```prisma
// packages/backend/prisma/schema.prisma

model Deployment {
  id              String   @id @default(uuid())
  userId          String?
  source          String   // Original .movejs source
  compiledCode    String   // Generated .move code
  contractAddress String   // Deployed contract address
  txHash          String   // Transaction hash
  network         String   // testnet/mainnet
  gasUsed         Int?
  status          String   // pending/success/failed
  error           String?
  createdAt       DateTime @default(now())
  
  @@index([userId, createdAt])
  @@index([contractAddress])
}

model Contract {
  id              String   @id @default(uuid())
  name            String
  address         String   @unique
  network         String
  deploymentId    String
  abi             Json?    // Contract interface
  verified        Boolean  @default(false)
  createdAt       DateTime @default(now())
  
  @@index([network, address])
}
```

---

## 🌐 API Endpoints (New)

### POST /api/v1/deploy
```typescript
// Deploy a compiled contract
Request: {
  source: string,          // .movejs source
  network: 'testnet' | 'mainnet',
  account: string,         // Deployer address
  signer?: string          // Private key or signature
}

Response: {
  success: true,
  address: '0x123...',     // Contract address
  txHash: '0xabc...',      // Transaction hash
  gasUsed: 1234,
  deploymentId: 'uuid'
}
```

### GET /api/v1/deployments
```typescript
// Get deployment history
Response: {
  deployments: [
    {
      id: 'uuid',
      contractAddress: '0x123...',
      txHash: '0xabc...',
      network: 'testnet',
      timestamp: '2025-12-27T...',
      status: 'success'
    }
  ]
}
```

### GET /api/v1/deployment/:id
```typescript
// Get deployment details
Response: {
  id: 'uuid',
  source: 'contract Token { ... }',
  compiledCode: 'module Token { ... }',
  contractAddress: '0x123...',
  txHash: '0xabc...',
  network: 'testnet',
  status: 'success'
}
```

---

## 🔐 Security Considerations

### 1. **Private Key Management**
```typescript
// NEVER store private keys in database
// Use secure key management:

// Option A: User provides signature
const signature = await wallet.signMessage(tx);

// Option B: Use secure vault (production)
const signer = await keyVault.getSigner(userId);

// Option C: User connects wallet (frontend)
const signature = await window.movement.signAndSubmit(tx);
```

### 2. **Gas Limits**
```typescript
// Set reasonable gas limits
const MAX_GAS = 1_000_000;

if (estimatedGas > MAX_GAS) {
  throw new Error('Contract too complex');
}
```

### 3. **Rate Limiting**
```typescript
// Limit deployments per user
const rateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 deployments per 15 min
});

app.post('/api/v1/deploy', rateLimit, deployHandler);
```

---

## 📊 Deployment Dashboard (Frontend)

```typescript
// Show deployment history and status
<DeploymentDashboard>
  <DeploymentList>
    {deployments.map(d => (
      <DeploymentCard key={d.id}>
        <ContractName>{d.name}</ContractName>
        <Address>{d.address}</Address>
        <Network>{d.network}</Network>
        <Status status={d.status} />
        <ViewOnExplorer href={explorerUrl(d.txHash)} />
      </DeploymentCard>
    ))}
  </DeploymentList>
</DeploymentDashboard>
```

---

## 🎯 Deployment Strategies

### Strategy 1: Direct Deployment (Simple)
```
User → Backend → Blockchain
```
- Backend handles everything
- User just clicks "Deploy"
- Backend uses admin account or user's key

### Strategy 2: Wallet Integration (Secure)
```
User → Frontend → User's Wallet → Blockchain
Backend monitors transaction
```
- User keeps control of private keys
- Frontend connects to Movement wallet
- Backend tracks deployment after user signs

### Strategy 3: Hybrid (Recommended)
```
1. Backend compiles code
2. Frontend sends to user's wallet for signing
3. User approves in wallet
4. Backend monitors and records deployment
```

---

## 🚀 Phased Implementation

### Phase 1: Basic Deployment
- [x] Compile .movejs to .move
- [ ] Connect to Movement testnet RPC
- [ ] Publish module function
- [ ] CLI: `movejs deploy`

### Phase 2: Database Tracking
- [ ] Save deployments to database
- [ ] Track contract addresses
- [ ] Deployment history API

### Phase 3: Frontend Integration
- [ ] Deploy button in web UI
- [ ] Deployment status page
- [ ] Contract explorer link

### Phase 4: Wallet Integration
- [ ] Connect to Movement wallet
- [ ] User signs transactions
- [ ] Secure key management

### Phase 5: Advanced Features
- [ ] Multi-contract deployments
- [ ] Contract verification
- [ ] Upgrade management
- [ ] Gas optimization

---

## 💡 Key Benefits

### For Users:
- ✅ **One-click deployment** - No manual Move CLI needed
- ✅ **Deployment tracking** - See all your contracts
- ✅ **Cost estimation** - Know gas costs upfront
- ✅ **Error handling** - Clear deployment errors

### For Developers:
- ✅ **Complete toolkit** - Compile + Deploy in one place
- ✅ **Development workflow** - Test deployments easily
- ✅ **CI/CD ready** - Automate deployments

### For Teams:
- ✅ **Deployment history** - Track all deployments
- ✅ **Multi-network** - Deploy to testnet/mainnet
- ✅ **Collaboration** - Shared deployment dashboard

---

## 🎯 Updated Value Proposition

**Before**: "We compile JavaScript-like syntax to Move"

**Now**: "We provide a complete toolkit to write, compile, test, and deploy Move contracts using JavaScript-like syntax"

**Like**:
- Hardhat (Ethereum)
- Anchor (Solana)
- Foundry (Ethereum)

But for **Movement** blockchain! 🚀

---

## 📚 Next Steps

1. **Implement Movement SDK integration**
   - Connect to RPC
   - Sign and submit transactions
   - Handle responses

2. **Build deployment service**
   - Backend API endpoints
   - Database models
   - Transaction monitoring

3. **Create CLI commands**
   - `movejs deploy`
   - `movejs deploy-all`
   - `movejs status`

4. **Build frontend UI**
   - Deploy button
   - Deployment dashboard
   - Transaction status

5. **Add wallet integration**
   - Movement wallet connection
   - Transaction signing
   - Account management

---

This makes Js2Move a **game-changer** for Movement development! 🎉
