'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/lib/theme-store';

export function ElectricBike() {
  const bikeRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Mesh>(null);
  const backWheelRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  // Colors based on theme
  const frameColor = isDark ? '#1a1a1a' : '#e0e0e0';
  const tireColor = isDark ? '#050505' : '#222222';
  const accentColor = isDark ? '#00D4FF' : '#FF6B35'; // Cyan in dark, Orange in light
  const metalColor = isDark ? '#333333' : '#a0a0a0';

  useFrame((state) => {
    if (!bikeRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle floating and tilting
    bikeRef.current.position.y = Math.sin(t * 0.4) * 0.15 - 0.5;
    bikeRef.current.rotation.y = t * 0.2; // Slowly rotate the bike to show it off
    bikeRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;

    // Spin wheels
    if (frontWheelRef.current && backWheelRef.current) {
      frontWheelRef.current.rotation.x = t * 2;
      backWheelRef.current.rotation.x = t * 2;
    }
  });

  return (
    <group ref={bikeRef} position={[1.5, -0.5, 0]} scale={0.8}>
      
      {/* Front Wheel */}
      <mesh ref={frontWheelRef} position={[1.2, 0.4, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.4, 0.08, 16, 64]} />
        <meshPhysicalMaterial color={tireColor} roughness={0.8} />
      </mesh>
      {/* Front Wheel Hub/Spokes */}
      <mesh position={[1.2, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Back Wheel */}
      <mesh ref={backWheelRef} position={[-1.2, 0.4, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.4, 0.08, 16, 64]} />
        <meshPhysicalMaterial color={tireColor} roughness={0.8} />
      </mesh>
      {/* Back Wheel Hub/Motor */}
      <mesh position={[-1.2, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 32]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
      </mesh>

      {/* Main Frame (Battery Box) */}
      <mesh position={[0, 0.7, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[1.2, 0.3, 0.25]} />
        <meshPhysicalMaterial color={frameColor} metalness={0.6} roughness={0.2} clearcoat={1} />
      </mesh>
      
      {/* Frame Accent Strip */}
      <mesh position={[0, 0.7, 0.13]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[1.0, 0.05, 0.02]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      <mesh position={[0, 0.7, -0.13]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[1.0, 0.05, 0.02]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Seat */}
      <mesh position={[-0.3, 1.1, 0]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.8, 0.1, 0.2]} />
        <meshStandardMaterial color={tireColor} roughness={0.9} />
      </mesh>

      {/* Seat Post */}
      <mesh position={[-0.5, 0.85, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
        <meshStandardMaterial color={metalColor} metalness={0.9} />
      </mesh>

      {/* Front Forks */}
      <mesh position={[1.0, 0.9, 0.08]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[1.0, 0.9, -0.08]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Handlebars */}
      <mesh position={[0.85, 1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 16]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Headlight */}
      <mesh position={[1.15, 1.1, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.15, 0.2, 0.15]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={isDark ? 2 : 0.5} />
      </mesh>

      {/* Swingarm */}
      <mesh position={[-0.6, 0.5, 0.1]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[1.0, 0.05, 0.05]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} />
      </mesh>
      <mesh position={[-0.6, 0.5, -0.1]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[1.0, 0.05, 0.05]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} />
      </mesh>

    </group>
  );
}
