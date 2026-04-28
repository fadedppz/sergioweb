'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const inputStyles: React.CSSProperties = {
    backgroundColor: 'var(--v-input-bg)',
    border: '1px solid var(--v-border)',
    color: 'var(--v-text)',
  };

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-28 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-muted)' }}>Contact</span>
          </div>
          <h1 className="text-4xl sm:text-5xl leading-tight mb-4">
            <span className="font-serif-italic gradient-text">Get</span>{' '}
            <span className="font-bold" style={{ color: 'var(--v-text)' }}>in touch</span>
          </h1>
          <p className="text-sm max-w-md mb-10 sm:mb-14" style={{ color: 'var(--v-text-muted)' }}>
            Questions about Surron bikes or parts? Need help with an order? We&apos;re here.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="rounded-2xl p-10 sm:p-14 text-center" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
              <CheckCircle className="w-12 h-12 text-emerald-400/60 mx-auto mb-6" />
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--v-text)' }}>Message Sent</h2>
              <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>We&apos;ll respond within 24 hours.</p>
            </div>
          </motion.div>
        ) : (
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="rounded-2xl p-6 sm:p-10 space-y-5 sm:space-y-6" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl text-sm focus:outline-none transition-colors"
                  style={inputStyles}
                  placeholder="Your name" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl text-sm focus:outline-none transition-colors"
                  style={inputStyles}
                  placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Message</label>
                <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl text-sm focus:outline-none transition-colors resize-none"
                  style={inputStyles}
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
