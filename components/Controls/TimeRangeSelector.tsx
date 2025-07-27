'use client';

import { useStore } from '@/store/useStore';
import { Clock } from 'lucide-react';

const timeRanges = [
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' }
] as const;

export function TimeRangeSelector() {
  const { timeRange, setTimeRange } = useStore();
  
  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
      <Clock className="w-4 h-4 text-gray-500 ml-2" />
      <div className="flex">
        {timeRanges.map(range => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              timeRange === range.value
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}