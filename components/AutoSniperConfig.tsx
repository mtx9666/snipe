'use client';

import { useState, useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { AutoSniper } from '../utils/autoSniper';
import { Switch } from '@headlessui/react';

interface AutoSniperConfigProps {
  onStatusChange?: (isRunning: boolean) => void;
}

interface SnipeConfig {
  minVolume: number;
  minHolders: number;
  maxPrice: number;
  minPriceChange: number;
  solAmount: number;
  slippage: number;
  maxTokenAge: number;
}

export function AutoSniperConfig({ onStatusChange }: AutoSniperConfigProps) {
  const { connection } = useConnection();
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState<SnipeConfig>({
    minVolume: 1000,
    minHolders: 100,
    maxPrice: 10,
    minPriceChange: 5,
    solAmount: 0.1,
    slippage: 1,
    maxTokenAge: 30 // days
  });

  const sniper = new AutoSniper(connection);

  const toggleSniper = async () => {
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
      console.error('Error toggling sniper:', error);
      setIsRunning(false);
      onStatusChange?.(false);
    }
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Auto Sniper</h3>
        <Switch
          checked={isRunning}
          onChange={toggleSniper}
          className={`${
            isRunning ? 'bg-blue-600' : 'bg-zinc-700'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              isRunning ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-zinc-400">Min Volume (SOL)</label>
          <input
            type="number"
            value={config.minVolume}
            onChange={(e) => setConfig({ ...config, minVolume: Number(e.target.value) })}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400">Min Holders</label>
          <input
            type="number"
            value={config.minHolders}
            onChange={(e) => setConfig({ ...config, minHolders: Number(e.target.value) })}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400">Max Price (SOL)</label>
          <input
            type="number"
            value={config.maxPrice}
            onChange={(e) => setConfig({ ...config, maxPrice: Number(e.target.value) })}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400">Min Price Change (%)</label>
          <input
            type="number"
            value={config.minPriceChange}
            onChange={(e) => setConfig({ ...config, minPriceChange: Number(e.target.value) })}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400">SOL Amount per Trade</label>
          <input
            type="number"
            value={config.solAmount}
            onChange={(e) => setConfig({ ...config, solAmount: Number(e.target.value) })}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400">Slippage (%)</label>
          <input
            type="number"
            value={config.slippage}
            onChange={(e) => setConfig({ ...config, slippage: Number(e.target.value) })}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400">Max Token Age (days)</label>
          <input
            type="number"
            value={config.maxTokenAge}
            onChange={(e) => setConfig({ ...config, maxTokenAge: Number(e.target.value) })}
            className="input-field mt-1"
          />
        </div>
      </div>
    </div>
  );
} 