// store/useStore.ts

import { create } from 'zustand';
import { Exchange, CloudRegion, LatencyData, Filters, TimeRange, HistoricalLatency } from '@/lib/types';
import { exchanges } from '@/lib/data/exchanges';
import { cloudRegions } from '@/lib/data/cloudRegions';

interface AppState {
  // Data
  exchanges: Exchange[];
  cloudRegions: CloudRegion[];
  latencyData: LatencyData[];
  historicalData: Map<string, HistoricalLatency[]>;
  
  // UI State
  selectedExchange: Exchange | null;
  selectedConnection: { from: string; to: string } | null;
  hoveredItem: { type: 'exchange' | 'region'; id: string } | null;
  
  // Filters
  filters: Filters;
  searchQuery: string;
  timeRange: TimeRange;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSelectedExchange: (exchange: Exchange | null) => void;
  setSelectedConnection: (connection: { from: string; to: string } | null) => void;
  setHoveredItem: (item: { type: 'exchange' | 'region'; id: string } | null) => void;
  updateFilters: (filters: Partial<Filters>) => void;
  setSearchQuery: (query: string) => void;
  setTimeRange: (range: TimeRange) => void;
  updateLatencyData: (data: LatencyData[]) => void;
  addHistoricalData: (key: string, data: HistoricalLatency) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleTheme: () => void;
  
  // Computed - these are getter functions, not state
  getFilteredExchanges: () => Exchange[];
  getFilteredRegions: () => CloudRegion[];
  getActiveConnections: () => LatencyData[];
}

export const useStore = create<AppState>((set, get) => ({
  // Initial data
  exchanges: exchanges,
  cloudRegions: cloudRegions,
  latencyData: [],
  historicalData: new Map(),
  
  // Initial UI state
  selectedExchange: null,
  selectedConnection: null,
  hoveredItem: null,
  
  // Initial filters
  filters: {
    exchanges: [],
    providers: ['AWS', 'GCP', 'Azure'],
    latencyRange: [0, 500],
    showRegions: true,
    showConnections: true,
    theme: 'dark'
  },
  searchQuery: '',
  timeRange: '24h',
  
  // Loading states
  isLoading: false,
  error: null,
  
  // Actions
  setSelectedExchange: (exchange) => set({ selectedExchange: exchange }),
  
  setSelectedConnection: (connection) => set({ selectedConnection: connection }),
  
  setHoveredItem: (item) => set({ hoveredItem: item }),
  
  updateFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  setSearchQuery: (query) => set({ searchQuery: query.toLowerCase() }),
  
  setTimeRange: (range) => set({ timeRange: range }),
  
  updateLatencyData: (data) => set({ latencyData: data }),
  
  addHistoricalData: (key, data) => set((state) => {
    const historical = new Map(state.historicalData);
    const existing = historical.get(key) || [];
    
    // Keep last 1000 data points
    const updated = [...existing, data].slice(-1000);
    historical.set(key, updated);
    
    return { historicalData: historical };
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  toggleTheme: () => set((state) => ({
    filters: {
      ...state.filters,
      theme: state.filters.theme === 'light' ? 'dark' : 'light'
    }
  })),
  
  // Computed values - moved outside of state to avoid infinite loops
  getFilteredExchanges: () => {
    const state = get();
    return state.exchanges.filter(exchange => {
      // Provider filter
      if (!state.filters.providers.includes(exchange.provider)) return false;
      
      // Exchange filter
      if (state.filters.exchanges.length > 0 && !state.filters.exchanges.includes(exchange.id)) {
        return false;
      }
      
      // Search filter
      if (state.searchQuery && !exchange.name.toLowerCase().includes(state.searchQuery)) {
        return false;
      }
      
      return exchange.active;
    });
  },
  
  getFilteredRegions: () => {
    const state = get();
    if (!state.filters.showRegions) return [];
    
    return state.cloudRegions.filter(region => {
      return state.filters.providers.includes(region.provider);
    });
  },
  
  getActiveConnections: () => {
    const state = get();
    if (!state.filters.showConnections) return [];
    
    const filteredExchangeIds = get().getFilteredExchanges().map(e => e.id);
    
    return state.latencyData.filter(connection => {
      // Check if both endpoints are visible
      const fromVisible = filteredExchangeIds.includes(connection.from);
      const toVisible = filteredExchangeIds.includes(connection.to);
      
      if (!fromVisible || !toVisible) return false;
      
      // Latency range filter
      return connection.latency >= state.filters.latencyRange[0] && 
             connection.latency <= state.filters.latencyRange[1];
    });
  }
}));