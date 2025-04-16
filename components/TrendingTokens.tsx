'use client';

import { useEffect, useState } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface TrendingToken {
  address: string;
  symbol: string;
  name: string;
  volume24h: number;
}

export function TrendingTokens() {
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/trending');
        if (!response.ok) throw new Error('Failed to fetch trending tokens');
        const data = await response.json();
        setTokens(data.slice(0, 5));
      } catch (err) {
        setError('Failed to fetch trending tokens');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />
          Trending Tokens
        </h2>
        {loading && <div className="text-sm text-blue-400">Refreshing...</div>}
      </div>
      
      {error ? (
        <div className="text-red-500 text-sm p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          {error}
        </div>
      ) : (
        <div className="space-y-3">
          {tokens.map((token) => (
            <div
              key={token.address}
              className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 hover:bg-zinc-800 transition-colors border border-zinc-700/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{token.symbol}</h3>
                  <p className="text-sm text-zinc-400">{token.name}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-zinc-300">
                    <ChartBarIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      ${token.volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">24h Volume</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 