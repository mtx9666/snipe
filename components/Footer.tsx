import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-zinc-400 hover:text-white text-sm">
                  Trending Tokens
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-zinc-400 hover:text-white text-sm">
                  Legal & Privacy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://docs.jup.ag" className="text-zinc-400 hover:text-white text-sm" target="_blank" rel="noopener noreferrer">
                  Jupiter Docs
                </Link>
              </li>
              <li>
                <Link href="https://solana.com" className="text-zinc-400 hover:text-white text-sm" target="_blank" rel="noopener noreferrer">
                  Solana
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://twitter.com" className="text-zinc-400 hover:text-white text-sm" target="_blank" rel="noopener noreferrer">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://discord.gg" className="text-zinc-400 hover:text-white text-sm" target="_blank" rel="noopener noreferrer">
                  Discord
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-400 text-sm">
            © {new Date().getFullYear()} Solana Token Sniper. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 