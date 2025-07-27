// components/Controls/FilterPanel.tsx

'use client';

import { useStore } from '@/store/useStore';
import { Sun, Moon, Eye, EyeOff, Server, Cloud } from 'lucide-react';

export function FilterPanel() {
  const { filters, updateFilters, toggleTheme } = useStore();
  
  const handleProviderToggle = (provider: 'AWS' | 'GCP' | 'Azure') => {
    const newProviders = filters.providers.includes(provider)
      ? filters.providers.filter(p => p !== provider)
      : [...filters.providers, provider];
    updateFilters({ providers: newProviders });
  };
  
  const handleLatencyRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...filters.latencyRange] as [number, number];
    newRange[index] = value;
    updateFilters({ latencyRange: newRange });
  };
  
  return (
    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Filters</h3>
      
      {/* Theme Toggle */}
      <div className="mb-6">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
          {filters.theme === 'dark' ? (
            <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>
      
      {/* Cloud Providers */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Cloud Providers</h4>
        <div className="space-y-2">
          {(['AWS', 'GCP', 'Azure'] as const).map(provider => (
            <label key={provider} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.providers.includes(provider)}
                onChange={() => handleProviderToggle(provider)}
                className="mr-2"
              />
              <span className={`text-sm ${
                provider === 'AWS' ? 'text-orange-600' :
                provider === 'GCP' ? 'text-blue-600' :
                'text-blue-500'
              }`}>
                {provider}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Visibility Toggles */}
      <div className="mb-6 space-y-2">
        <button
          onClick={() => updateFilters({ showConnections: !filters.showConnections })}
          className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-sm text-gray-700 dark:text-gray-300">Connections</span>
          {filters.showConnections ? (
            <Eye className="w-4 h-4 text-green-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
        </button>
        
        <button
          onClick={() => updateFilters({ showRegions: !filters.showRegions })}
          className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-sm text-gray-700 dark:text-gray-300">Cloud Regions</span>
          {filters.showRegions ? (
            <Cloud className="w-4 h-4 text-green-600" />
          ) : (
            <Cloud className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      
      {/* Latency Range */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Latency Range (ms)
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="500"
              value={filters.latencyRange[0]}
              onChange={(e) => handleLatencyRangeChange(0, parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm w-12 text-gray-600 dark:text-gray-400">
              {filters.latencyRange[0]}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="500"
              value={filters.latencyRange[1]}
              onChange={(e) => handleLatencyRangeChange(1, parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm w-12 text-gray-600 dark:text-gray-400">
              {filters.latencyRange[1]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// components/Controls/SearchBar.tsx



