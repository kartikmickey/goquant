
// components/Globe/Connections.tsx

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { latLngToVector3, createCurve, getLatencyColor } from '@/lib/utils/coordinates';

interface ConnectionProps {
  connection: any;
  fromExchange: any;
  toExchange: any;
}

function LatencyConnection({ connection, fromExchange, toExchange }: ConnectionProps) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const setSelectedConnection = useStore((state) => state.setSelectedConnection);
  const selectedConnection = useStore((state) => state.selectedConnection);
  
  const isSelected = selectedConnection?.from === connection.from && 
                    selectedConnection?.to === connection.to;
  
  const curve = useMemo(() => {
    const start = latLngToVector3(fromExchange.lat, fromExchange.lng, 1.01);
    const end = latLngToVector3(toExchange.lat, toExchange.lng, 1.01);
    return createCurve(start, end, 0.2);
  }, [fromExchange, toExchange]);
  
  const color = getLatencyColor(connection.latency);
  
  useFrame((state) => {
    if (materialRef.current) {
      // Animated pulse effect
      const pulse = Math.sin(state.clock.elapsedTime * 2 - connection.latency * 0.01) * 0.5 + 0.5;
      materialRef.current.opacity = isSelected ? 0.8 : 0.3 + pulse * 0.3;
    }
  });
  
  return (
    <mesh 
      ref={meshRef}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'default'}
      onClick={() => setSelectedConnection({ from: connection.from, to: connection.to })}
    >
      <tubeGeometry args={[curve, 32, isSelected ? 0.004 : 0.002, 8, false]} />
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function Connections() {
  const latencyData = useStore((state) => state.latencyData);
  const exchanges = useStore((state) => state.exchanges);
  const filters = useStore((state) => state.filters);
  const searchQuery = useStore((state) => state.searchQuery);
  
  const exchangeMap = useMemo(() => {
    const map = new Map();
    exchanges.forEach(ex => map.set(ex.id, ex));
    return map;
  }, [exchanges]);
  
  // Calculate active connections inline
  const activeConnections = useMemo(() => {
    if (!filters.showConnections) return [];
    
    const filteredExchangeIds = exchanges
      .filter(exchange => {
        if (!filters.providers.includes(exchange.provider)) return false;
        if (filters.exchanges.length > 0 && !filters.exchanges.includes(exchange.id)) return false;
        if (searchQuery && !exchange.name.toLowerCase().includes(searchQuery)) return false;
        return exchange.active;
      })
      .map(e => e.id);
    
    return latencyData.filter(connection => {
      const fromVisible = filteredExchangeIds.includes(connection.from);
      const toVisible = filteredExchangeIds.includes(connection.to);
      
      if (!fromVisible || !toVisible) return false;
      
      return connection.latency >= filters.latencyRange[0] && 
             connection.latency <= filters.latencyRange[1];
    });
  }, [latencyData, exchanges, filters, searchQuery]);
  
  return (
    <group>
      {activeConnections.map((connection, index) => {
        const fromExchange = exchangeMap.get(connection.from);
        const toExchange = exchangeMap.get(connection.to);
        
        if (!fromExchange || !toExchange) return null;
        
        return (
          <LatencyConnection
            key={`${connection.from}-${connection.to}-${index}`}
            connection={connection}
            fromExchange={fromExchange}
            toExchange={toExchange}
          />
        );
      })}
    </group>
  );
}
