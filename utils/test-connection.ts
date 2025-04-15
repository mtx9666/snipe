import './load-env';
import { createConnection, checkConnection } from './connection';

async function testHeliusConnection() {
  console.log('Testing Helius RPC connection...');
  console.log('Using RPC URL:', process.env.NEXT_PUBLIC_SOLANA_RPC_URL);
  
  try {
    const connection = createConnection();
    
    // Test basic connection
    const isConnected = await checkConnection(connection);
    if (!isConnected) {
      throw new Error('Connection check failed');
    }
    
    // Get recent performance samples
    const perfSamples = await connection.getRecentPerformanceSamples(1);
    console.log('Recent performance sample:', {
      slot: perfSamples[0]?.slot,
      numTransactions: perfSamples[0]?.numTransactions,
    });
    
    // Get recent block production info
    const { blockhash } = await connection.getRecentBlockhash();
    console.log('Recent blockhash:', blockhash);
    
    console.log('✅ Helius RPC connection is working properly!');
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    throw error;
  }
}

// Run the test
testHeliusConnection().catch(console.error); 