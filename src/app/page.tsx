'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Zap, Shield, Battery, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProductCard } from '@/components/shop/ProductCard';
import { getFeaturedProducts } from '@/data/products';

const HeroScene = dynamic(
  () => import('@/components/three/HeroScene').then(mod => ({ default: mod.HeroScene })),
  { ssr: false }
);

const benefits = [
  { icon: Zap, num: 'I', title: 'Instant Torque', desc: 'Electric motors deliver 100% torque from zero RPM. No clutch, no gears — just explosive acceleration.' },
  { icon: Shield, num: 'II', title: 'Zero Emissions', desc: 'Ride guilt-free. Charge from any outlet for pennies per mile.' },
  { icon: Battery, num: 'III', title: 'All-Day Range', desc: 'Advanced lithium packs deliver 40–80 miles per charge depending on model.' },
  { icon: Wrench, num: 'IV', title: 'Low Maintenance', desc: 'No oil changes, no spark plugs, no filters. Electric drivetrains are simple.' },
];

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 3);

  return (
    <div className="relative">
      {/* Cinematic vignette glow */}
      <div className="vignette-glow" />

      {/* ═══════════════════════════════════
          HERO — Aixor-style full-screen
          ═══════════════════════════════════ */}
      <section className="relative h-screen min-h-[600px] sm:min-h-[800px] flex items-end overflow-hidden pb-12 sm:pb-16">
        {/* Three.js Chrome Sphere */}
        <HeroScene />

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-end">
            {/* Left: Headline */}
            <div>
              {/* Floating quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-8 sm:mb-12 max-w-sm"
              >
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--v-text-secondary)' }}>
                  &ldquo; At Eclipse Electric, we believe the future of off-road is electric.
                  Premium Surron motorcycles and parts, delivered with obsessive attention to detail. &rdquo;
                </p>
                <p className="text-xs mt-3 font-medium tracking-wider uppercase" style={{ color: 'var(--v-text-muted)' }}>
                  Eclipse Electric
                </p>
              </motion.div>

              {/* Big serif italic headline */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] tracking-tight"
              >
                <span className="font-serif-italic gradient-text">Voltage</span>
                <br />
                <span className="font-bold" style={{ color: 'var(--v-text)' }}>Meets Vision</span>
              </motion.h1>
            </div>

            {/* Right: CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col items-start lg:items-end gap-3 sm:gap-4"
            >
              <Link href="/shop">
                <Button variant="glassy" size="lg">
                  Explore Collection
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/build">
                <Button variant="outline" size="lg">
                  Build Yours
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
        >
          <div className="w-5 h-8 rounded-full flex justify-center pt-1.5" style={{ border: '1px solid var(--v-border-hover)' }}>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: 'var(--v-text-muted)' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════
          MARQUEE STRIP
          ═══════════════════════════════════ */}
      <section className="py-6 sm:py-8 overflow-hidden" style={{ borderTop: '1px solid var(--v-border)', borderBottom: '1px solid var(--v-border)' }}>
        <div className="marquee-track whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 sm:gap-12 mx-4 sm:mx-6">
              <span className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-dim)' }}>Surron Light Bee X</span>
              <span style={{ color: 'var(--v-border-hover)' }}>◆</span>
              <span className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-dim)' }}>Storm Bee</span>
              <span style={{ color: 'var(--v-border-hover)' }}>◆</span>
              <span className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-dim)' }}>Ultra Bee</span>
              <span style={{ color: 'var(--v-border-hover)' }}>◆</span>
              <span className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-dim)' }}>Performance Parts</span>
              <span style={{ color: 'var(--v-border-hover)' }}>◆</span>
              <span className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-dim)' }}>Electric Revolution</span>
              <span style={{ color: 'var(--v-border-hover)' }}>◆</span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          FEATURED — Product showcase
          ═══════════════════════════════════ */}
      <section className="py-20 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section header */}
          <div className="flex items-start gap-8 mb-12 sm:mb-16">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl leading-tight"
              >
                <span className="font-serif-italic gradient-text">Curated</span>{' '}
                <span className="font-bold" style={{ color: 'var(--v-text)' }}>selections</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-sm mt-4 max-w-md"
                style={{ color: 'var(--v-text-secondary)' }}
              >
                Hand-picked electric motorcycles and performance parts from our catalog.
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {featured.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-12 sm:mt-16"
          >
            <Link href="/shop">
              <Button variant="outline" size="lg">
                View Full Catalog
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          WHY ELECTRIC — Benefits
          ═══════════════════════════════════ */}
      <section className="py-20 sm:py-32 relative">
        <div className="section-divider-glow absolute top-0 left-0 right-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-start gap-8 mb-12 sm:mb-16">
            <div className="hidden sm:flex items-center gap-3 pt-2">
              <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-muted)' }}>Why Electric</span>
            </div>
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl leading-tight"
              >
                <span className="font-serif-italic gradient-text">The</span>{' '}
                <span className="font-bold" style={{ color: 'var(--v-text)' }}>advantage</span>
              </motion.h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {benefits.map((b, idx) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-6 sm:p-8 h-full relative group">
                  <span className="roman-index absolute top-6 right-6">{b.num}</span>
                  <b.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-5 sm:mb-6 transition-colors duration-500" style={{ color: 'var(--v-text-muted)' }} />
                  <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3" style={{ color: 'var(--v-text)' }}>{b.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--v-text-secondary)' }}>{b.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          STATS BAR
          ═══════════════════════════════════ */}
      <section className="py-16 sm:py-20 relative">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: '75+', label: 'MPH Top Speed' },
              { value: '80mi', label: 'Max Range' },
              { value: '0g', label: 'CO₂ Emissions' },
              { value: '17+', label: 'Products' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="text-center sm:text-left"
              >
                <p className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold gradient-text">{stat.value}</p>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] mt-2" style={{ color: 'var(--v-text-muted)' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA
          ═══════════════════════════════════ */}
      <section className="py-20 sm:py-32 relative">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-6xl leading-tight mb-6">
              <span className="font-serif-italic gradient-text">Ready</span>{' '}
              <span className="font-bold" style={{ color: 'var(--v-text)' }}>to ride electric?</span>
            </h2>
            <p className="max-w-lg mx-auto mb-8 sm:mb-10 text-sm" style={{ color: 'var(--v-text-secondary)' }}>
              Browse the full collection. Free shipping on orders over $500.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link href="/shop">
                <Button variant="glassy" size="lg">
                  Shop Now
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Talk to Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
