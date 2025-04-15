'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';

interface SwapTransaction {
  signature: string;
  timestamp: number;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
}

export function WalletSwaps() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [swaps, setSwaps] = useState<SwapTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSwaps() {
      if (!publicKey || !connection) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const signatures = await connection.getSignaturesForAddress(
          publicKey,
          { limit: 20 },
          'confirmed'
        );

        const transactions = await Promise.all(
          signatures.map(async (sig) => {
            const tx = await connection.getParsedTransaction(sig.signature, 'confirmed');
            if (!tx?.meta || !tx.blockTime) return null;

            // Filter for Jupiter swap transactions
            const isJupiterSwap = tx.meta.logMessages?.some(
              msg => msg.includes('Program log: Instruction: Route')
            );

            if (!isJupiterSwap) return null;

            return {
              signature: sig.signature,
              timestamp: tx.blockTime * 1000,
              tokenIn: 'SOL', // For simplicity. In production, parse actual token symbols
              tokenOut: 'Token', // For simplicity. In production, parse actual token symbols
              amountIn: (tx.meta.preBalances[0] - tx.meta.postBalances[0]) / 1e9 + ' SOL',
              amountOut: 'Unknown' // For simplicity. In production, parse actual amounts
            };
          })
        );

        setSwaps(transactions.filter((tx): tx is SwapTransaction => tx !== null));
      } catch (err) {
        setError('Failed to fetch wallet transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSwaps();
  }, [publicKey, connection]);

  if (!publicKey) {
    return null;
  }

  return (
    <div className="w-full max-w-xl bg-zinc-900 rounded-lg p-4 mt-8">
      <div className="font-semibold text-zinc-200 mb-2">Your Recent Swaps</div>
      {loading && <div className="text-blue-400 text-sm">Loading your transactions...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex flex-col gap-3">
        {swaps.map((swap) => (
          <div key={swap.signature} className="bg-zinc-800 rounded p-3">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-sm text-zinc-300">
                  {swap.tokenIn} → {swap.tokenOut}
                </span>
                <span className="text-xs text-zinc-400">
                  {swap.amountIn}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-zinc-400">
                  {new Date(swap.timestamp).toLocaleString()}
                </span>
                <a
                  href={`https://solscan.io/tx/${swap.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  View on Solscan
                </a>
              </div>
            </div>
          </div>
        ))}
        {swaps.length === 0 && !loading && (
          <div className="text-zinc-400 text-sm text-center py-4">
            No swap transactions found
          </div>
        )}
      </div>
    </div>
  );
} 