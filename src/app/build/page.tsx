'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Settings, PaintBucket, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BuildYoursPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);
      toast.success(data.message || 'Successfully joined the waitlist!');
      setEmail('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to join the waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-24 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.05em] uppercase mb-6" style={{ color: 'var(--v-text)' }}>
              Design Your <span style={{ color: '#00D4FF' }}>Ultimate Ride</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: 'var(--v-text-secondary)' }}>
              The "Build Yours" customizer is currently in development. Soon, you will be able to configure every detail of your electric motorcycle from the ground up.
            </p>
          </motion.div>

          {/* Waitlist Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md mx-auto p-1 rounded-2xl relative"
            style={{ background: 'linear-gradient(45deg, var(--v-border), rgba(0,212,255,0.3))' }}
          >
            <div className="rounded-xl p-8" style={{ backgroundColor: 'var(--v-bg-surface)' }}>
              {submitted ? (
                <div className="flex flex-col items-center text-center py-4">
                  <CheckCircle2 className="w-12 h-12 mb-4 text-emerald-400" />
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--v-text)' }}>You're on the list!</h3>
                  <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>We'll notify you as soon as the customizer goes live.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-center tracking-wider uppercase mb-2" style={{ color: 'var(--v-text)' }}>Join the Waitlist</h3>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                    style={{ backgroundColor: 'var(--v-bg-card)', color: 'var(--v-text)', border: '1px solid var(--v-border)' }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                    style={{ backgroundColor: '#00D4FF', color: '#000' }}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Notify Me'}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: Zap, title: "Powertrain Configurator", desc: "Select from standard, long-range, or high-performance battery and motor combinations to suit your riding style." },
            { icon: Settings, title: "Suspension & Tires", desc: "Dial in your suspension stiffness and choose between off-road knobbies, street slicks, or dual-sport tires." },
            { icon: PaintBucket, title: "Color & Aesthetics", desc: "Customize frame colors, decal kits, seat materials, and anodized hardware for a truly unique look." },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
              className="p-8 rounded-2xl flex flex-col items-center text-center"
              style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border-subtle)' }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(0,212,255,0.1)' }}>
                <feature.icon className="w-8 h-8" style={{ color: '#00D4FF' }} />
              </div>
              <h3 className="text-lg font-bold mb-3 tracking-wide" style={{ color: 'var(--v-text)' }}>{feature.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--v-text-muted)' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="max-w-3xl mx-auto border-t pt-16"
          style={{ borderColor: 'var(--v-border)' }}
        >
          <div className="flex items-center gap-3 justify-center mb-12">
            <Clock className="w-5 h-5" style={{ color: 'var(--v-text-dim)' }} />
            <h2 className="text-2xl font-bold tracking-widest uppercase" style={{ color: 'var(--v-text)' }}>Roadmap</h2>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#00D4FF] before:to-transparent">
            {[
              { phase: "Alpha Testing", date: "Current", status: "In Progress" },
              { phase: "Beta Access for Waitlist", date: "Q3 2026", status: "Upcoming" },
              { phase: "Public Launch", date: "Q4 2026", status: "Planned" },
            ].map((step, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"
                  style={{ backgroundColor: 'var(--v-bg)', borderColor: i === 0 ? '#00D4FF' : 'var(--v-border)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? '#00D4FF' : 'var(--v-text-dim)' }} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm tracking-wide" style={{ color: 'var(--v-text)' }}>{step.phase}</h4>
                    <span className="text-[10px] font-mono" style={{ color: i === 0 ? '#00D4FF' : 'var(--v-text-dim)' }}>{step.status}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--v-text-muted)' }}>{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
