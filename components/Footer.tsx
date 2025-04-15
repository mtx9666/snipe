export function Footer() {
  return (
    <footer className="w-full bg-zinc-900/50 border-t border-zinc-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-zinc-100 font-semibold mb-3">About</h3>
            <p className="text-zinc-400 text-sm">
              Solana Token Sniper is a decentralized application for efficiently trading SPL tokens on the Solana blockchain using Jupiter aggregator.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-zinc-100 font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-zinc-400 hover:text-white text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/trending" className="text-zinc-400 hover:text-white text-sm">
                  Trending Tokens
                </a>
              </li>
              <li>
                <a href="/legal" className="text-zinc-400 hover:text-white text-sm">
                  Legal & Privacy
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-zinc-100 font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://solana.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white text-sm"
                >
                  Solana
                </a>
              </li>
              <li>
                <a
                  href="https://jup.ag"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white text-sm"
                >
                  Jupiter
                </a>
              </li>
              <li>
                <a
                  href="https://phantom.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white text-sm"
                >
                  Phantom Wallet
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-xs">
            Powered by Solana & Jupiter Aggregator. Not affiliated with Solana, Phantom, or Jupiter.
          </p>
          <p className="text-zinc-500 text-xs mt-2">
            © {new Date().getFullYear()} Solana Token Sniper. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 