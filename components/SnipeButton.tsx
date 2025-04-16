'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Connection, Transaction } from '@solana/web3.js';
import type { TokenInfo } from '@solana/spl-token-registry';

interface SnipeButtonProps {
  tokenAddress: string;
  solAmount: string;
  slippage: string;
  tokenInfo?: TokenInfo;
  disabled?: boolean;
}

interface TransactionError {
  message: string;
  code?: string;
}

export function SnipeButton({ tokenAddress, solAmount, slippage, tokenInfo, disabled }: SnipeButtonProps) {
  const { publicKey, signTransaction, sendTransaction, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TransactionError | null>(null);
  const [txSig, setTxSig] = useState<string | null>(null);

  const handleSnipe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Transaction logic here
      // Remove unused sendTransaction for now
      
    } catch (err) {
      const error = err as TransactionError;
      setError(error);
      try {
        localStorage.setItem('lastError', JSON.stringify(error));
      } catch (storageError) {
        console.error('Failed to save error to localStorage:', storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 mt-4">
      <button
        className={`w-full px-4 py-2 rounded font-semibold text-white transition-colors ${
          !connected || disabled || loading
            ? 'bg-zinc-700 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={handleSnipe}
        disabled={!connected || disabled || loading}
      >
        {loading ? 'Processing...' : connected ? 'Snipe Token' : 'Connect Wallet'}
      </button>
      {error && <div className="text-xs text-red-500 mt-2">{error.message}</div>}
      {txSig && (
        <a
          href={`https://solscan.io/tx/${txSig}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-green-400 underline mt-1"
        >
          View on Solscan
        </a>
      )}
    </div>
  );
} 