'use client';

import { motion } from 'framer-motion';
import { Zap, Target, Users, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-28 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-muted)' }}>About</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            <span className="font-serif-italic gradient-text">Voltage</span>{' '}
            <span className="font-bold" style={{ color: 'var(--v-text)' }}>meets vision</span>
          </h1>
          <p className="text-sm sm:text-base max-w-2xl leading-relaxed" style={{ color: 'var(--v-text-secondary)' }}>
            We&apos;re electric motorcycle enthusiasts on a mission to make premium Surron bikes
            and performance parts accessible to every rider. Born from a garage, powered by voltage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {[
            { icon: Zap, num: 'I', title: 'Electric First', desc: 'The future of off-road is electric. Cleaner trails, quieter rides, instant torque.' },
            { icon: Target, num: 'II', title: 'Rider Focused', desc: 'Every product is tested by riders who use these bikes daily. No junk, no compromises.' },
            { icon: Users, num: 'III', title: 'Community', desc: 'Building a network of electric riders. Group rides, tech talks, and culture.' },
            { icon: TrendingUp, num: 'IV', title: 'Always Forward', desc: 'The electric space moves fast. We stay ahead with the latest parts and tech.' },
          ].map((item, idx) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
              <GlassCard className="p-6 sm:p-8 h-full relative group">
                <span className="roman-index absolute top-6 right-6">{item.num}</span>
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-5 sm:mb-6 transition-colors duration-500" style={{ color: 'var(--v-text-muted)' }} />
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3" style={{ color: 'var(--v-text)' }}>{item.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--v-text-secondary)' }}>{item.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="rounded-2xl p-10 sm:p-14 text-center" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              <span className="font-serif-italic gradient-text">Ready</span>{' '}
              <span style={{ color: 'var(--v-text)' }}>to ride?</span>
            </h2>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'var(--v-text-muted)' }}>
              Browse the collection or reach out — we&apos;re here to help you go electric.
            </p>
            <Link href="/shop"><Button variant="primary" size="lg"><Zap className="w-4 h-4" /> Explore Collection</Button></Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
