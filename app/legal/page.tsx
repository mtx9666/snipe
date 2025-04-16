import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Legal Disclaimer - Solana Token Sniper',
  description: 'Legal disclaimer and terms of use for Solana Token Sniper application.',
};

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-2xl font-bold mb-4">Legal Disclaimer</h1>
      <div className="prose prose-invert max-w-none">
        <p className="mb-4">
          This application is provided &quot;as is&quot; and &quot;as available&quot; without any warranty of any kind. The application is intended for informational purposes only and should not be considered financial advice.
        </p>
        <p className="mb-4">
          Trading cryptocurrencies involves substantial risk and is not suitable for all investors. You should carefully consider whether trading is appropriate for you in light of your experience, objectives, financial resources, and other circumstances.
        </p>
        <p className="mb-4">
          We are not responsible for any losses you may incur through the use of this application. Always conduct your own research and due diligence before making any investment decisions.
        </p>
      </div>
    </div>
  );
} 