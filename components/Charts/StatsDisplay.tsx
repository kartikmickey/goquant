
// components/Charts/StatsDisplay.tsx

'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function StatsDisplay() {
  const latencyData = useStore((state) => state.latencyData);
  const exchanges = useStore((state) => state.exchanges);
  const filters = useStore((state) => state.filters);
  const searchQuery = useStore((state) => state.searchQuery);
  
  // Calculate filtered exchanges inline to avoid the infinite loop
  const filteredExchangesCount = useMemo(() => {
    return exchanges.filter(exchange => {
      if (!filters.providers.includes(exchange.provider)) return false;
      if (filters.exchanges.length > 0 && !filters.exchanges.includes(exchange.id)) return false;
      if (searchQuery && !exchange.name.toLowerCase().includes(searchQuery)) return false;
      return exchange.active;
    }).length;
  }, [exchanges, filters, searchQuery]);
  
  const stats = useMemo(() => {
    if (latencyData.length === 0) {
      return {
        avgLatency: 0,
        minLatency: 0,
        maxLatency: 0,
        activeConnections: 0,
        packetLoss: 0,
        jitter: 0
      };
    }
    
    const latencies = latencyData.map(d => d.latency);
    const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
    const minLatency = Math.min(...latencies);
    const maxLatency = Math.max(...latencies);
    const activeConnections = latencyData.length;
    
    const packetLoss = latencyData
      .filter(d => d.packetLoss && d.packetLoss > 0)
      .length / latencyData.length * 100;
    
    const avgJitter = latencyData
      .reduce((sum, d) => sum + (d.jitter || 0), 0) / latencyData.length;
    
    return {
      avgLatency,
      minLatency,
      maxLatency,
      activeConnections,
      packetLoss: packetLoss.toFixed(1),
      jitter: avgJitter.toFixed(1)
    };
  }, [latencyData]);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Avg Latency</span>
          <Activity className="w-4 h-4 text-blue-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.avgLatency}ms
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Min Latency</span>
          <TrendingDown className="w-4 h-4 text-green-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.minLatency}ms
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Max Latency</span>
          <TrendingUp className="w-4 h-4 text-red-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.maxLatency}ms
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Connections</span>
          <Activity className="w-4 h-4 text-purple-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.activeConnections}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Packet Loss</span>
          <AlertTriangle className="w-4 h-4 text-orange-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.packetLoss}%
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Avg Jitter</span>
          <Activity className="w-4 h-4 text-indigo-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.jitter}ms
        </p>
      </div>
    </div>
  );
}