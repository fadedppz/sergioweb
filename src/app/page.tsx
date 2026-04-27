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
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <div className="relative">
      {/* Cinematic vignette glow */}
      <div className="vignette-glow" />

      {/* ═══════════════════════════════════
          HERO — Aixor-style full-screen
          ═══════════════════════════════════ */}
      <section className="relative h-screen min-h-[800px] flex items-end overflow-hidden pb-16">
        {/* Three.js Chrome Sphere */}
        <HeroScene />

        {/* Hero Content — Bottom-left aligned like Aixor */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            {/* Left: Headline */}
            <div>
              {/* Floating quote — Aixor style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-12 max-w-sm"
              >
                <p className="text-sm text-[#999999] leading-relaxed">
                  &ldquo; At VANDAL, we believe the future of off-road is electric.
                  Premium Surron motorcycles and parts, delivered with obsessive attention to detail. &rdquo;
                </p>
                <p className="text-xs text-white/40 mt-3 font-medium tracking-wider uppercase">
                  VANDAL Moto
                </p>
              </motion.div>

              {/* Big serif italic headline */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-tight"
              >
                <span className="font-serif-italic gradient-text">Voltage</span>
                <br />
                <span className="font-bold text-white">Meets Vision</span>
              </motion.h1>
            </div>

            {/* Right: CTAs — Pill buttons at bottom-right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col items-start lg:items-end gap-4"
            >
              <Link href="/shop">
                <Button variant="primary" size="lg">
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-5 h-8 rounded-full border border-white/10 flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 rounded-full bg-white/30"
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════
          MARQUEE STRIP — Scrolling text
          ═══════════════════════════════════ */}
      <section className="py-8 border-y border-white/[0.04] overflow-hidden">
        <div className="marquee-track whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-12 mx-6">
              <span className="text-sm uppercase tracking-[0.3em] text-white/20 font-medium">Surron Light Bee X</span>
              <span className="text-white/10">◆</span>
              <span className="text-sm uppercase tracking-[0.3em] text-white/20 font-medium">Storm Bee</span>
              <span className="text-white/10">◆</span>
              <span className="text-sm uppercase tracking-[0.3em] text-white/20 font-medium">Ultra Bee</span>
              <span className="text-white/10">◆</span>
              <span className="text-sm uppercase tracking-[0.3em] text-white/20 font-medium">Performance Parts</span>
              <span className="text-white/10">◆</span>
              <span className="text-sm uppercase tracking-[0.3em] text-white/20 font-medium">Electric Revolution</span>
              <span className="text-white/10">◆</span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          FEATURED — Product showcase
          ═══════════════════════════════════ */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section header — Aixor side-label style */}
          <div className="flex items-start gap-8 mb-16">
            <div className="hidden sm:flex items-center gap-3 pt-2">
              <div className="w-8 h-px bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-medium">Featured</span>
            </div>
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl leading-tight"
              >
                <span className="font-serif-italic gradient-text">Curated</span>{' '}
                <span className="font-bold text-white">selections</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-sm text-[#999999] mt-4 max-w-md"
              >
                Hand-picked electric motorcycles and performance parts from our catalog.
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-16"
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
          WHY ELECTRIC — Benefits with roman nums
          ═══════════════════════════════════ */}
      <section className="py-32 relative">
        <div className="section-divider-glow absolute top-0 left-0 right-0" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-start gap-8 mb-16">
            <div className="hidden sm:flex items-center gap-3 pt-2">
              <div className="w-8 h-px bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-medium">Why Electric</span>
            </div>
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl leading-tight"
              >
                <span className="font-serif-italic gradient-text">The</span>{' '}
                <span className="font-bold text-white">advantage</span>
              </motion.h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, idx) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-8 h-full relative group">
                  {/* Roman numeral index */}
                  <span className="roman-index absolute top-6 right-6">{b.num}</span>
                  <b.icon className="w-6 h-6 text-white/40 mb-6 group-hover:text-[#00D4FF] transition-colors duration-500" />
                  <h3 className="text-base font-semibold text-white mb-3">{b.title}</h3>
                  <p className="text-sm text-[#999999] leading-relaxed">{b.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          STATS BAR
          ═══════════════════════════════════ */}
      <section className="py-20 relative">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
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
                <p className="text-3xl sm:text-4xl font-mono font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-white/30 uppercase tracking-[0.15em] mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA — Final call
          ═══════════════════════════════════ */}
      <section className="py-32 relative">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-6xl leading-tight mb-6">
              <span className="font-serif-italic gradient-text">Ready</span>{' '}
              <span className="font-bold text-white">to ride electric?</span>
            </h2>
            <p className="text-[#999999] max-w-lg mx-auto mb-10">
              Browse the full collection. Free shipping on orders over $500.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop">
                <Button variant="primary" size="lg">
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
