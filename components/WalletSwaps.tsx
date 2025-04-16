'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

interface Swap {
  token: string;
  amount: string;
  symbol: string;
  txSig: string;
  timestamp: number;
}

export function WalletSwaps() {
  const { connected } = useWallet();
  const [swaps, setSwaps] = useState<Swap[]>([]);

  useEffect(() => {
    if (!connected) return;
    const saved = localStorage.getItem('recentSnipes');
    if (saved) {
      try {
        setSwaps(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse recent snipes:', err);
      }
    }
  }, [connected]);

  if (!connected || swaps.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h2 className="text-lg font-semibold text-zinc-100 mb-4">Recent Snipes</h2>
      <div className="space-y-2">
        {swaps.map((swap, i) => (
          <div key={i} className="bg-zinc-800 rounded p-3 flex justify-between items-center">
            <div>
              <div className="text-zinc-100">{swap.symbol}</div>
              <div className="text-sm text-zinc-400">{swap.amount} SOL</div>
            </div>
            <a
              href={`https://solscan.io/tx/${swap.txSig}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 