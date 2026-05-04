'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Settings, PaintBucket, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

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
    <div className="relative min-h-screen pt-24 pb-32 overflow-hidden">
      <div className="vignette-glow" />
      
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-24 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] tracking-tight mb-6">
              <span className="font-serif-italic gradient-text">Design Your</span><br />
              <span className="font-bold" style={{ color: 'var(--v-text)' }}>Ultimate Ride</span>
            </h1>
            <p className="text-sm md:text-base max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: 'var(--v-text-secondary)' }}>
              The "Build Yours" customizer is currently in development. Soon, you will be able to configure every detail of your electric motorcycle from the ground up.
            </p>
          </motion.div>

          {/* Waitlist Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md mx-auto relative"
          >
            <GlassCard className="p-8 flex flex-col justify-center min-h-[250px]">
              {submitted ? (
                <div className="flex flex-col items-center text-center py-4">
                  <CheckCircle2 className="w-12 h-12 mb-4" style={{ color: 'var(--v-text)' }} />
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--v-text)' }}>You're on the list!</h3>
                  <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>We'll notify you as soon as the customizer goes live.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
                  <div className="flex flex-col gap-1 text-center mb-2">
                    <h3 className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--v-text)' }}>Join the Waitlist</h3>
                    <p className="text-xs" style={{ color: 'var(--v-text-muted)' }}>Be the first to access the configurator.</p>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm transition-all focus:outline-none"
                    style={{ 
                      backgroundColor: 'rgba(0,0,0,0.4)', 
                      color: 'var(--v-text)', 
                      border: '1px solid var(--v-border)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="glassy"
                    className="w-full"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Notify Me'}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-24">
          {[
            { icon: Zap, num: 'I', title: "Powertrain Configurator", desc: "Select from standard, long-range, or high-performance battery and motor combinations to suit your riding style." },
            { icon: Settings, num: 'II', title: "Suspension & Tires", desc: "Dial in your suspension stiffness and choose between off-road knobbies, street slicks, or dual-sport tires." },
            { icon: PaintBucket, num: 'III', title: "Color & Aesthetics", desc: "Customize frame colors, decal kits, seat materials, and anodized hardware for a truly unique look." },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + (i * 0.1) }}
            >
              <GlassCard className="p-8 h-full relative group">
                <span className="roman-index absolute top-6 right-6">{feature.num}</span>
                <feature.icon className="w-6 h-6 mb-6 transition-colors duration-500" style={{ color: 'var(--v-text-muted)' }} />
                <h3 className="text-base font-semibold mb-3 tracking-wide" style={{ color: 'var(--v-text)' }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--v-text-secondary)' }}>{feature.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto pt-16 relative"
        >
          <div className="section-divider absolute top-0 left-0 right-0" />
          
          <div className="flex items-center gap-3 justify-center mb-16">
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--v-text)' }}>Roadmap</h2>
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-[var(--v-border)]">
            {[
              { phase: "Alpha Testing", date: "Current", status: "In Progress" },
              { phase: "Beta Access for Waitlist", date: "Q3 2026", status: "Upcoming" },
              { phase: "Public Launch", date: "Q4 2026", status: "Planned" },
            ].map((step, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Center Node */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"
                  style={{ backgroundColor: 'var(--v-bg-elevated)', borderColor: i === 0 ? 'var(--v-text)' : 'var(--v-border)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? 'var(--v-text)' : 'var(--v-text-dim)' }} />
                </div>
                
                {/* Content Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] relative">
                  <GlassCard className="p-5" hover={false}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm tracking-wide" style={{ color: 'var(--v-text)' }}>{step.phase}</h4>
                      <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: i === 0 ? 'var(--v-text)' : 'var(--v-text-dim)' }}>{step.status}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--v-text-muted)' }}>{step.date}</p>
                  </GlassCard>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
