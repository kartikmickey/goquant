// lib/types.ts

export interface Exchange {
  id: string;
  name: string;
  lat: number;
  lng: number;
  provider: "AWS" | "GCP" | "Azure";
  region: string;
  active: boolean;
}

export interface CloudRegion {
  id: string;
  provider: "AWS" | "GCP" | "Azure";
  name: string;
  code: string;
  lat: number;
  lng: number;
  serverCount: number;
}

export interface LatencyData {
  from: string;
  to: string;
  latency: number;
  timestamp: number;
  jitter?: number;
  packetLoss?: number;
}

export interface HistoricalLatency {
  timestamp: number;
  latency: number;
  min: number;
  max: number;
  avg: number;
}

export type TimeRange = "1h" | "24h" | "7d" | "30d";

export interface Filters {
  exchanges: string[];
  providers: ("AWS" | "GCP" | "Azure")[];
  latencyRange: [number, number];
  showRegions: boolean;
  showConnections: boolean;
  theme: "light" | "dark";
}
