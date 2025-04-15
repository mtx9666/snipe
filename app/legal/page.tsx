export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-zinc-100 mb-8">Legal Information</h1>

      {/* Disclaimer */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-zinc-200 mb-4">Disclaimer</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Solana Token Sniper is a decentralized application (dApp) that facilitates token trading on the Solana blockchain. The application is provided "as is" without any warranties or guarantees.
          </p>
          <p className="text-zinc-300 mt-4">
            Trading cryptocurrencies involves substantial risk and may result in the loss of your invested capital. You should not invest more than you can afford to lose and should ensure that you fully understand the risks involved.
          </p>
          <p className="text-zinc-300 mt-4">
            We are not affiliated with, endorsed by, or sponsored by Solana, Phantom, Jupiter, or any other mentioned third parties. All trademarks belong to their respective owners.
          </p>
        </div>
      </section>

      {/* Terms of Service */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-zinc-200 mb-4">Terms of Service</h2>
        <div className="prose prose-invert max-w-none">
          <h3 className="text-xl text-zinc-300 mt-6">1. Acceptance of Terms</h3>
          <p className="text-zinc-300">
            By accessing and using Solana Token Sniper, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>

          <h3 className="text-xl text-zinc-300 mt-6">2. Use License</h3>
          <p className="text-zinc-300">
            Permission is granted to temporarily access and use Solana Token Sniper for personal, non-commercial transactional purposes.
          </p>

          <h3 className="text-xl text-zinc-300 mt-6">3. Limitations</h3>
          <p className="text-zinc-300">
            You may not:
          </p>
          <ul className="list-disc pl-6 text-zinc-300">
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained in Solana Token Sniper</li>
            <li>Remove any copyright or other proprietary notations</li>
            <li>Transfer the materials to another person or mirror the materials on any other server</li>
          </ul>
        </div>
      </section>

      {/* Privacy Policy */}
      <section>
        <h2 className="text-2xl font-semibold text-zinc-200 mb-4">Privacy Policy</h2>
        <div className="prose prose-invert max-w-none">
          <h3 className="text-xl text-zinc-300 mt-6">1. Information Collection</h3>
          <p className="text-zinc-300">
            We only collect information that is necessary for the functioning of the application:
          </p>
          <ul className="list-disc pl-6 text-zinc-300">
            <li>Wallet addresses (when connected)</li>
            <li>Transaction history (stored locally)</li>
            <li>User preferences (stored locally)</li>
          </ul>

          <h3 className="text-xl text-zinc-300 mt-6">2. Information Usage</h3>
          <p className="text-zinc-300">
            The collected information is used solely for:
          </p>
          <ul className="list-disc pl-6 text-zinc-300">
            <li>Facilitating token transactions</li>
            <li>Displaying transaction history</li>
            <li>Improving user experience</li>
          </ul>

          <h3 className="text-xl text-zinc-300 mt-6">3. Data Storage</h3>
          <p className="text-zinc-300">
            All user data is stored locally in your browser. We do not maintain any central database of user information.
          </p>

          <h3 className="text-xl text-zinc-300 mt-6">4. Third-Party Services</h3>
          <p className="text-zinc-300">
            We integrate with the following third-party services:
          </p>
          <ul className="list-disc pl-6 text-zinc-300">
            <li>Solana blockchain</li>
            <li>Jupiter aggregator</li>
            <li>Phantom wallet</li>
          </ul>
          <p className="text-zinc-300 mt-4">
            Please review the privacy policies of these services for more information about how they handle your data.
          </p>
        </div>
      </section>
    </div>
  );
} 