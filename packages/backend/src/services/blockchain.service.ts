import { AptosClient, AptosAccount, TxnBuilderTypes, Types } from 'aptos';

export class BlockchainService {
  private clients: Map<string, AptosClient> = new Map();

  constructor() {
    // Initialize clients for different networks
    this.clients.set('testnet', new AptosClient('https://fullnode.testnet.aptoslabs.com'));
    this.clients.set('mainnet', new AptosClient('https://fullnode.mainnet.aptoslabs.com'));
  }

  private getClient(network: 'testnet' | 'mainnet' = 'testnet'): AptosClient {
    const client = this.clients.get(network);
    if (!client) {
      throw new Error(`Unsupported network: ${network}`);
    }
    return client;
  }

  /**
   * Get network status and health information
   */
  async getNetworkStatus(network: 'testnet' | 'mainnet' = 'testnet') {
    try {
      const client = this.getClient(network);
      const ledgerInfo = await client.getLedgerInfo();

      return {
        network,
        chainId: (ledgerInfo as any).chain_id,
        epoch: (ledgerInfo as any).epoch,
        blockHeight: (ledgerInfo as any).block_height,
        oldestBlockHeight: (ledgerInfo as any).oldest_block_height,
        blockTimestamp: (ledgerInfo as any).block_timestamp_usec,
        status: 'healthy'
      };
    } catch (error) {
      return {
        network,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get transaction details by hash
   */
  async getTransaction(txHash: string, network: 'testnet' | 'mainnet' = 'testnet') {
    try {
      const client = this.getClient(network);
      const txn = await client.getTransactionByHash(txHash);

      // Type guard for UserTransaction
      if (txn.type !== 'user_transaction') {
        throw new Error(`Transaction type ${txn.type} not supported`);
      }

      const userTxn = txn as any; // Cast to access properties

      return {
        hash: userTxn.hash,
        type: userTxn.type,
        success: userTxn.success,
        version: userTxn.version,
        stateChangeHash: userTxn.state_change_hash,
        eventRootHash: userTxn.event_root_hash,
        stateCheckpointHash: userTxn.state_checkpoint_hash,
        gasUsed: userTxn.gas_used,
        gasUnitPrice: userTxn.gas_unit_price,
        sender: userTxn.sender,
        sequenceNumber: userTxn.sequence_number,
        maxGasAmount: userTxn.max_gas_amount,
        expirationTimestampSecs: userTxn.expiration_timestamp_secs,
        payload: userTxn.payload,
        signature: userTxn.signature,
        events: userTxn.events,
        timestamp: userTxn.timestamp,
        vmStatus: userTxn.vm_status
      };
    } catch (error) {
      throw new Error(`Failed to get transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get account information
   */
  async getAccount(address: string, network: 'testnet' | 'mainnet' = 'testnet') {
    try {
      const client = this.getClient(network);
      const account = await client.getAccount(address) as any;

      // Get account resources
      const resources = await client.getAccountResources(address);

      // Get account balance (APT)
      const coinStore = resources.find(r =>
        r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
      );

      let balance = '0';
      if (coinStore) {
        balance = (coinStore.data as any).coin.value;
      }

      return {
        address: account.address || address,
        sequenceNumber: account.sequence_number,
        authenticationKey: account.authentication_key,
        balance: balance,
        resources: resources.length,
        lastTransactionTimestamp: account.last_transaction_timestamp_usec
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('Account not found')) {
        throw new Error(`Account ${address} not found on ${network}`);
      }
      throw new Error(`Failed to get account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}