import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // Only Phantom wallet supported for now
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider wallets={wallets} autoConnect>
                {children}
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
}; 