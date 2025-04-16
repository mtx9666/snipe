'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface GainerToken {
  address: string;
  symbol: string;
  name: string;
  percentChange10m: number;
}

export function TopGainers() {
  const [tokens, setTokens] = useState<GainerToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/gainers');
        if (!response.ok) throw new Error('Failed to fetch top gainers');
        const data = await response.json();
        setTokens(data.slice(0, 5));
      } catch (err) {
        setError('Failed to fetch top gainers');
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
          <SparklesIcon className="h-5 w-5 text-green-500" />
          Top Gainers
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
                  <div className="flex items-center gap-1 text-green-400">
                    <ArrowUpIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {token.percentChange10m.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">10m Change</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 