import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';

interface WalletOption {
  name: WalletName;
  icon: string;
}

export function WalletConnectButton() {
  const { select, wallets, connecting, connected, disconnect } = useWallet();
  
  const handleConnect = (walletName: WalletName) => {
    if (connected) {
      disconnect();
    } else {
      select(walletName);
    }
  };

  return (
    <div className="relative inline-block">
      <div className="flex gap-2">
        {wallets.map((wallet) => (
          <button
            key={wallet.adapter.name}
            onClick={() => handleConnect(wallet.adapter.name)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              connected && wallet.adapter.connected
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
            }`}
            disabled={connecting}
          >
            {wallet.adapter.icon && (
              <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-5 h-5" />
            )}
            {connected && wallet.adapter.connected ? 'Disconnect' : wallet.adapter.name}
          </button>
        ))}
      </div>
    </div>
  );
} 