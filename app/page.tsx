'use client';

import React, { useState, useCallback } from "react";
import { TokenInput } from "../components/TokenInput";
import { QuotePreview } from "../components/QuotePreview";
import { SnipeButton } from "../components/SnipeButton";
import { RecentSnipes } from "../components/RecentSnipes";
import { TrendingTokens } from "../components/TrendingTokens";
import { TopGainers } from "../components/TopGainers";
import { WalletSwaps } from "../components/WalletSwaps";
import type { TokenInfo } from "@solana/spl-token-registry";
import { useWallet } from '@solana/wallet-adapter-react';

interface TokenInputState {
  tokenAddress: string;
  solAmount: string;
  slippage: string;
  tokenInfo?: TokenInfo;
  valid: boolean;
  error?: string;
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

export default function Home() {
  const { publicKey } = useWallet();
  const [tokenInput, setTokenInput] = useState<TokenInputState>({
    tokenAddress: '',
    solAmount: '',
    slippage: '1',
    tokenInfo: undefined,
    valid: false,
    error: undefined,
  });
  const [quote, setQuote] = useState<JupiterQuote | null>(null);

  const handleQuote = useCallback((newQuote: JupiterQuote | null) => {
    setQuote(newQuote);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
            Solana Token Sniper
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Professional-grade token sniping platform. Execute trades with precision using advanced aggregation and real-time market data.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Market Data Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50">
              <TrendingTokens />
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50">
              <TopGainers />
            </div>
          </div>

          {/* Sniper Interface Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50">
              <div className="max-w-xl mx-auto">
                <TokenInput onChange={setTokenInput} />
                <QuotePreview
                  solAmount={tokenInput.solAmount}
                  tokenAddress={tokenInput.tokenAddress}
                  slippage={tokenInput.slippage}
                  tokenInfo={tokenInput.tokenInfo}
                  publicKey={publicKey ?? undefined}
                  onQuote={handleQuote}
                />
                <SnipeButton
                  tokenAddress={tokenInput.tokenAddress}
                  solAmount={tokenInput.solAmount}
                  slippage={tokenInput.slippage}
                  tokenInfo={tokenInput.tokenInfo}
                  disabled={!tokenInput.valid || !quote}
                />
              </div>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50">
              <RecentSnipes />
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50">
              <WalletSwaps />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
