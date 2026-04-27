'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div className="pt-16 min-h-screen">
      <div className="vignette-glow" />
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-medium">Contact</span>
          </div>
          <h1 className="text-4xl sm:text-5xl leading-tight mb-4">
            <span className="font-serif-italic gradient-text">Get</span>{' '}
            <span className="font-bold text-white">in touch</span>
          </h1>
          <p className="text-sm text-white/40 max-w-md mb-14">
            Questions about Surron bikes or parts? Need help with an order? We&apos;re here.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="glass-card-static p-14 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400/60 mx-auto mb-6" />
              <h2 className="text-xl font-bold text-white mb-3">Message Sent</h2>
              <p className="text-sm text-white/40">We&apos;ll respond within 24 hours.</p>
            </div>
          </motion.div>
        ) : (
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass-card-static p-8 sm:p-10 space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-2 block">Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Your name" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-2 block">Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-2 block">Message</label>
                <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-colors resize-none"
                  placeholder="How can we help?" />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full">
                <Send className="w-4 h-4" /> Send Message
              </Button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
}
