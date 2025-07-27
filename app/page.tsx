

// app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';
import { FilterPanel } from '@/components/Controls/FilterPanel';
import { SearchBar } from '@/components/Controls/SearchBar';
import { TimeRangeSelector } from '@/components/Controls/TimeRangeSelector';
import { LatencyChart } from '@/components/Charts/LatencyChart';
import { StatsDisplay } from '@/components/Charts/StatsDisplay';
import { Legend } from '@/components/UI/Legend';
import { generateLatencyData, generateHistoricalPoint } from '@/lib/utils/latencySimulator';
import { generateMockHistoricalData } from '@/lib/data/mockLatencyData';
import { Loader2, X } from 'lucide-react';

// Dynamic import for Globe to avoid SSR issues with Three.js
const Globe = dynamic(
  () => import('@/components/Globe/Globe').then(mod => ({ default: mod.Globe })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }
);

export default function Home() {
  const {
    exchanges,
    selectedConnection,
    selectedExchange,
    historicalData,
    updateLatencyData,
    addHistoricalData,
    setSelectedConnection,
    setSelectedExchange,
    filters,
    timeRange
  } = useStore();
  
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize historical data
  useEffect(() => {
    if (!isInitialized) {
      // Generate initial historical data for all connections
      exchanges.forEach((from, i) => {
        exchanges.slice(i + 1).forEach(to => {
          const key = `${from.id}-${to.id}`;
          const baseLatency = 20 + Math.random() * 100;
          const historicalPoints = generateMockHistoricalData(baseLatency, timeRange);
          
          historicalPoints.forEach(point => {
            addHistoricalData(key, point);
          });
        });
      });
      setIsInitialized(true);
    }
  }, [exchanges, timeRange, addHistoricalData, isInitialized]);
  
  // Real-time latency updates
  useEffect(() => {
    const updateInterval = parseInt(process.env.NEXT_PUBLIC_UPDATE_INTERVAL || '5000');
    
    const updateLatencies = async () => {
      try {
        const newLatencyData = await generateLatencyData(exchanges);
        updateLatencyData(newLatencyData);
        
        // Add to historical data
        newLatencyData.forEach(connection => {
          const key = `${connection.from}-${connection.to}`;
          const historicalPoint = generateHistoricalPoint(connection.latency);
          addHistoricalData(key, historicalPoint);
        });
      } catch (error) {
        console.error('Failed to update latency data:', error);
      }
    };
    
    // Initial update
    updateLatencies();
    
    // Set up interval
    const interval = setInterval(updateLatencies, updateInterval);
    
    return () => clearInterval(interval);
  }, [exchanges, updateLatencyData, addHistoricalData]);
  
  // Get historical data for selected connection
  const selectedHistoricalData = selectedConnection
    ? historicalData.get(`${selectedConnection.from}-${selectedConnection.to}`) || []
    : [];
  
  return (
    <main className={`min-h-screen overflow-hidden ${filters.theme === 'dark' ? 'dark' : ''}`}>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="relative z-20 bg-white dark:bg-gray-800 shadow-lg">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Latency Topology Visualizer
              </h1>
              <TimeRangeSelector />
            </div>
          </div>
        </header>
        
        {/* Main Content Grid */}
        <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
          {/* Globe Container - Main View */}
          <div className="flex-1 relative">
            <Globe />
            
            {/* Search Bar - Repositioned */}
            <div className="absolute top-4 left-4 z-10">
              <SearchBar />
            </div>
            
            {/* Filter Panel - Repositioned */}
            <div className="absolute top-4 right-4 z-10">
              <FilterPanel />
            </div>
            
            {/* Selected Exchange Info */}
            {selectedExchange && (
              <div className="absolute top-20 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedExchange.name}
                  </h3>
                  <button
                    onClick={() => setSelectedExchange(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    Provider: <span className={`font-medium ${
                      selectedExchange.provider === 'AWS' ? 'text-orange-600' :
                      selectedExchange.provider === 'GCP' ? 'text-blue-600' :
                      'text-blue-500'
                    }`}>{selectedExchange.provider}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Region: <span className="font-medium text-gray-900 dark:text-white">{selectedExchange.region}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Coordinates: <span className="font-medium text-gray-900 dark:text-white">
                      {selectedExchange.lat.toFixed(2)}°, {selectedExchange.lng.toFixed(2)}°
                    </span>
                  </p>
                </div>
              </div>
            )}
            
            {/* Legend - Bottom Right */}
            <div className="absolute bottom-24 right-4 z-10">
              <Legend />
            </div>
          </div>
          
          {/* Bottom Panel - Stats and Charts */}
          <div className="w-full lg:w-full h-auto lg:h-48 bg-white dark:bg-gray-800 border-t lg:border-t border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Stats Display */}
              <div className="mb-4">
                <StatsDisplay />
              </div>
              
              {/* Historical Chart - Shows when connection is selected */}
              {selectedConnection && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <LatencyChart
                      connectionKey={`${selectedConnection.from} ↔ ${selectedConnection.to}`}
                      data={selectedHistoricalData}
                    />
                  </div>
                </div>
              )}
              
              {/* Help text when no connection selected */}
              {!selectedConnection && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">Click on a connection line to view historical latency data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}