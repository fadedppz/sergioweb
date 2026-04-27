'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

export function MotorcyclePlaceholder() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    // Slow auto-rotation
    groupRef.current.rotation.y = time * 0.15;
    // Gentle float
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.1 - 0.5;
  });

  const bodyMaterial = (
    <meshStandardMaterial
      color="#111111"
      metalness={0.9}
      roughness={0.2}
      transparent
      opacity={0.85}
    />
  );

  const glowMaterial = (
    <meshStandardMaterial
      color="#00D4FF"
      emissive="#00D4FF"
      emissiveIntensity={0.5}
      metalness={0.8}
      roughness={0.3}
    />
  );

  return (
    <group ref={groupRef} scale={1.2}>
      {/* Main body / frame */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI * 0.05]}>
        <boxGeometry args={[2.2, 0.35, 0.6]} />
        {bodyMaterial}
        <Edges threshold={15} color="#00D4FF" linewidth={1} />
      </mesh>

      {/* Seat */}
      <mesh position={[-0.4, 0.55, 0]}>
        <boxGeometry args={[1.0, 0.2, 0.5]} />
        {bodyMaterial}
        <Edges threshold={15} color="#00D4FF" linewidth={1} />
      </mesh>

      {/* Tank */}
      <mesh position={[0.3, 0.5, 0]}>
        <boxGeometry args={[0.7, 0.35, 0.55]} />
        {bodyMaterial}
        <Edges threshold={15} color="#7B2FFF" linewidth={1} />
      </mesh>

      {/* Front fork */}
      <mesh position={[1.15, -0.1, 0]} rotation={[0, 0, -Math.PI * 0.15]}>
        <cylinderGeometry args={[0.04, 0.04, 1.3, 8]} />
        {glowMaterial}
      </mesh>

      {/* Rear swingarm */}
      <mesh position={[-0.8, -0.15, 0]} rotation={[0, 0, Math.PI * 0.1]}>
        <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
        {glowMaterial}
      </mesh>

      {/* Front wheel */}
      <mesh position={[1.3, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.08, 8, 24]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.3} />
        <Edges threshold={15} color="#00D4FF" linewidth={1} />
      </mesh>

      {/* Rear wheel */}
      <mesh position={[-1.1, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.08, 8, 24]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.3} />
        <Edges threshold={15} color="#00D4FF" linewidth={1} />
      </mesh>

      {/* Headlight glow */}
      <mesh position={[1.35, 0.3, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Engine/battery block */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#0A0A0A"
          metalness={0.95}
          roughness={0.1}
        />
        <Edges threshold={15} color="#7B2FFF" linewidth={1} />
      </mesh>

      {/* Handlebar */}
      <mesh position={[0.9, 0.65, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
        {glowMaterial}
      </mesh>
    </group>
  );
}
