'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import dynamic from 'next/dynamic';

const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

// Dynamically import wallet components to avoid SSR issues
const WalletProviderComponent: FC<{ children: ReactNode }> = ({ children }) => {
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

// Export a dynamic component with SSR disabled
export const WalletProvider = dynamic(
    () => Promise.resolve(WalletProviderComponent),
    { ssr: false }
); 