
// lib/data/mockLatencyData.ts

import { TimeRange, HistoricalLatency } from '../types';

// Generate mock historical data for a given time range
export function generateMockHistoricalData(
  baseLatency: number,
  timeRange: TimeRange
): HistoricalLatency[] {
  const data: HistoricalLatency[] = [];
  const now = Date.now();
  let interval: number;
  let points: number;
  
  switch (timeRange) {
    case '1h':
      interval = 60 * 1000; // 1 minute
      points = 60;
      break;
    case '24h':
      interval = 30 * 60 * 1000; // 30 minutes
      points = 48;
      break;
    case '7d':
      interval = 2 * 60 * 60 * 1000; // 2 hours
      points = 84;
      break;
    case '30d':
      interval = 12 * 60 * 60 * 1000; // 12 hours
      points = 60;
      break;
  }
  
  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * interval;
    
    // Add some patterns to make it look realistic
    const hourOfDay = new Date(timestamp).getHours();
    const dayOfWeek = new Date(timestamp).getDay();
    
    // Higher latency during business hours and weekdays
    let factor = 1.0;
    if (hourOfDay >= 9 && hourOfDay <= 17) factor += 0.2;
    if (dayOfWeek >= 1 && dayOfWeek <= 5) factor += 0.1;
    
    // Add some random spikes
    if (Math.random() < 0.05) factor += 0.5;
    
    const latency = baseLatency * factor + (Math.random() - 0.5) * 10;
    
    data.push({
      timestamp,
      latency: Math.round(latency),
      min: Math.round(latency * 0.9),
      max: Math.round(latency * 1.1),
      avg: Math.round(latency)
    });
  }
  
  return data;
}