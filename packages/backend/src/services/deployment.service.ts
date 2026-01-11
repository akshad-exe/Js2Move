import { compile } from '@js2move/compiler';
import { getPrisma } from '@/config/database';
import { DeployOptions, DeploymentResult } from '@/types';
import { AptosClient, AptosAccount, TxnBuilderTypes, Types, BCS, HexString } from 'aptos';
import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey, AnyRawTransaction, PrivateKey, PrivateKeyVariants } from '@aptos-labs/ts-sdk';
import { RPC_ENDPOINT, DEPLOYER_PRIVATE_KEY, CHAIN_ID } from '@/config/envVars';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

export class DeploymentService {
  private getPrismaInstance() {
    return getPrisma();
  }

  private cachedModulesBytes: Uint8Array[] | null = null;

  private getAptosClient() {
    // Use the new SDK configuration for Movement
    const config = new AptosConfig({
      network: Network.CUSTOM,
      fullnode: RPC_ENDPOINT || 'https://testnet.movementnetwork.xyz/v1',
    });
    return new Aptos(config);
  }

  private getDeployerAccount(): Account | null {
    if (!DEPLOYER_PRIVATE_KEY) return null;
    try {
      // Use the new SDK approach
      const privateKey = new Ed25519PrivateKey(DEPLOYER_PRIVATE_KEY);
      return Account.fromPrivateKey({ privateKey });
    } catch (error) {
      console.error('Invalid DEPLOYER_PRIVATE_KEY:', error);
      return null;
    }
  }

  async compile(opts: { source: string; moduleName?: string; senderAddress: string }) {
    try {
      // Reset cached data for new compilation
      this.cachedModulesBytes = null;

      // Compile the MoveJS source code
      const moveCode = await compile(opts.source);
      const compiledCode = typeof moveCode === 'string' ? moveCode : moveCode.code;

      // Create temporary directory structure for Move project
      const tempDir = await this.createTempMoveProject(compiledCode, opts.moduleName || 'Contract', opts.senderAddress);

      // Get package metadata for deployment
      const metadata = await this.getPackageMetadata(tempDir);
      
      // Get the compiled bytecode
      const code = await this.getPackageCode(tempDir);
      const codeModules = await this.getPackageCode(tempDir);
      const bytecode = codeModules[0].code; // Get the first (and typically only) module bytecode

      // Clean up temp directory
      await fs.rm(tempDir, { recursive: true, force: true });

      return {
        success: true,
        compiledCode: bytecode, // Return bytecode instead of source code
        metadata,
        sourceCode: compiledCode, // Keep source code for reference
        tempDir: null // Not needed for client-side signing
      };
    } catch (error) {
      console.error('Compilation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Compilation failed'
      };
    }
  }

