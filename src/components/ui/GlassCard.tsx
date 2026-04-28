'use client';

import { ReactNode, useRef, useState, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for mouse position relative to card (0 to 1)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  // Smooth spring physics for the tilt
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Map 0-1 range to degrees for rotation (-15 to 15 degrees max tilt)
  const rotateX = useTransform(springY, [0, 1], [15, -15]);
  const rotateY = useTransform(springX, [0, 1], [-15, 15]);

  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!hover || !cardRef.current) return;

    // Check if touch device to disable on mobile
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = cardRef.current.getBoundingClientRect();
    
    // Relative position 0 to 1
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    x.set(relX);
    y.set(relY);

    setGlare({
      x: relX * 100,
      y: relY * 100,
      opacity: 0.15
    });
  };

  const handleMouseLeave = () => {
    if (!hover) return;
    x.set(0.5);
    y.set(0.5);
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  const handleMouseEnter = () => {
    if (!hover) return;
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    setGlare(prev => ({ ...prev, opacity: 0.15 }));
  };

  const baseClassName = hover ? 'glass-card' : 'glass-card-static';

  if (!hover) {
    return (
      <div className={`${baseClassName} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      className={`${baseClassName} ${className} relative overflow-hidden`}
    >
      {/* Dynamic Glare Overlay */}
      <motion.div
        animate={{ opacity: glare.opacity }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute inset-0 z-[50] hidden sm:block mix-blend-overlay"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.6) 0%, transparent 50%)`,
        }}
      />
      
      {/* Wrapper to lift children slightly for a deeper 3D effect */}
      <div className="relative z-10 w-full h-full" style={{ transform: 'translateZ(10px)' }}>
        {children}
      </div>
    </motion.div>
  );
}
