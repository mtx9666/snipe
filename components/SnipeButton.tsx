'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import type { TokenInfo } from '@solana/spl-token-registry';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

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
  const { publicKey, signTransaction, connected } = useWallet();
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
    <div className="glass-panel p-6">
      <button
        onClick={handleSnipe}
        disabled={!connected || disabled || loading}
        className={`w-full flex items-center justify-center gap-2 btn-primary ${
          !connected || disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading && <ArrowPathIcon className="h-5 w-5 animate-spin" />}
        <span>
          {loading ? 'Processing...' : connected ? 'Snipe Token' : 'Connect Wallet'}
        </span>
      </button>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-start gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <div className="font-medium text-red-400">Transaction Failed</div>
              <div className="text-sm text-red-300/70 mt-1">{error.message}</div>
            </div>
          </div>
        </div>
      )}

      {txSig && (
        <div className="mt-4">
          <a
            href={`https://solscan.io/tx/${txSig}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            View on Solscan
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
} 