  async createUnsignedTransaction(opts: { source: string; moduleName?: string }) {
    try {
      console.log('Starting compilation of source code...');
      
      // Get deployer account to determine sender address
      const deployerAccount = this.getDeployerAccount();
      if (!deployerAccount) {
        throw new Error('Deployer account not configured - set DEPLOYER_PRIVATE_KEY');
      }
      
      const senderAddress = deployerAccount.accountAddress.toString();
      console.log('Using deployer address:', senderAddress);
      
      // Use the full compilation process that produces bytecode
      const compileResult = await this.compile({ ...opts, senderAddress });
      if (!compileResult.success || !compileResult.compiledCode) {
        throw new Error(compileResult.error || 'Compilation failed - no bytecode produced');
      }

      console.log('Compilation successful, bytecode length:', compileResult.compiledCode.length);

      // For decentralized deployment, we create metadata and modules directly
      // without using the CLI compilation
      const moduleName = opts.moduleName || 'Contract';

      // Create module from the compiled bytecode
      const codeModules = [new TxnBuilderTypes.Module(compileResult.compiledCode)];
      console.log('Code modules created:', codeModules.length);
      console.log('Module 0 code length:', codeModules[0]?.code?.length);

      // Create unsigned transaction
      const aptos = this.getAptosClient();

      // Get raw bytes for metadata and modules (no BCS serialization needed for new SDK)
      const metadataBytes = compileResult.metadata;
      const modulesBytes = codeModules.map(module => module.code);

      console.log('Metadata bytes length:', metadataBytes.length);
      console.log('Modules bytes length:', modulesBytes.length);
      console.log('Module 0 bytes length:', modulesBytes[0]?.length);

      // For now, create a simplified transaction structure that wallets can understand
      const txnRequest = {
        sender: senderAddress,
        sequence_number: 0, // Will be filled by wallet
        max_gas_amount: 200000,
        gas_unit_price: 100,
        expiration_timestamp_secs: Math.floor(Date.now() / 1000) + 600,
        payload: {
          function: "0x1::code::publish_package_txn",
          type_arguments: [],
          arguments: [
            metadataBytes,  // Pass raw bytes directly
            modulesBytes    // Pass array of raw bytes directly
          ]
        },
        chain_id: CHAIN_ID
      };

      // Normalize payload into wallet-friendly shape
      // If payload.value exists with module_name/function_name structure, convert to { function, type_arguments, arguments }
      const rawPayload: any = (txnRequest as any).payload;
      let normalizedPayload: any = rawPayload;

      try {
        if (rawPayload?.value) {
          const val = rawPayload.value;

          // publish_package_txn uses module_name/name structure
          if (val.module_name && val.function_name) {
            const moduleAddress = val.module_name.address?.address ? Buffer.from(Object.values(val.module_name.address.address)).toString('hex') : undefined;
            const moduleName = val.module_name.name?.value || '';
            const funcName = val.function_name?.value || '';
            const functionString = moduleAddress ? `0x${moduleAddress}::${moduleName}::${funcName}` : `${moduleName}::${funcName}`;

            const args = (val.args || []).map((a: any) => {
              // If arg is an object of bytes (like Uint8Array represented as {0:...,1:...}), convert to hex
              if (a && typeof a === 'object') {
                try {
                  const bytes = Buffer.from(Object.values(a));
                  return `0x${bytes.toString('hex')}`;
                } catch {
                  return a;
                }
              }
              return a;
            });

            normalizedPayload = {
              type: 'entry_function_payload',
              // Simplified convenience property many adapters expect
              function: functionString,
              type_arguments: val.ty_args || [],
              arguments: args,
              // Keep original value-shaped payload for adapters that expect .value.module_name / .function_name
              value: {
                module_name: val.module_name,
                function_name: val.function_name,
                ty_args: val.ty_args || [],
                args: val.args || []
              }
            };
          }
        }
      } catch (err) {
        console.warn('Failed to normalize payload for wallet signing, using original payload', err);
        normalizedPayload = rawPayload;
      }

      // Normalize chain_id if wrapped in { value }
      const chainId = (txnRequest as any).chain_id?.value ?? (txnRequest as any).chain_id;

      // Normalize common top-level fields wallets expect
      const normalizedTxn = {
        ...txnRequest,
        sender: ((): any => {
          try {
            const s = (txnRequest as any).sender;
            if (typeof s === 'string') return s;
            if (s?.address) {
              // address may be an object map (0:byte..); convert to hex
              const arr = Object.values(s.address);
              const hex = Buffer.from(arr as any).toString('hex');
              return `0x${hex}`;
            }
            return s;
          } catch {
            return (txnRequest as any).sender;
          }
        })(),
        sequence_number: Number((txnRequest as any).sequence_number),
        max_gas_amount: Number((txnRequest as any).max_gas_amount),
        gas_unit_price: Number((txnRequest as any).gas_unit_price),
        expiration_timestamp_secs: Number((txnRequest as any).expiration_timestamp_secs),
        payload: normalizedPayload,
        chain_id: chainId,
      };

      return {
        success: true,
        unsignedTransaction: normalizedTxn,
        compiledCode: compileResult.compiledCode,
        metadata: metadataBytes
      };
    } catch (error) {
      console.error('Transaction creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction creation failed'
      };
    }
  }

