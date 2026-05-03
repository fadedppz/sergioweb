'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { Suspense } from 'react';
import { ElectricBike } from './ElectricBike';
import { ElectricParticles } from './ElectricParticles';

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Ambient lighting — very minimal, cinematic */}
          <ambientLight intensity={0.15} />

          {/* Key light — cold, from top-right */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            color="#C0D8FF"
          />

          {/* Fill light — warm accent from left */}
          <pointLight
            position={[-6, 2, 3]}
            intensity={0.3}
            color="#FF6B35"
            distance={15}
          />

          {/* Rim light — cyan from behind */}
          <pointLight
            position={[0, -2, -5]}
            intensity={0.5}
            color="#00D4FF"
            distance={20}
          />

          {/* Electric Bike hero element */}
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <ElectricBike />
          </Float>

          {/* Subtle ambient particles */}
          <ElectricParticles />

          {/* Environment map for reflections */}
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
