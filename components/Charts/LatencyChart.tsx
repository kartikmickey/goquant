// components/Charts/LatencyChart.tsx

'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { format } from 'date-fns';
import { useStore } from '@/store/useStore';
import { getLatencyColor } from '@/lib/utils/coordinates';

interface LatencyChartProps {
  connectionKey: string;
  data: any[];
}

export function LatencyChart({ connectionKey, data }: LatencyChartProps) {
  const theme = useStore((state) => state.filters.theme);
  const timeRange = useStore((state) => state.timeRange);
  
  const formattedData = useMemo(() => {
    return data.map(point => ({
      ...point,
      time: format(new Date(point.timestamp), 
        timeRange === '1h' ? 'HH:mm' :
        timeRange === '24h' ? 'HH:mm' :
        timeRange === '7d' ? 'MMM dd' :
        'MMM dd'
      )
    }));
  }, [data, timeRange]);
  
  const avgLatency = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.round(data.reduce((sum, point) => sum + point.latency, 0) / data.length);
  }, [data]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Latency: <span style={{ color: getLatencyColor(payload[0].value) }}>
              {payload[0].value}ms
            </span>
          </p>
          {payload[1] && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Min: {payload[1].value}ms | Max: {payload[2]?.value}ms
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Historical Latency
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Average: {avgLatency}ms | Connection: {connectionKey}
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
          />
          <XAxis 
            dataKey="time" 
            stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            fontSize={12}
          />
          <YAxis 
            stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            label={{ 
              value: 'Latency (ms)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="min"
            stroke="none"
            fill="none"
          />
          <Area
            type="monotone"
            dataKey="max"
            stroke="none"
            fill="none"
          />
          <Area
            type="monotone"
            dataKey="latency"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorLatency)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#10b981"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
