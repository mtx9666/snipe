import { useEffect, useState } from 'react';

interface SnipeEntry {
  token: string;
  amount: string;
  symbol: string;
  txSig: string;
  timestamp: number;
}

export function RecentSnipes() {
  const [snipes, setSnipes] = useState<SnipeEntry[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('recentSnipes');
    if (data) {
      setSnipes(JSON.parse(data));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('recentSnipes');
    setSnipes([]);
  };

  if (snipes.length === 0) return null;

  return (
    <div className="w-full max-w-xl bg-zinc-900 rounded-lg p-4 mt-8">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-zinc-200">Recent Snipes</span>
        <button
          className="text-xs text-red-400 hover:underline"
          onClick={clearHistory}
        >
          Clear
        </button>
      </div>
      <ul className="divide-y divide-zinc-800">
        {snipes.map((snipe, i) => (
          <li key={i} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <span className="text-sm text-zinc-100">
              {snipe.amount} SOL → {snipe.symbol} <span className="text-zinc-400">({snipe.token.slice(0, 4)}...{snipe.token.slice(-4)})</span>
            </span>
            <span className="text-xs text-zinc-400">
              {new Date(snipe.timestamp).toLocaleString()}
            </span>
            <a
              href={`https://solscan.io/tx/${snipe.txSig}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 underline"
            >
              View TX
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
} 