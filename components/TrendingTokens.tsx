import { useEffect, useState } from 'react';

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
    setLoading(true);
    setError(null);
    fetch('https://stats.jup.ag/trending')
      .then(res => res.json())
      .then(data => {
        setTokens(data.slice(0, 10));
      })
      .catch(() => setError('Failed to fetch trending tokens'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-xl bg-zinc-900 rounded-lg p-4 mt-8">
      <div className="font-semibold text-zinc-200 mb-2">Trending Tokens</div>
      {loading && <div className="text-blue-400 text-sm">Loading...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tokens.map((token) => (
          <div key={token.address} className="bg-zinc-800 rounded p-3 flex flex-col gap-1">
            <span className="font-bold text-zinc-100">{token.symbol}</span>
            <span className="text-xs text-zinc-400">{token.name}</span>
            <span className="text-xs text-green-400">Vol 24h: ${token.volume24h.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 