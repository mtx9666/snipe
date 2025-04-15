'use client';

import { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-zinc-100">
              Solana Token Sniper
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <a href="/" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm">
              Home
            </a>
            <a href="/trending" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm">
              Trending
            </a>
            <a href="/legal" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm">
              Legal
            </a>
            <div className="ml-4">
              <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <div className="mr-4">
              <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !py-2 !px-3 !text-sm" />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-zinc-900 border-b border-zinc-800">
          <a
            href="/"
            className="text-zinc-300 hover:text-white block px-3 py-2 rounded-md text-base"
          >
            Home
          </a>
          <a
            href="/trending"
            className="text-zinc-300 hover:text-white block px-3 py-2 rounded-md text-base"
          >
            Trending
          </a>
          <a
            href="/legal"
            className="text-zinc-300 hover:text-white block px-3 py-2 rounded-md text-base"
          >
            Legal
          </a>
        </div>
      </div>
    </header>
  );
} 