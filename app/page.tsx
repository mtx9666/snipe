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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <TrendingTokens />
      <TopGainers />
      <main className="w-full max-w-xl flex flex-col gap-8 items-center mt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Solana Token Sniper</h1>
        <p className="text-zinc-400 text-center mb-4 max-w-lg">
          Enter an SPL token address, amount of SOL to swap, and your max slippage. Connect your Phantom wallet to snipe tokens instantly on Solana mainnet.
        </p>
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
      </main>
      <RecentSnipes />
      <WalletSwaps />
      <footer className="w-full text-center text-xs text-zinc-500 mt-12 mb-2">
        <span>
          Powered by Solana & Jupiter Aggregator. Not affiliated with Solana, Phantom, or Jupiter. <br />
          <a href="/legal" className="underline hover:text-zinc-300">Disclaimer</a>
        </span>
      </footer>
    </div>
  );
}
