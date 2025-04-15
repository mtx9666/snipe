import { Connection, PublicKey } from '@solana/web3.js';
import { GasOptimizer } from './gasOptimizer';
import { RateLimiter } from './rateLimiter';

interface TokenMetrics {
  volume24h: number;
  holderCount: number;
  price: number;
  lastUpdate: number;
}

interface JupiterTokenMetrics {
  [key: string]: {
    volume24h: number;
    price: number;
  };
}

interface SnipeConfig {
  minVolume: number;        // Minimum 24h volume in SOL
  minHolders: number;       // Minimum number of holders
  maxPrice: number;         // Maximum price in SOL
  minPriceChange: number;   // Minimum price change percentage to trigger
  solAmount: number;        // Amount of SOL to swap
  slippage: number;         // Maximum slippage percentage
  maxTokenAge: number;      // Maximum age of token data in milliseconds
}

export class AutoSniper {
  private connection: Connection;
  private gasOptimizer: GasOptimizer;
  private rateLimiter: RateLimiter;
  private tokenMetrics: Map<string, TokenMetrics>;
  private previousTokenMetrics: Map<string, TokenMetrics>;
  private isRunning: boolean;
  private updateInterval: NodeJS.Timeout | null;
  private readonly UPDATE_INTERVAL_MS = 10000; // 10 seconds
  private readonly MAX_TOKEN_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

  constructor(connection: Connection) {
    this.connection = connection;
    this.gasOptimizer = new GasOptimizer(connection);
    this.rateLimiter = new RateLimiter(8); // 8 RPS to stay safely under the 10 RPS limit
    this.tokenMetrics = new Map();
    this.previousTokenMetrics = new Map();
    this.isRunning = false;
    this.updateInterval = null;
  }

  /**
   * Start monitoring tokens with the given configuration
   */
  async startMonitoring(config: SnipeConfig): Promise<void> {
    if (this.isRunning) {
      throw new Error('Auto-sniper is already running');
    }

    this.isRunning = true;
    console.log('Starting auto-sniper with config:', config);

    // Initial metrics update
    await this.updateMetrics();

    // Set up periodic updates
    this.updateInterval = setInterval(async () => {
      try {
        await this.updateMetrics();
        await this.checkAndExecuteTrades(config);
        this.cleanupOldTokens(config.maxTokenAge || this.MAX_TOKEN_AGE_MS);
      } catch (error) {
        console.error('Error in auto-sniper monitoring:', error);
      }
    }, this.UPDATE_INTERVAL_MS);
  }

  /**
   * Stop monitoring tokens
   */
  stopMonitoring(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.isRunning = false;
    console.log('Auto-sniper stopped');
  }

  /**
   * Update metrics for monitored tokens
   */
  private async updateMetrics(): Promise<void> {
    try {
      // Store current metrics as previous before updating
      this.previousTokenMetrics = new Map(this.tokenMetrics);

      // Fetch token metrics from Jupiter API
      const response = await fetch('https://price-api.jup.ag/v4/token-metrics');
      const data = await response.json() as JupiterTokenMetrics;

      // Update metrics map
      for (const [address, jupiterMetrics] of Object.entries(data)) {
        this.tokenMetrics.set(address, {
          volume24h: jupiterMetrics.volume24h || 0,
          holderCount: await this.getHolderCount(new PublicKey(address)),
          price: jupiterMetrics.price || 0,
          lastUpdate: Date.now()
        });
      }
    } catch (error) {
      console.error('Error updating token metrics:', error);
    }
  }

  /**
   * Clean up old token data to prevent memory bloat
   */
  private cleanupOldTokens(maxAge: number): void {
    const now = Date.now();
    for (const [address, metrics] of this.tokenMetrics.entries()) {
      if (now - metrics.lastUpdate > maxAge) {
        this.tokenMetrics.delete(address);
        this.previousTokenMetrics.delete(address);
      }
    }
  }

  /**
   * Get holder count for a token with rate limiting
   */
  private async getHolderCount(tokenMint: PublicKey): Promise<number> {
    try {
      return await this.rateLimiter.schedule(async () => {
        const accounts = await this.connection.getProgramAccounts(
          new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
          {
            filters: [
              { dataSize: 165 },
              { memcmp: { offset: 0, bytes: tokenMint.toBase58() } }
            ]
          }
        );
        return accounts.length;
      });
    } catch (error) {
      console.error('Error getting holder count:', error);
      return 0;
    }
  }

  /**
   * Check metrics and execute trades if conditions are met
   */
  private async checkAndExecuteTrades(config: SnipeConfig): Promise<void> {
    for (const [address, metrics] of this.tokenMetrics.entries()) {
      if (this.shouldSnipe(metrics, config, address)) {
        try {
          await this.executeSnipe(address, config);
        } catch (error) {
          console.error(`Error executing snipe for token ${address}:`, error);
        }
      }
    }
  }

  /**
   * Check if a token meets snipe criteria
   */
  private shouldSnipe(metrics: TokenMetrics, config: SnipeConfig, address: string): boolean {
    // Calculate price change if we have historical data
    const previousMetrics = this.previousTokenMetrics.get(address);
    const priceChange = previousMetrics 
      ? ((metrics.price - previousMetrics.price) / previousMetrics.price) * 100
      : 0;

    return (
      metrics.volume24h >= config.minVolume &&
      metrics.holderCount >= config.minHolders &&
      metrics.price <= config.maxPrice &&
      Math.abs(priceChange) >= config.minPriceChange
    );
  }

  /**
   * Execute a snipe trade
   */
  private async executeSnipe(tokenAddress: string, config: SnipeConfig): Promise<void> {
    try {
      // Check network conditions and optimize gas
      const shouldIncreaseFee = await this.gasOptimizer.shouldIncreaseGas();
      
      // Prepare swap parameters
      const swapParams = {
        inputMint: 'So11111111111111111111111111111111111111112', // SOL
        outputMint: tokenAddress,
        amount: config.solAmount,
        slippage: config.slippage,
        priorityFee: shouldIncreaseFee ? 'high' : 'medium'
      };

      // Execute swap through Jupiter API
      console.log(`Executing snipe for token ${tokenAddress} with params:`, swapParams);
      
      // Note: Actual swap execution would go here
      // This is a placeholder for the actual Jupiter swap integration
      // You would need to integrate with your existing swap functionality
      
      // Log successful snipe
      console.log(`Successfully sniped token ${tokenAddress}`);
      
      // Remove token from monitoring to avoid duplicate snipes
      this.tokenMetrics.delete(tokenAddress);
    } catch (error) {
      console.error(`Failed to execute snipe for token ${tokenAddress}:`, error);
    }
  }
} 