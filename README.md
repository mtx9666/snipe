# Solana Token Sniper

A modern, decentralized application for efficiently trading SPL tokens on the Solana blockchain using Jupiter aggregator.

## Features

- 🚀 Real-time token sniping with Jupiter aggregation
- 💰 Best price execution across multiple DEXs
- 🔒 Secure, client-side only transactions
- 📊 Live market data and trending tokens
- 📱 Responsive design for all devices
- 🔍 Token validation and price impact warnings
- 📈 Transaction history tracking
- ⚡ Fast and efficient swaps

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Solana Web3.js
- Jupiter SDK
- Phantom Wallet Integration

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Phantom Wallet browser extension

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/solana-token-sniper.git
   cd solana-token-sniper
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SOLANA_RPC_URL=your_rpc_url
   NEXT_PUBLIC_JUPITER_API_URL=https://price-api.jup.ag/v4
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `NEXT_PUBLIC_SOLANA_RPC_URL`: Your Solana RPC endpoint
- `NEXT_PUBLIC_JUPITER_API_URL`: Jupiter API endpoint for price data

## Project Structure

```
solana-sniper/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── legal/             # Legal pages
├── components/            # React components
│   ├── TokenInput.tsx     # Token input form
│   ├── QuotePreview.tsx   # Price quote display
│   ├── SnipeButton.tsx    # Transaction execution
│   └── ...               # Other components
├── utils/                 # Utility functions
│   ├── validation.ts      # Input validation
│   └── ...               # Other utilities
├── styles/               # Global styles
└── public/               # Static assets
```

## Security Features

- Input validation and sanitization
- Rate limiting
- Security headers
- Error boundaries
- No private key handling
- Client-side only storage
- Comprehensive error handling

## Development

### Running Tests
```bash
npm run test
# or
yarn test
```

### Linting
```bash
npm run lint
# or
yarn lint
```

### Building for Production
```bash
npm run build
# or
yarn build
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your preferred hosting platform (e.g., Vercel):
   ```bash
   vercel deploy
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Solana](https://solana.com) - Blockchain platform
- [Jupiter](https://jup.ag) - DEX aggregator
- [Phantom](https://phantom.app) - Wallet provider

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Disclaimer

Trading cryptocurrencies involves substantial risk. Please read our [legal disclaimer](https://your-app-url.com/legal) before using the application.
