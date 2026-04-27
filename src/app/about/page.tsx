'use client';

import { motion } from 'framer-motion';
import { Zap, Target, Users, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="vignette-glow" />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-medium">About</span>
          </div>
          <h1 className="text-4xl sm:text-6xl leading-tight mb-6">
            <span className="font-serif-italic gradient-text">Voltage</span>{' '}
            <span className="font-bold text-white">meets vision</span>
          </h1>
          <p className="text-base text-white/50 max-w-2xl leading-relaxed">
            We&apos;re electric motorcycle enthusiasts on a mission to make premium Surron bikes
            and performance parts accessible to every rider. Born from a garage, powered by voltage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
          {[
            { icon: Zap, num: 'I', title: 'Electric First', desc: 'The future of off-road is electric. Cleaner trails, quieter rides, instant torque.' },
            { icon: Target, num: 'II', title: 'Rider Focused', desc: 'Every product is tested by riders who use these bikes daily. No junk, no compromises.' },
            { icon: Users, num: 'III', title: 'Community', desc: 'Building a network of electric riders. Group rides, tech talks, and culture.' },
            { icon: TrendingUp, num: 'IV', title: 'Always Forward', desc: 'The electric space moves fast. We stay ahead with the latest parts and tech.' },
          ].map((item, idx) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
              <GlassCard className="p-8 h-full relative group">
                <span className="roman-index absolute top-6 right-6">{item.num}</span>
                <item.icon className="w-6 h-6 text-white/30 mb-6 group-hover:text-white/60 transition-colors duration-500" />
                <h3 className="text-base font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="glass-card-static p-14 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              <span className="font-serif-italic gradient-text">Ready</span> to ride?
            </h2>
            <p className="text-sm text-white/40 mb-8 max-w-md mx-auto">
              Browse the collection or reach out — we&apos;re here to help you go electric.
            </p>
            <Link href="/shop"><Button variant="primary" size="lg"><Zap className="w-4 h-4" /> Explore Collection</Button></Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