  async submitUnsignedTransaction(opts: { unsignedTransaction: any; moduleName: string; network?: string }) {
    const prisma = this.getPrismaInstance();
    const aptos = this.getAptosClient();

    try {
      // Check if we have a private key for server-side signing
      if (!DEPLOYER_PRIVATE_KEY) {
        return {
          success: false,
          error: 'Server-side signing not configured. Use client-side signing instead.'
        };
      }

      // Format private key to be AIP-80 compliant
      const formattedPrivateKey = PrivateKey.formatPrivateKey(DEPLOYER_PRIVATE_KEY, PrivateKeyVariants.Ed25519);
      const privateKey = new Ed25519PrivateKey(formattedPrivateKey);
      const account = Account.fromPrivateKey({ privateKey });

      // Extract the payload from the unsigned transaction
      const payload = opts.unsignedTransaction.payload;

      // Extract metadata and modules from the payload arguments
      // Handle different possible formats (Uint8Array, hex string, or object)
      const rawMetadata = payload.arguments[0];
      const rawModules = payload.arguments[1];

      console.log('Raw metadata:', rawMetadata);
      console.log('Raw modules:', rawModules);

      // Convert to proper Uint8Array format
      let metadataBytes: Uint8Array;
      if (rawMetadata instanceof Uint8Array) {
        metadataBytes = rawMetadata;
      } else if (typeof rawMetadata === 'string') {
        metadataBytes = rawMetadata.startsWith('0x')
          ? new Uint8Array(Buffer.from(rawMetadata.slice(2), 'hex'))
          : new Uint8Array(Buffer.from(rawMetadata, 'hex'));
      } else if (rawMetadata && typeof rawMetadata === 'object') {
        // Handle object format {0: byte, 1: byte, ...}
        const values = Object.values(rawMetadata);
        console.log('Metadata object values:', values.slice(0, 10), '...');
        metadataBytes = new Uint8Array(values as number[]);
      } else {
        throw new Error('Invalid metadata format');
      }

      let modulesBytes: Uint8Array[];
      if (Array.isArray(rawModules)) {
        modulesBytes = rawModules.map((mod: any, index: number) => {
          console.log(`Raw module ${index}:`, mod);
          if (mod instanceof Uint8Array) {
            return mod;
          } else if (Buffer.isBuffer(mod)) {
            // Handle Buffer objects
            return new Uint8Array(mod);
          } else if (mod && mod.type === 'Buffer' && Array.isArray(mod.data)) {
            // Handle serialized Buffer objects
            return new Uint8Array(mod.data);
          } else if (typeof mod === 'string') {
            return mod.startsWith('0x')
              ? new Uint8Array(Buffer.from(mod.slice(2), 'hex'))
              : new Uint8Array(Buffer.from(mod, 'hex'));
          } else if (mod && typeof mod === 'object') {
            const values = Object.values(mod);
            console.log(`Module ${index} object values:`, values.slice(0, 10), '...');
            return new Uint8Array(values as number[]);
          } else {
            throw new Error(`Invalid module format for module ${index}`);
          }
        });
      } else {
        throw new Error('Modules must be an array');
      }

      console.log('Final metadata bytes type:', typeof metadataBytes, 'length:', metadataBytes?.length);
      console.log('Final modules bytes type:', typeof modulesBytes, 'length:', modulesBytes?.length);
      if (Array.isArray(modulesBytes)) {
        console.log('Final modules array length:', modulesBytes.length);
        modulesBytes.forEach((mod, i) => console.log(`Final module ${i} type:`, typeof mod, 'length:', mod?.length));
      }

      console.log('Using signAndSubmitTransaction with publishPackageTransaction...');

      // Use the dedicated publishPackageTransaction method for framework functions
      const transaction = await aptos.publishPackageTransaction({
        account: account.accountAddress,
        metadataBytes: metadataBytes,
        moduleBytecode: modulesBytes,
      });

      const txn = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      console.log(`Transaction submitted: ${txn.hash}`);

      // Wait for transaction completion
      const response = await aptos.waitForTransaction({
        transactionHash: txn.hash
      });

      console.log('Transaction confirmed:', response);

      // Get gas used from response
      const gasUsed = (response as any).gas_used || (response as any).gasUsed;

      // Create deployment record
      const deployment = await prisma.deployment.create({
        data: {
          source: '', // We don't store source for signed transactions
          compiledCode: '',
          txHash: txn.hash,
          network: opts.network || 'testnet',
          status: 'success',
          moduleName: opts.moduleName,
          contractAddress: account.accountAddress.toString(),
          gasUsed: gasUsed ? parseInt(String(gasUsed), 10) : null,
        }
      });

      return {
        success: true,
        deploymentId: deployment.id,
        txHash: txn.hash,
        gasUsed: gasUsed ? parseInt(String(gasUsed), 10) : null
      };
    } catch (error) {
      console.error('Transaction submission error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction submission failed'
      };
    }
  }

  async submitSignedTransaction(opts: { signedTransaction: any; moduleName: string; network?: string }) {
    const prisma = this.getPrismaInstance();
    const aptos = this.getAptosClient();

    try {
      // For signed transactions from wallets, submit using the new SDK
      const committedTxn = await aptos.transaction.submit.simple(opts.signedTransaction);
      const txnHash = committedTxn.hash;

      // Wait for transaction confirmation
      const response = await aptos.waitForTransaction({
        transactionHash: txnHash
      });

      // Create deployment record
      const gasUsed = (response as any).gas_used || (response as any).gasUsed;
      const deployment = await prisma.deployment.create({
        data: {
          source: '', // We don't store source for signed transactions
          compiledCode: '',
          txHash: txnHash,
          network: opts.network || 'testnet',
          status: 'success',
          moduleName: opts.moduleName,
          gasUsed: gasUsed ? parseInt(String(gasUsed), 10) : null,
        }
      });

      return {
        success: true,
        deploymentId: deployment.id,
        txHash: txnHash,
        gasUsed: gasUsed ? parseInt(String(gasUsed), 10) : null
      };
    } catch (error) {
      console.error('Signed transaction submission error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signed transaction submission failed'
      };
    }
  }

