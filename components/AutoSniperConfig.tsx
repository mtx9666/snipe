import { useState, useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { AutoSniper } from '../utils/autoSniper';
import { Switch } from '@headlessui/react';

interface AutoSniperConfigProps {
  onStatusChange?: (isRunning: boolean) => void;
}

export function AutoSniperConfig({ onStatusChange }: AutoSniperConfigProps) {
  const { connection } = useConnection();
  const [isRunning, setIsRunning] = useState(false);
  const [sniper, setSniper] = useState<AutoSniper | null>(null);
  const [config, setConfig] = useState({
    minVolume: 100,      // 100 SOL minimum volume
    minHolders: 50,      // 50 minimum holders
    maxPrice: 1,         // 1 SOL maximum price
    minPriceChange: 5,   // 5% minimum price change
    solAmount: 0.1,      // 0.1 SOL per trade
    slippage: 1,         // 1% slippage
  });

  useEffect(() => {
    if (connection) {
      setSniper(new AutoSniper(connection));
    }
  }, [connection]);

  const handleToggle = async () => {
    if (!sniper) return;

    try {
      if (!isRunning) {
        await sniper.startMonitoring(config);
        setIsRunning(true);
      } else {
        sniper.stopMonitoring();
        setIsRunning(false);
      }
      onStatusChange?.(isRunning);
    } catch (error) {
      console.error('Error toggling auto-sniper:', error);
    }
  };

  const handleConfigChange = (key: keyof typeof config) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setConfig(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-100">Auto-Sniper Bot</h2>
        <Switch
          checked={isRunning}
          onChange={handleToggle}
          className={`${
            isRunning ? 'bg-blue-600' : 'bg-zinc-700'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span className="sr-only">Enable auto-sniper</span>
          <span
            className={`${
              isRunning ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300">
            Minimum Volume (SOL)
          </label>
          <input
            type="number"
            value={config.minVolume}
            onChange={handleConfigChange('minVolume')}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            step="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300">
            Minimum Holders
          </label>
          <input
            type="number"
            value={config.minHolders}
            onChange={handleConfigChange('minHolders')}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            step="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300">
            Maximum Price (SOL)
          </label>
          <input
            type="number"
            value={config.maxPrice}
            onChange={handleConfigChange('maxPrice')}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300">
            Min Price Change (%)
          </label>
          <input
            type="number"
            value={config.minPriceChange}
            onChange={handleConfigChange('minPriceChange')}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300">
            SOL per Trade
          </label>
          <input
            type="number"
            value={config.solAmount}
            onChange={handleConfigChange('solAmount')}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0.1"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300">
            Slippage (%)
          </label>
          <input
            type="number"
            value={config.slippage}
            onChange={handleConfigChange('slippage')}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0.1"
            max="50"
            step="0.1"
          />
        </div>
      </div>

      {isRunning && (
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
          <p className="text-sm text-blue-300">
            Auto-sniper is running. Monitoring tokens based on your configuration...
          </p>
        </div>
      )}
    </div>
  );
} 