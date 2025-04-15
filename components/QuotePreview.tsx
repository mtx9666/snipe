'use client';

import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import type { TokenInfo } from '@solana/spl-token-registry';

interface QuotePreviewProps {
  solAmount: string;
  tokenAddress: string;
  slippage: string;
  tokenInfo?: TokenInfo;
  publicKey?: PublicKey;
  onQuote?: (quote: any) => void;
}

interface JupiterQuote {
  inAmount: string;
  outAmount: string;
  priceImpactPct: number;
  otherAmountThreshold: string;
  routePlan: any[];
  contextSlot: number;
  marketInfos: any[];
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
      } catch (e: any) {
        setError(e.message || 'Error fetching quote');
        if (onQuote) onQuote(null);
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, [solAmount, tokenAddress, slippage, tokenInfo, publicKey, onQuote]);

  if (!publicKey) return <div className="text-yellow-400 text-sm">Connect your wallet to preview swap.</div>;
  if (!tokenInfo) return <div className="text-zinc-400 text-sm">Enter a valid SPL token address.</div>;
  if (!solAmount || isNaN(Number(solAmount)) || Number(solAmount) <= 0) return <div className="text-zinc-400 text-sm">Enter a valid SOL amount.</div>;

  return (
    <div className="w-full bg-zinc-900 rounded-lg p-4 mt-2 flex flex-col gap-2">
      {loading && <div className="text-blue-400 text-sm">Fetching quote...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {quote && (
        <div className="flex flex-col gap-1">
          <div className="text-green-400 text-lg font-semibold">
            {Number(quote.outAmount) / Math.pow(10, tokenInfo.decimals)} {tokenInfo.symbol}
          </div>
          <div className="text-xs text-zinc-400">
            Expected output for {solAmount} SOL
          </div>
          <div className="text-xs text-zinc-400">
            Price Impact: <span className={quote.priceImpactPct > 0.05 ? 'text-red-400' : 'text-green-400'}>{(quote.priceImpactPct * 100).toFixed(2)}%</span>
          </div>
        </div>
      )}
    </div>
  );
} 