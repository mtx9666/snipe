'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

interface TokenInputProps {
  onChange: (data: {
    tokenAddress: string;
    solAmount: string;
    slippage: string;
    tokenInfo?: TokenInfo;
    valid: boolean;
    error?: string;
  }) => void;
}

export function TokenInput({ onChange }: TokenInputProps) {
  const { } = useWallet();
  const [tokenAddress, setTokenAddress] = useState('');
  const [solAmount, setSolAmount] = useState('');
  const [slippage, setSlippage] = useState('1');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [tokenList, setTokenList] = useState<TokenInfo[]>([]);

  // Load token list once
  useEffect(() => {
    new TokenListProvider().resolve().then((container) => {
      setTokenList(container.filterByChainId(101).getList());
    });
  }, []);

  // Load slippage from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('slippage');
    if (saved && !isNaN(Number(saved))) {
      setSlippage(saved);
    }
  }, []);

  // Save slippage to localStorage on change
  useEffect(() => {
    localStorage.setItem('slippage', slippage);
  }, [slippage]);

  // Validate token address
  useEffect(() => {
    setError(undefined);
    setTokenInfo(undefined);
    if (!tokenAddress) return;
    const info = tokenList.find((t) => t.address === tokenAddress);
    if (!info) {
      setError('Token not found in Solana token registry.');
      onChange({ tokenAddress, solAmount, slippage, valid: false, error: 'Token not found', tokenInfo: undefined });
      return;
    }
    setTokenInfo(info);
    onChange({ tokenAddress, solAmount, slippage, valid: true, tokenInfo: info });
  }, [tokenAddress, tokenList, solAmount, slippage, onChange]);

  // Slippage validation
  const handleSlippage = (value: string) => {
    const sanitized = value.replace(/[^\d.]/g, '');
    let num = parseFloat(sanitized);
    if (isNaN(num) || num < 0.1) num = 0.1;
    if (num > 50) num = 50;
    setSlippage(num.toString());
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-zinc-900 rounded-lg shadow max-w-md w-full mx-auto">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-200">SPL Token Address</span>
        <input
          className="px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={tokenAddress}
          onChange={e => setTokenAddress(e.target.value.trim())}
          placeholder="Enter SPL token address"
          autoComplete="off"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-200">SOL Amount</span>
        <input
          className="px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          min="0"
          step="any"
          value={solAmount}
          onChange={e => setSolAmount(e.target.value.replace(/[^\d.]/g, ''))}
          placeholder="Amount in SOL"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-200">Max Slippage (%)</span>
        <input
          className="px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          min="0.1"
          max="50"
          step="0.1"
          value={slippage}
          onChange={e => handleSlippage(e.target.value)}
          placeholder="1"
        />
      </label>
      {tokenInfo && (
        <div className="text-xs text-green-400">
          Token: {tokenInfo.name} ({tokenInfo.symbol})
        </div>
      )}
      {error && <div className="text-xs text-red-500">{error}</div>}
    </div>
  );
} 