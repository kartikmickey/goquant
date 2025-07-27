// components/Globe/Globe.tsx

'use client';

import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { Markers } from './Markers';
import { Connections } from './Connections';
import { CloudRegions } from './CloudRegions';

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const theme = useStore((state) => state.filters.theme);
  
  // Create a procedural Earth-like texture as fallback
  const createEarthMaterial = () => {
    return new THREE.MeshPhongMaterial({
      color: theme === 'dark' ? '#1a365d' : '#2563eb',
      emissive: theme === 'dark' ? '#1e3a8a' : '#3b82f6',
      emissiveIntensity: 0.1,
      shininess: 10,
      specular: '#ffffff',
      wireframe: false,
    });
  };
  
  return (
    <>
      {/* Main Earth sphere */}
      <mesh ref={meshRef} rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={createEarthMaterial()} />
      </mesh>
      
      {/* Grid overlay for better visualization */}
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[1.001, 32, 32]} />
        <meshBasicMaterial 
          color={theme === 'dark' ? '#4a5568' : '#cbd5e1'} 
          wireframe 
          transparent 
          opacity={0.1} 
        />
      </mesh>
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={0.3} />
    </>
  );
}

export function Globe() {
  const theme = useStore((state) => state.filters.theme);
  
  return (
    <div className="relative w-full h-full">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: theme === 'dark' ? '#030712' : '#f3f4f6', height: "700px" }}
        shadows
      >
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={50} />
        
        <Suspense fallback={null}>
          <Lights />
          <Earth />
          <Markers />
          <Connections />
          <CloudRegions />
          
          {/* Add stars for space effect */}
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1}
          />
        </Suspense>
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.5}
          rotateSpeed={0.5}
          minDistance={1.5}
          maxDistance={5}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Add loading indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
}
