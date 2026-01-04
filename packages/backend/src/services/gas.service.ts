import { AptosClient, TxnBuilderTypes, AptosAccount } from 'aptos';

export class GasEstimationService {
  private testnetClient: AptosClient;
  private mainnetClient: AptosClient;

  constructor() {
    this.testnetClient = new AptosClient(process.env.RPC_TESTNET ?? 'https://fullnode.testnet.aptoslabs.com/v1');
    this.mainnetClient = new AptosClient(process.env.RPC_MAINNET ?? 'https://fullnode.mainnet.aptoslabs.com/v1');
  }

  async getGasPrice(network: 'testnet' | 'mainnet') {
    const client = network === 'testnet' ? this.testnetClient : this.mainnetClient;
    try {
      const estimate = await (client as any).estimateGasPrice();
      // aptos SDK returns { gas_estimate }
      return estimate.gas_estimate ?? estimate;
    } catch (err) {
      // fallback
      return network === 'testnet' ? 100 : 150;
    }
  }

  async estimateFromSource(moveSource: string, network: 'testnet' | 'mainnet') {
    const sourceSize = Buffer.from(moveSource).length;
    const gasPrice = await this.getGasPrice(network);
    const estimatedGas = Math.ceil(1000 + sourceSize * 5);
    const maxGas = estimatedGas * 2;
    return {
      estimatedGas,
      maxGas,
      gasPrice,
      totalCost: estimatedGas * gasPrice,
      currency: 'APT',
      totalCostAPT: (estimatedGas * gasPrice) / 100_000_000,
    };
  }
}