  async deploy(opts: DeployOptions) {
    // Compile the MoveJS source code
    const moveCode = await compile(opts.source);
    const compiledCode = typeof moveCode === 'string' ? moveCode : moveCode.code;

    const prisma = this.getPrismaInstance();
    let deployment: any = null;

    try {
      // Create pending deployment record
      deployment = await prisma.deployment.create({
        data: {
          source: opts.source,
          compiledCode,
          moveToml: opts.moveToml ?? null,
          txHash: '', // Will be updated after submission
          network: opts.network,
          status: 'pending',
          moduleName: opts.moduleName,
          gasEstimate: opts.gasLimit,
        }
      });

      // If no private key is configured, keep as pending for manual deployment
      if (!DEPLOYER_PRIVATE_KEY) {
        return {
          success: true,
          deploymentId: deployment.id,
          address: '',
          txHash: '',
          gasUsed: null,
          message: 'Deployment queued - configure DEPLOYER_PRIVATE_KEY for automatic deployment'
        };
      }

      // Get deployer account
      const deployerAccount = this.getDeployerAccount();
      if (!deployerAccount) {
        throw new Error('Invalid deployer private key configuration');
      }

      // Real blockchain deployment
      const aptos = this.getAptosClient();

      try {
        // Create temporary directory structure for Move project
        const tempDir = await this.createTempMoveProject(compiledCode, opts.moduleName || 'Contract', deployerAccount.accountAddress.toString());

        // Get package metadata and code
        const packageMetadata = await this.getPackageMetadata(tempDir);
        const codeModules = await this.getPackageCode(tempDir);

        // Convert metadata and modules to Uint8Array for the transaction
        const metadataBytes = new Uint8Array(packageMetadata);
        const modulesBytes = codeModules.map(module => new Uint8Array(module.code));

        console.log('Building package publish transaction...');

        // Build the transaction using the new simple API
        const transaction = await aptos.transaction.build.simple({
          sender: deployerAccount.accountAddress,
          data: {
            function: "0x1::code::publish_package_txn",
            typeArguments: [],
            functionArguments: [metadataBytes, modulesBytes]
          },
        });

        console.log('Signing transaction...');

        // Sign the transaction
        const signature = aptos.transaction.sign({
          signer: deployerAccount,
          transaction
        });

        console.log('Submitting transaction...');

        // Submit the transaction
        const committedTxn = await aptos.transaction.submit.simple({
          transaction,
          senderAuthenticator: signature,
        });

        console.log(`Package published: ${committedTxn.hash}`);

        // Wait for transaction confirmation
        const response = await aptos.waitForTransaction({
          transactionHash: committedTxn.hash
        });

        // Update deployment with success
        const gasUsed = (response as any).gas_used || (response as any).gasUsed;
        await prisma.deployment.update({
          where: { id: deployment.id },
          data: {
            txHash: committedTxn.hash,
            status: 'success',
            contractAddress: deployerAccount.accountAddress.toString(),
            gasUsed: gasUsed ? parseInt(String(gasUsed), 10) : null,
          }
        });

        // Clean up temp directory
        await this.cleanupTempProject(tempDir);

        return {
          success: true,
          deploymentId: deployment.id,
          address: deployerAccount.accountAddress.toString(),
          txHash: committedTxn.hash,
          gasUsed: gasUsed ? parseInt(String(gasUsed), 10) : null
        };

      } catch (deployError) {
        console.error('Deployment failed:', deployError);

        // Update deployment with failure
        await prisma.deployment.update({
          where: { id: deployment.id },
          data: {
            status: 'failed',
            error: deployError instanceof Error ? deployError.message : String(deployError),
          }
        });

        throw deployError;
      }

    } catch (error) {
      // Update deployment with failure if it was created
      if (deployment) {
        await prisma.deployment.update({
          where: { id: deployment.id },
          data: {
            status: 'failed',
            error: error instanceof Error ? error.message : String(error),
          }
        });
      }
      throw error;
    }
  }

  private generateMoveToml(moduleName: string, senderAddress: string): string {
    return `[package]
name = "${moduleName}"
version = "0.1.0"
authors = ["Js2Move <dev@movementlabs.xyz>"]

[dependencies]
AptosFramework = { git = "https://github.com/movementlabsxyz/aptos-core.git", rev = "9dfc8e7a3d622597dfd81cc4ba480a5377f87a41", subdir = "aptos-move/framework/aptos-framework" }

[addresses]
${moduleName} = "${senderAddress}"
std = "0x1"`;
  }

