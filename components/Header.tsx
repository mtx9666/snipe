'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Trending', href: '/trending' },
    { name: 'Auto Sniper', href: '/auto-sniper' },
    { name: 'Portfolio', href: '/portfolio' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Solana Token Sniper
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="ml-4 pl-4 border-l border-zinc-700">
                <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !py-2 !text-sm !font-medium !transition-colors" />
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !py-2 !px-3 !text-sm" />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
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
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-200 ease-in-out ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
} 