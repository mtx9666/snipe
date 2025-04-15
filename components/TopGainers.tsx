import { useEffect, useState } from 'react';

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
    setLoading(true);
    setError(null);
    fetch('https://stats.jup.ag/top-gainers-10m')
      .then(res => res.json())
      .then(data => {
        setTokens(data.slice(0, 10));
      })
      .catch(() => setError('Failed to fetch top gainers'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-xl bg-zinc-900 rounded-lg p-4 mt-8">
      <div className="font-semibold text-zinc-200 mb-2">Top Gainers (10m)</div>
      {loading && <div className="text-blue-400 text-sm">Loading...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tokens.map((token) => (
          <div key={token.address} className="bg-zinc-800 rounded p-3 flex flex-col gap-1">
            <span className="font-bold text-zinc-100">{token.symbol}</span>
            <span className="text-xs text-zinc-400">{token.name}</span>
            <span className="text-xs text-green-400">+{token.percentChange10m.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
} 