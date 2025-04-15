'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Connection, Transaction } from '@solana/web3.js';
import type { TokenInfo } from '@solana/spl-token-registry';

interface SnipeButtonProps {
  quote: any;
  tokenInfo?: TokenInfo;
}

export function SnipeButton({ quote, tokenInfo }: SnipeButtonProps) {
  const { publicKey, signTransaction, sendTransaction, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSig, setTxSig] = useState<string | null>(null);

  const handleSnipe = async () => {
    setError(null);
    setTxSig(null);
    if (!connected || !publicKey || !signTransaction) {
      setError('Wallet not connected');
      return;
    }
    if (!quote) {
      setError('No quote available');
      return;
    }
    setLoading(true);
    try {
      // Build Jupiter swap transaction
      const swapRes = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route: quote,
          userPublicKey: publicKey.toBase58(),
          wrapUnwrapSOL: true,
          asLegacyTransaction: true,
        }),
      });
      if (!swapRes.ok) throw new Error('Failed to build swap transaction');
      const swapData = await swapRes.json();
      if (!swapData.swapTransaction) throw new Error('No transaction returned');
      // Decode and sign transaction
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!, 'confirmed');
      const txBuf = Buffer.from(swapData.swapTransaction, 'base64');
      const tx = Transaction.from(txBuf);
      tx.feePayer = publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const signedTx = await signTransaction(tx);
      // Send transaction
      const sig = await connection.sendRawTransaction(signedTx.serialize());
      setTxSig(sig);
      // Store snipe in localStorage
      try {
        if (tokenInfo) {
          const entry = {
            token: tokenInfo.address,
            amount: (Number(quote.inAmount) / 1e9).toString(),
            symbol: tokenInfo.symbol,
            txSig: sig,
            timestamp: Date.now(),
          };
          const prev = localStorage.getItem('recentSnipes');
          let arr = prev ? JSON.parse(prev) : [];
          arr.unshift(entry);
          if (arr.length > 10) arr = arr.slice(0, 10);
          localStorage.setItem('recentSnipes', JSON.stringify(arr));
        }
      } catch (storageErr) {
        // Ignore storage errors
      }
    } catch (e: any) {
      setError(e.message || 'Swap failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 mt-4">
      <button
        className="px-6 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        onClick={handleSnipe}
        disabled={loading || !connected || !quote}
      >
        {loading ? 'Sniping...' : 'Snipe Now'}
      </button>
      {error && <div className="text-xs text-red-500">{error}</div>}
      {txSig && (
        <a
          href={`https://solscan.io/tx/${txSig}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-green-400 underline mt-1"
        >
          View on Solscan
        </a>
      )}
    </div>
  );
} 