  /**
   * Get deployment history for a network or status
   */
  async getHistory(filters?: { network?: string; status?: string }) {
    const prisma = this.getPrismaInstance();
    return prisma.deployment.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { contracts: true },
    });
  }

  /**
   * List recent deployments
   */
  async list() {
    const prisma = this.getPrismaInstance();
    return prisma.deployment.findMany({ 
      orderBy: { createdAt: 'desc' }, 
      take: 50 
    });
  }

  /**
   * Get a single deployment by ID
   */
  async get(id: string) {
    const prisma = this.getPrismaInstance();
    return prisma.deployment.findUnique({ where: { id } });
  }

  /**
   * Get deployment status by tx hash
   */
  async getStatus(txHash: string, network: 'testnet' | 'mainnet') {
    const prisma = this.getPrismaInstance();
    const deployment = await prisma.deployment.findUnique({ where: { txHash } });
    if (!deployment) return { status: 'not_found' };

    return { 
      status: deployment.status, 
      deploymentId: deployment.id,
      txHash, 
      network,
      contractAddress: deployment.contractAddress,
      createdAt: deployment.createdAt,
      updatedAt: deployment.updatedAt,
    };
  }

  /**
   * Get pending deployments (for indexer polling)
   */
  async getPending() {
    const prisma = this.getPrismaInstance();
    return prisma.deployment.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Update deployment status (called by indexer)
   */
  async updateStatus(
    id: string,
    status: 'pending' | 'success' | 'failed',
    data?: { contractAddress?: string; gasUsed?: number; error?: string }
  ) {
    const prisma = this.getPrismaInstance();
    return prisma.deployment.update({
      where: { id },
      data: {
        status,
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  private async createTempMoveProject(compiledCode: string, moduleName: string, senderAddress: string): Promise<string> {
    const tempDir = path.join(os.tmpdir(), `js2move-deploy-${Date.now()}`);
    const sourcesDir = path.join(tempDir, 'sources');

    // Create directory structure
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(sourcesDir, { recursive: true });

    // Write Move.toml
    const moveToml = this.generateMoveToml(moduleName, senderAddress);
    await fs.writeFile(path.join(tempDir, 'Move.toml'), moveToml);

    // Write compiled Move code
    await fs.writeFile(path.join(sourcesDir, `${moduleName.toLowerCase()}.move`), compiledCode);

    return tempDir;
  }

  private async getPackageMetadata(tempDir: string): Promise<Uint8Array> {
    // Use aptos CLI build-publish-payload to get properly formatted metadata and bytecode
    const outputFile = path.join(tempDir, 'publish-payload.json');

    try {
      console.log('Running aptos build-publish-payload command...');
      execSync(`aptos move build-publish-payload --json-output-file "${outputFile}" --package-dir "${tempDir}" --assume-yes`, { stdio: 'inherit' });

      // Read the generated JSON file
      const payloadData = JSON.parse(await fs.readFile(outputFile, 'utf-8'));
      console.log('Publish payload generated successfully');

      // Extract metadata and bytecode from the payload
      // The format is: { function: "0x1::code::publish_package_txn", args: [metadata, modules] }
      if (payloadData.args && payloadData.args.length >= 2) {
        const metadataBytes = payloadData.args[0].value;
        const modulesBytes = payloadData.args[1].value;

        console.log('Metadata bytes length:', metadataBytes.length);
        console.log('Modules count:', modulesBytes.length);

        // Store the bytecode for getPackageCode to use
        this.cachedModulesBytes = modulesBytes;

        return metadataBytes;
      } else {
        throw new Error('Invalid publish payload format');
      }
    } catch (error) {
      console.error('Build publish payload error details:', error);
      throw new Error(`Failed to build publish payload: ${error}`);
    }
  }

  private async getPackageCode(tempDir: string): Promise<TxnBuilderTypes.Module[]> {
    // Return the cached modules bytes from build-publish-payload
    if (this.cachedModulesBytes) {
      console.log('Using cached modules bytes, count:', this.cachedModulesBytes.length);
      return this.cachedModulesBytes.map(bytecode => new TxnBuilderTypes.Module(bytecode));
    }

    throw new Error('No cached modules bytes available. Call getPackageMetadata first.');
  }

  private async cleanupTempProject(tempDir: string): Promise<void> {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.warn(`Failed to cleanup temp directory ${tempDir}:`, error);
    }
  }
}
