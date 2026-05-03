'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { ElectricParticles } from './ElectricParticles';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/lib/theme-store';

export function HeroScene() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center">
      {/* 3D Background Particles */}
      <div className="absolute inset-0">
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
            <ambientLight intensity={0.15} />
            <ElectricParticles />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating 2D Bike Image (High Quality) */}
      <motion.div
        className="relative w-full max-w-5xl px-4 pointer-events-none z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [-15, 15, -15],
          rotateZ: [-1, 1, -1]
        }}
        transition={{
          opacity: { duration: 1 },
          scale: { duration: 1 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotateZ: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Image
          src="/bike.png"
          alt="Premium Surron Electric Bike"
          width={1400}
          height={900}
          className="w-full h-auto object-contain transition-all duration-700"
          style={{
            mixBlendMode: isDark ? 'screen' : 'multiply',
            filter: isDark 
              ? 'invert(1) contrast(1.1) brightness(1.2)' 
              : 'contrast(1.05)',
            opacity: 0.95
          }}
          priority
        />
      </motion.div>
    </div>
  );
}
