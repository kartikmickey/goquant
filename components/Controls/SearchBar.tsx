'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function SearchBar() {
  const { searchQuery, setSearchQuery, exchanges } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const filteredSuggestions = exchanges.filter(exchange =>
    exchange.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="absolute top-4 left-4 w-80">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search exchanges..."
          className="w-full pl-10 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      {isOpen && searchQuery && filteredSuggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map(exchange => (
            <button
              key={exchange.id}
              onClick={() => {
                setSearchQuery(exchange.name);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
            >
              <div className="flex items-center justify-between">
                <span>{exchange.name}</span>
                <span className={`text-xs ${
                  exchange.provider === 'AWS' ? 'text-orange-600' :
                  exchange.provider === 'GCP' ? 'text-blue-600' :
                  'text-blue-500'
                }`}>
                  {exchange.provider}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// components/Controls/TimeRangeSelector.tsx