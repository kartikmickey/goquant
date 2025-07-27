
// components/UI/Legend.tsx

'use client';

import { useStore } from '@/store/useStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function Legend() {
  const theme = useStore((state) => state.filters.theme);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        title="Show Legend"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-900 dark:text-white">Legend</h4>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Hide Legend"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      
      {/* Provider Colors */}
      <div className="mb-3">
        <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-1 font-medium">PROVIDERS</p>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-[10px] text-gray-700 dark:text-gray-300">AWS</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-[10px] text-gray-700 dark:text-gray-300">GCP</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] text-gray-700 dark:text-gray-300">Azure</span>
          </div>
        </div>
      </div>
      
      {/* Latency Colors */}
      <div>
        <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-1 font-medium">LATENCY</p>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] text-gray-700 dark:text-gray-300">&lt; 20ms</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-lime-500"></div>
            <span className="text-[10px] text-gray-700 dark:text-gray-300">20-50ms</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-[10px] text-gray-700 dark:text-gray-300">50-100ms</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-[10px] text-gray-700 dark:text-gray-300">100-150ms</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-[10px] text-gray-700 dark:text-gray-300">&gt; 150ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this export to lib/data/exchanges.ts for import fixing
export { exchanges } from '@/lib/data/exchanges';