'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ChromeSphere — Aixor-inspired reflective sphere with chromatic dispersion.
 * Large, centered, with rainbow light streaks.
 */
export function ChromeSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!sphereRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle floating
    sphereRef.current.position.y = Math.sin(t * 0.4) * 0.15;
    sphereRef.current.rotation.y = t * 0.08;
    sphereRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;

    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.15;
      innerRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group position={[1.5, 0, 0]} scale={2.8}>
      {/* Main sphere — dark reflective glass */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshPhysicalMaterial
          color="#050505"
          metalness={0.95}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.02}
          reflectivity={1}
          envMapIntensity={2.5}
          transparent
          opacity={0.95}
          ior={2.5}
          thickness={1}
        />
      </mesh>

      {/* Inner light ring — chromatic dispersion effect */}
      <mesh ref={innerRef} position={[0, 0, 0]}>
        <torusGeometry args={[0.7, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.6} />
      </mesh>

      {/* Secondary chromatic ring */}
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <torusGeometry args={[0.65, 0.015, 16, 100]} />
        <meshBasicMaterial color="#7B2FFF" transparent opacity={0.3} />
      </mesh>

      {/* Warm accent ring */}
      <mesh rotation={[Math.PI / 6, Math.PI / 4, 0]}>
        <torusGeometry args={[0.75, 0.01, 16, 100]} />
        <meshBasicMaterial color="#FF6B35" transparent opacity={0.2} />
      </mesh>

      {/* Highlight rim — white specular catch */}
      <mesh>
        <sphereGeometry args={[1.005, 64, 64]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.03}
          wireframe
        />
      </mesh>
    </group>
  );
}
