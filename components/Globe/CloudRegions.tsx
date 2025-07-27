
// components/Globe/CloudRegions.tsx

'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useStore } from '@/store/useStore';
import { latLngToVector3, getProviderColor } from '@/lib/utils/coordinates';

interface RegionProps {
  region: any;
  isHovered: boolean;
}

function CloudRegionMarker({ region, isHovered }: RegionProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = latLngToVector3(region.lat, region.lng, 1.01);
  const color = getProviderColor(region.provider);
  
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <ringGeometry args={[0.02, 0.025, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isHovered ? 0.8 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {isHovered && (
        <Text
          position={[0, 0.04, 0]}
          fontSize={0.03}
          color={color}
          anchorX="center"
          anchorY="bottom"
        >
          {region.code}
        </Text>
      )}
    </group>
  );
}

export function CloudRegions() {
  const cloudRegions = useStore((state) => state.cloudRegions);
  const filters = useStore((state) => state.filters);
  const hoveredItem = useStore((state) => state.hoveredItem);
  
  // Calculate filtered regions inline
  const filteredRegions = useMemo(() => {
    if (!filters.showRegions) return [];
    return cloudRegions.filter(region => filters.providers.includes(region.provider));
  }, [cloudRegions, filters]);
  
  return (
    <group>
      {filteredRegions.map((region) => (
        <CloudRegionMarker
          key={region.id}
          region={region}
          isHovered={hoveredItem?.type === 'region' && hoveredItem.id === region.id}
        />
      ))}
    </group>
  );
}