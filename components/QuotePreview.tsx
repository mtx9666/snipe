'use client';

import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import type { TokenInfo } from '@solana/spl-token-registry';
import { ArrowsRightLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface QuotePreviewProps {
  solAmount: string;
  tokenAddress: string;
  slippage: string;
  tokenInfo?: TokenInfo;
  publicKey?: PublicKey;
  onQuote?: (quote: JupiterQuote | null) => void;
}

interface JupiterQuote {
  inAmount: string;
  outAmount: string;
  priceImpactPct: number;
  otherAmountThreshold: string;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
  }>;
  contextSlot: number;
  marketInfos: Array<{
    id: string;
    label: string;
    inputMint: string;
    outputMint: string;
    notEnoughLiquidity: boolean;
    inAmount: string;
    outAmount: string;
    priceImpactPct: number;
    lpFee: {
      amount: string;
      mint: string;
      pct: number;
    };
  }>;
}

export function QuotePreview({ solAmount, tokenAddress, slippage, tokenInfo, publicKey, onQuote }: QuotePreviewProps) {
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<JupiterQuote | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuote(null);
    setError(null);
    if (onQuote) onQuote(null);
    if (!solAmount || !tokenAddress || !tokenInfo || !publicKey) return;
    if (isNaN(Number(solAmount)) || Number(solAmount) <= 0) return;

    const fetchQuote = async () => {
      setLoading(true);
      try {
        const url = `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${tokenAddress}&amount=${Math.floor(Number(solAmount) * 1e9)}&slippageBps=${Math.floor(Number(slippage) * 100)}&userPublicKey=${publicKey.toBase58()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch quote');
        const data = await res.json();
        if (!data || !data.outAmount) throw new Error('No quote available');
        setQuote(data);
        if (onQuote) onQuote(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error fetching quote';
        setError(errorMessage);
        if (onQuote) onQuote(null);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(debounceTimer);
  }, [solAmount, tokenAddress, slippage, tokenInfo, publicKey, onQuote]);

  if (!publicKey) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 text-yellow-400">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <span>Connect your wallet to preview swap</span>
        </div>
      </div>
    );
  }

  if (!tokenInfo) {
    return (
      <div className="glass-panel p-6">
        <div className="text-zinc-400">Enter a valid SPL token address</div>
      </div>
    );
  }

  if (!solAmount || isNaN(Number(solAmount)) || Number(solAmount) <= 0) {
    return (
      <div className="glass-panel p-6">
        <div className="text-zinc-400">Enter a valid SOL amount</div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ArrowsRightLeftIcon className="h-5 w-5 text-blue-500" />
          Swap Preview
        </h2>
        {loading && (
          <div className="text-sm text-blue-400 animate-pulse-blue">
            Fetching best route...
          </div>
        )}
      </div>

      {error ? (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      ) : quote ? (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-400">You pay</div>
                <div className="text-lg font-semibold text-white">{solAmount} SOL</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-zinc-400">You receive</div>
                <div className="text-lg font-semibold text-green-400">
                  {(Number(quote.outAmount) / Math.pow(10, tokenInfo.decimals)).toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })} {tokenInfo.symbol}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Price Impact</span>
            <span className={quote.priceImpactPct > 0.05 ? 'text-red-400' : 'text-green-400'}>
              {(quote.priceImpactPct * 100).toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Max Slippage</span>
            <span className="text-zinc-300">{slippage}%</span>
          </div>
        </div>
      ) : (
        <div className="text-zinc-400">Loading quote...</div>
      )}
    </div>
  );
} 