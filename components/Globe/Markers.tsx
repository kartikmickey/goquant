// components/Globe/Markers.tsx

'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, Billboard } from '@react-three/drei';
import { useStore } from '@/store/useStore';
import { latLngToVector3, getProviderColor } from '@/lib/utils/coordinates';

interface MarkerProps {
  exchange: any;
  isSelected: boolean;
  isHovered: boolean;
}

function ExchangeMarker({ exchange, isSelected, isHovered }: MarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [localHover, setLocalHover] = useState(false);
  const setHoveredItem = useStore((state) => state.setHoveredItem);
  const setSelectedExchange = useStore((state) => state.setSelectedExchange);
  
  const position = latLngToVector3(exchange.lat, exchange.lng, 1.02);
  const color = getProviderColor(exchange.provider);
  const scale = isSelected ? 0.04 : isHovered || localHover ? 0.03 : 0.025;
  
  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = scale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      if (isSelected || isHovered || localHover) {
        meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      }
    }
  });
  
  return (
    <group position={position}>
      {/* Use a simple mesh instead of Sphere from drei */}
      <mesh
        ref={meshRef}
        scale={[scale, scale, scale]}
        onPointerOver={() => {
          setLocalHover(true);
          setHoveredItem({ type: 'exchange', id: exchange.id });
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setLocalHover(false);
          setHoveredItem(null);
          document.body.style.cursor = 'default';
        }}
        onClick={() => setSelectedExchange(exchange)}
      >
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected || isHovered || localHover ? 0.8 : 0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Always show exchange name for better visibility */}
      <Html
        position={[0, 0.05, 0]}
        center
        distanceFactor={8}
        occlude={false}
        style={{
          transition: 'opacity 0.3s',
          opacity: 1,
          pointerEvents: 'none'
        }}
      >
        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          <div className="font-semibold">{exchange.name}</div>
        </div>
      </Html>
    </group>
  );
}

export function Markers() {
  const exchanges = useStore((state) => state.exchanges);
  const filters = useStore((state) => state.filters);
  const searchQuery = useStore((state) => state.searchQuery);
  const selectedExchange = useStore((state) => state.selectedExchange);
  const hoveredItem = useStore((state) => state.hoveredItem);
  
  // Calculate filtered exchanges inline
  const filteredExchanges = useMemo(() => {
    return exchanges.filter(exchange => {
      if (!filters.providers.includes(exchange.provider)) return false;
      if (filters.exchanges.length > 0 && !filters.exchanges.includes(exchange.id)) return false;
      if (searchQuery && !exchange.name.toLowerCase().includes(searchQuery)) return false;
      return exchange.active;
    });
  }, [exchanges, filters, searchQuery]);
  
  // Debug log
  console.log('Rendering markers:', filteredExchanges.length);
  
  return (
    <group>
      {filteredExchanges.map((exchange) => (
        <ExchangeMarker
          key={exchange.id}
          exchange={exchange}
          isSelected={selectedExchange?.id === exchange.id}
          isHovered={hoveredItem?.type === 'exchange' && hoveredItem.id === exchange.id}
        />
      ))}
    </group>
  );
}