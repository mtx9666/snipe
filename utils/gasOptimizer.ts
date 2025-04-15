import { Connection, Transaction, ComputeBudgetProgram } from '@solana/web3.js';

interface GasSettings {
  priorityFee: number;  // micro-lamports
  computeUnits: number; // Maximum compute units
}

export class GasOptimizer {
  private connection: Connection;
  private readonly DEFAULT_COMPUTE_UNITS = 200000;
  private readonly MIN_PRIORITY_FEE = 1;  // micro-lamports
  private readonly MAX_PRIORITY_FEE = 1000000;  // 1 lamport
  
  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Calculate optimal gas settings based on network conditions
   */
  async getOptimalGasSettings(): Promise<GasSettings> {
    try {
      // Get recent prioritization fees
      const recentPrioritizationFees = await this.connection.getRecentPrioritizationFees();
      
      if (recentPrioritizationFees.length === 0) {
        return this.getDefaultSettings();
      }

      // Calculate median priority fee from recent transactions
      const sortedFees = recentPrioritizationFees
        .map(fee => fee.prioritizationFee)
        .sort((a, b) => a - b);
      
      const medianFee = sortedFees[Math.floor(sortedFees.length / 2)];
      
      // Add 20% to the median fee to increase likelihood of inclusion
      const recommendedFee = Math.min(
        Math.max(
          Math.ceil(medianFee * 1.2),
          this.MIN_PRIORITY_FEE
        ),
        this.MAX_PRIORITY_FEE
      );

      return {
        priorityFee: recommendedFee,
        computeUnits: this.DEFAULT_COMPUTE_UNITS
      };
    } catch (error) {
      console.warn('Error calculating optimal gas settings:', error);
      return this.getDefaultSettings();
    }
  }

  /**
   * Add priority fee and compute budget instructions to a transaction
   */
  async optimizeTransaction(transaction: Transaction): Promise<Transaction> {
    const settings = await this.getOptimalGasSettings();

    // Add compute budget instruction
    transaction.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: settings.computeUnits
      })
    );

    // Add priority fee instruction
    if (settings.priorityFee > 0) {
      transaction.add(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: settings.priorityFee
        })
      );
    }

    return transaction;
  }

  /**
   * Get default gas settings when network data is unavailable
   */
  private getDefaultSettings(): GasSettings {
    return {
      priorityFee: this.MIN_PRIORITY_FEE,
      computeUnits: this.DEFAULT_COMPUTE_UNITS
    };
  }

  /**
   * Estimate whether current network conditions require higher fees
   */
  async shouldIncreaseGas(): Promise<boolean> {
    try {
      const recentPerformance = await this.connection.getRecentPerformanceSamples(10);
      
      if (recentPerformance.length === 0) {
        return false;
      }

      // Calculate average transaction count
      const avgTxCount = recentPerformance.reduce(
        (sum, sample) => sum + sample.numTransactions,
        0
      ) / recentPerformance.length;

      // If transaction count is high, network is congested
      return avgTxCount > 1500; // Threshold can be adjusted based on observations
    } catch (error) {
      console.warn('Error checking network conditions:', error);
      return false;
    }
  }
} 