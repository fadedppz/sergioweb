'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Are Surron bikes street legal?', a: 'It depends on the model and your state. The Light Bee S comes street-legal ready with DOT lighting, mirrors, and turn signals. The LBX and Storm Bee are off-road vehicles but can be registered in some states with aftermarket kits.' },
  { q: 'How long does the battery last?', a: 'Light Bee X: 40-60 miles. Ultra Bee: 50-75 miles. Storm Bee: 60-80 miles per charge. Range depends on terrain, rider weight, speed, and riding style.' },
  { q: 'How long does it take to charge?', a: '3-4 hours with the standard charger. Our 10A fast charger cuts that in half. Any standard 110V/220V outlet works.' },
  { q: 'Do you offer financing?', a: "We're working on financing via Affirm and Klarna. We accept all major cards through Stripe. Contact us for custom arrangements on bikes over $5,000." },
  { q: 'What warranty do products come with?', a: 'Surron bikes: 1-year on frame/motor, 6 months on battery. Aftermarket parts: 1-year Eclipse Electric warranty. Extended warranty available.' },
  { q: 'How does shipping work?', a: 'Bikes ship assembled via freight (free). Parts ship via USPS/UPS with free shipping over $500. Standard delivery: 3-7 business days.' },
  { q: 'Can I return a product?', a: '30-day returns on unused parts/accessories. 14-day returns on unridden bikes in original packaging. Return shipping is buyer responsibility unless defective.' },
  { q: 'Do you ship internationally?', a: 'Currently US only (contiguous 48 states). International shipping coming soon — join our newsletter for updates.' },
  { q: 'What maintenance does an electric bike need?', a: 'Tire pressure, brake pads, chain tension, bolt torques. No oil changes, air filters, or spark plugs. Full inspection every 1,000 miles.' },
  { q: 'Can I upgrade my Surron?', a: 'Yes — batteries, controllers, suspension, lighting, and more. Most upgrades are plug-and-play with basic tools.' },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      style={{ borderBottom: '1px solid var(--v-border)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 sm:py-6 text-left group">
        <span className="text-sm font-medium pr-4 transition-colors" style={{ color: 'var(--v-text-secondary)' }}>{faq.q}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--v-text-dim)' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <p className="text-sm leading-relaxed pb-6" style={{ color: 'var(--v-text-muted)' }}>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-28 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-muted)' }}>FAQ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl leading-tight mb-4">
            <span className="font-serif-italic gradient-text">Common</span>{' '}
            <span className="font-bold" style={{ color: 'var(--v-text)' }}>questions</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Everything about Eclipse Electric and Surron electric motorcycles.</p>
        </motion.div>
        <div>{faqs.map((faq, idx) => <FAQItem key={idx} faq={faq} index={idx} />)}</div>
      </div>
    </div>
  );
}
