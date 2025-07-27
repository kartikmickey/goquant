// lib/utils/latencySimulator.ts

import { Exchange, LatencyData, HistoricalLatency } from '../types';

// Calculate approximate latency based on distance and provider
function calculateBaseLatency(lat1: number, lng1: number, lat2: number, lng2: number): number {
  // Haversine formula for great-circle distance
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Approximate latency: speed of light in fiber is ~200,000 km/s
  // Add network overhead and routing inefficiency
  const speedOfLightLatency = (distance / 200000) * 1000; // ms
  const networkOverhead = 5 + Math.random() * 10; // 5-15ms overhead
  const routingFactor = 1.3 + Math.random() * 0.4; // 30-70% routing inefficiency
  
  return speedOfLightLatency * routingFactor + networkOverhead;
}

// Add realistic variations to latency
function addLatencyVariation(baseLatency: number): number {
  // Time of day factor (busier during business hours)
  const hour = new Date().getHours();
  const timeFactor = hour >= 9 && hour <= 17 ? 1.2 : 1.0;
  
  // Random network conditions
  const jitter = (Math.random() - 0.5) * baseLatency * 0.1; // ±10% jitter
  const congestion = Math.random() < 0.1 ? baseLatency * 0.5 : 0; // 10% chance of congestion
  
  return Math.max(1, baseLatency * timeFactor + jitter + congestion);
}

// Generate latency data between all exchange pairs
export function generateLatencyData(exchanges: Exchange[]): LatencyData[] {
  const latencyData: LatencyData[] = [];
  const timestamp = Date.now();
  
  for (let i = 0; i < exchanges.length; i++) {
    for (let j = i + 1; j < exchanges.length; j++) {
      const from = exchanges[i];
      const to = exchanges[j];
      
      const baseLatency = calculateBaseLatency(from.lat, from.lng, to.lat, to.lng);
      const latency = addLatencyVariation(baseLatency);
      
      // Add bidirectional connections with slight asymmetry
      latencyData.push({
        from: from.id,
        to: to.id,
        latency: Math.round(latency),
        timestamp,
        jitter: Math.random() * 5,
        packetLoss: Math.random() < 0.05 ? Math.random() * 2 : 0
      });
      
      latencyData.push({
        from: to.id,
        to: from.id,
        latency: Math.round(latency * (0.95 + Math.random() * 0.1)),
        timestamp,
        jitter: Math.random() * 5,
        packetLoss: Math.random() < 0.05 ? Math.random() * 2 : 0
      });
    }
  }
  
  return latencyData;
}

// Generate historical data point
export function generateHistoricalPoint(baseLatency: number): HistoricalLatency {
  const variation = addLatencyVariation(baseLatency);
  const min = variation * 0.8;
  const max = variation * 1.3;
  
  return {
    timestamp: Date.now(),
    latency: Math.round(variation),
    min: Math.round(min),
    max: Math.round(max),
    avg: Math.round((min + max + variation) / 3)
  };
}

// Mock latency API endpoint simulation
export async function fetchLatencyData(exchangeList: Exchange[]): Promise<LatencyData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  
  // Simulate occasional failures
  if (Math.random() < 0.05) {
    throw new Error('Network timeout');
  }
  
  return generateLatencyData(exchangeList);
}
