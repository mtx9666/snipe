import React from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WalletProvider } from '../components/WalletProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Solana Token Sniper',
  description: 'Professional token sniping platform on Solana',
  keywords: 'solana, token, sniper, trading, cryptocurrency, defi',
  authors: [{ name: 'Solana Token Sniper Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-zinc-950">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <WalletProvider>
          <ErrorBoundary>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow relative">
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50" />
                <div className="relative">
                  {children}
                </div>
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </WalletProvider>
      </body>
    </html>
  );
}
