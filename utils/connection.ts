import { Connection, ConnectionConfig } from '@solana/web3.js';

const HELIUS_CONFIG: ConnectionConfig = {
  commitment: 'confirmed',
  disableRetryOnRateLimit: false,
  confirmTransactionInitialTimeout: 120000, // 120 seconds
};

export function createConnection(): Connection {
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  if (!rpcUrl) {
    throw new Error('NEXT_PUBLIC_SOLANA_RPC_URL is not defined');
  }
  
  return new Connection(rpcUrl, HELIUS_CONFIG);
}

// Utility function to check connection health
export async function checkConnection(connection: Connection): Promise<boolean> {
  try {
    const blockHeight = await connection.getBlockHeight();
    console.log('Current block height:', blockHeight);
    return true;
  } catch (error) {
    console.error('Connection check failed:', error);
    return false;
  }
} 