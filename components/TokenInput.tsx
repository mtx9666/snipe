'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import { CurrencyDollarIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

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
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />
          Token Details
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            SPL Token Address
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={e => setTokenAddress(e.target.value.trim())}
            placeholder="Enter SPL token address"
            className="input-field"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            SOL Amount
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={solAmount}
            onChange={e => setSolAmount(e.target.value.replace(/[^\d.]/g, ''))}
            placeholder="Amount in SOL"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Max Slippage (%)
          </label>
          <input
            type="number"
            min="0.1"
            max="50"
            step="0.1"
            value={slippage}
            onChange={e => handleSlippage(e.target.value)}
            placeholder="1"
            className="input-field"
          />
        </div>

        {tokenInfo && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="font-medium text-green-400">
              {tokenInfo.name} ({tokenInfo.symbol})
            </div>
            <div className="text-xs text-green-300/70 mt-1">
              Verified token found in registry
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <div className="font-medium text-red-400">Invalid Token</div>
              <div className="text-xs text-red-300/70 mt-1">{error}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 