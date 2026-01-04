# Deploying Move packages with the Aptos TypeScript SDK (v5.2.0) 🚀

This document shows a practical, secure, and testable workflow for compiling MoveJS → Move, creating publish transactions, signing them, and submitting to Movement / Aptos RPCs using the Aptos TypeScript SDK (`@aptos-labs/ts-sdk` v5.2.0). It also explains how this maps into the repository's `DeploymentService` and CI/worker patterns.

---

## 📦 Prerequisites

- Install the SDK in the backend / worker package:

```bash
pnpm add @aptos-labs/ts-sdk
```

- Environment variables (examples):
  - `RPC_TESTNET` (e.g., `https://fullnode.testnet.movementlabs.xyz`)  
  - `RPC_MAINNET`  
  - `DEPLOYER_PRIVATE_KEY` (hex/string) — for local tests only; production should use KMS.

---

## 🔐 Account setup (keys/signers)

Create accounts from private keys or generate ephemeral ones.

```ts
import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

// From private key (string)
const privateKey = new Ed25519PrivateKey(process.env.DEPLOYER_PRIVATE_KEY!);
const deployerAccount = Account.fromPrivateKey({ privateKey });

// Or generate a new account (for ephemeral test publishes)
const ephemeral = Account.generate();

console.log('address=', deployerAccount.accountAddress);
```

> Tip: never commit real keys to source. Use env secrets or KMS in production.

---

## 🔍 Reading on-chain data (view functions)

The SDK provides convenience helpers for common read queries.

```ts
// Common reads
const info = await aptos.getAccountInfo({ accountAddress: "0x123" });
const modules = await aptos.getAccountModules({ accountAddress: "0x123" });

// View function example (read-only call)
const viewPayload = {
  function: "0x1::message::get_message",
  functionArguments: ["0xabc..."],
};
const viewResult = await aptos.view({ payload: viewPayload });
```

---

## ✉️ Sending transactions (build → sign → submit)

Two safe patterns:

1. SDK convenience wrappers (`Aptos` class) — recommended for application code.
2. Manual flow using the lower-level client (generate → sign → submit) — useful for detailed control.

Example using `Aptos` helpers:

```ts
// Build transaction payload for an entry function (example transfer)
const payload = {
  type: 'entry_function_payload',
  function: '0x1::coin::transfer',
  type_arguments: [],
  arguments: [recipientAddress, '100000'],
};

// 1. Generate request
const txRequest = await aptos.generateTransaction(deployerAccount.accountAddress, payload, { max_gas_amount: '200000' });

// 2. Sign
const signed = await aptos.signTransaction(deployerAccount, txRequest);

// 3. Submit
const submitRes = await aptos.submitTransaction(signed);

// 4. Wait for confirmation
await aptos.waitForTransaction(submitRes.hash);
```

---

## 📣 Publishing a Move module (high level)

1. **Compile** MoveJS → Move source (repo compiler).  
2. **(Optional)** Compile Move source to bytecode / module bytes.  
3. **Create publish payload** — an SDK payload that includes module bytes or a `module_bundle` payload.  
4. **Sign & submit** transaction as above, wait for confirmation, and record publish events.

Pseudocode with our compiler:

```ts
// 1. Compile MoveJS into Move source
const moveSource = compile(movejsSource);

// 2. (If needed) produce move package on disk or module bytes
// e.g., packages/compiler/out/aptos/contract

// 3. Create publishing payload (helper)
const payload = createPublishPayloadFromPackageDir('/tmp/contract');

// 4. Generate, sign and submit
const txRequest = await aptos.generateTransaction(deployerAccount.accountAddress, payload, { max_gas_amount: '200000' });
const signed = await aptos.signTransaction(deployerAccount, txRequest);
const res = await aptos.submitTransaction(signed);
await aptos.waitForTransaction(res.hash);
```

> Note: exact payload shape depends on how the package is packaged (module bytes vs bundle). If you prefer, you can also publish via `movement move publish --package-dir` in a containerized workflow.

---

## 🔁 Integrating into `DeploymentService` (concrete)

Replace the current mock publish flow with the real steps below (safe defaults + optional KMS signer):

```ts
import { Aptos, AptosConfig, Network, Account } from '@aptos-labs/ts-sdk';

export async function deployReal(opts: DeployOptions) {
  const aptos = new Aptos(new AptosConfig({ network: opts.network === 'testnet' ? Network.TESTNET : Network.MAINNET }));

  // compile (existing) -> get package directory
  const pkgDir = await compileToPackageDir(opts.source);

  // create an Account instance (or a KMS signer wrapper)
  const account = opts.privateKey
    ? Account.fromPrivateKey({ privateKey: new Ed25519PrivateKey(opts.privateKey) })
    : Account.generate(); // ephemeral fallback - for tests only

  // create publish payload from pkgDir (helper)
  const payload = createPublishPayloadFromPackageDir(pkgDir, { moduleName: opts.moduleName });

  // sign & submit
  const txRequest = await aptos.generateTransaction(account.accountAddress, payload, { max_gas_amount: String(opts.gasLimit ?? 200000) });
  const signed = await aptos.signTransaction(account, txRequest);
  const submitRes = await aptos.submitTransaction(signed);
  await aptos.waitForTransaction(submitRes.hash);

  // record & return
  return { success: true, txHash: submitRes.hash };
}
```

### KMS / keyless signing

- Production should not use raw private keys. Instead implement a `Signer` interface that your `DeploymentService` can call to get a signature (AWS KMS/Cloud KMS/HSM). The service submits the signed transaction via the SDK's `submitTransaction`.

---

## 🧪 Tests & CI

- Use **Movement testnet / Aptos testnet** RPCs in CI. Configure ephemeral test accounts via env or fixtures.  
- For integration tests that require compilation, prefer containerized compile (`js2move/aptos-cache`) and copy the package into the container to avoid network fetches, or use a named Docker volume for `/root/.move` cache.  

Example CI step (publish to testnet using SDK):
```bash
# set DEPLOYER_PRIVATE_KEY (throwaway) and RPC_TESTNET
pnpm -w run test:integration:deploy
```

---

## ⚠️ Troubleshooting & tips

- If a publish fails with a missing `aptos_framework` revision during container compile, ensure the image cache contains the requested revision or run compile with `--skip-fetch-latest-git-deps` and copy package into the container.  
- Always validate gas estimates via the `GasEstimationService` before submitting expensive transactions.  
- Use the `deployment-tracker` indexer to pick up `PublishModule` events and mark deployments successful.

---

## 🔗 References

- @aptos-labs/ts-sdk docs: https://aptos-labs.github.io/aptos-ts-sdk/@aptos-labs/ts-sdk-5.2.0/  
- Movement CLI and docs (for `movement move publish`)  

---

If you'd like, I can:
- Implement the real publish flow in `DeploymentService` (switch from mock to SDK-based publish) and add integration tests that publish to the testnet using a throwaway key, or
- Add a sample `deploy` CLI command that reads `DEPLOYER_PRIVATE_KEY` env and publishes a compiled package.

Which would you prefer I do next? ✅