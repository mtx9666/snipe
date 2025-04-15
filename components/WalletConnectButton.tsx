import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useState } from 'react';

export function WalletConnectButton() {
    const { connected, connecting, publicKey, connect, disconnect, wallet } = useWallet();
    const [error, setError] = useState<string | null>(null);

    const handleConnect = useCallback(async () => {
        setError(null);
        try {
            await connect();
        } catch (err: any) {
            setError(err?.message || 'Wallet connection failed');
        }
    }, [connect]);

    const handleDisconnect = useCallback(async () => {
        setError(null);
        try {
            await disconnect();
        } catch (err: any) {
            setError(err?.message || 'Wallet disconnect failed');
        }
    }, [disconnect]);

    return (
        <div className="flex flex-col items-center gap-2">
            {connected && publicKey ? (
                <>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        onClick={handleDisconnect}
                        aria-label="Disconnect wallet"
                    >
                        Disconnect ({publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)})
                    </button>
                </>
            ) : (
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                    onClick={handleConnect}
                    disabled={connecting || !wallet}
                    aria-label="Connect Phantom Wallet"
                >
                    {connecting ? 'Connecting...' : 'Connect Phantom Wallet'}
                </button>
            )}
            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    );
} 