'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Daily Commuter',
    content: 'The Eclipse X has completely transformed my daily commute. The acceleration is incredibly smooth, and the build quality feels premium in every aspect. Best decision I made this year.',
    rating: 5,
    color: '#00D4FF',
    delay: 0.1,
    position: 'mt-0 sm:-mt-10 lg:mt-0 lg:col-start-1 lg:row-start-1',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Off-Road Enthusiast',
    content: 'Took the Vandal out to the trails this weekend. The suspension eats up everything, and the torque is just ridiculous. Built like a tank but handles like a dream.',
    rating: 5,
    color: '#7B2FFF',
    delay: 0.2,
    position: 'mt-0 sm:mt-12 lg:mt-24 lg:col-start-2 lg:row-start-1',
  },
  {
    id: 3,
    name: 'David Rossi',
    role: 'Pro Rider',
    content: "I've ridden everything from gas bikes to early EV prototypes. The thermal management on these batteries is next level. You can push it hard all day without power fade.",
    rating: 5,
    color: '#FF6B35',
    delay: 0.3,
    position: 'mt-0 sm:-mt-6 lg:-mt-12 lg:col-start-3 lg:row-start-1',
  },
  {
    id: 4,
    name: 'Elena Rodriguez',
    role: 'Weekend Warrior',
    content: 'The custom parts ecosystem is incredible. I was able to swap out the footpegs and add a new controller module in under an hour. The engineering is brilliantly modular.',
    rating: 5,
    color: '#00FF88',
    delay: 0.4,
    position: 'mt-0 sm:mt-8 lg:mt-16 lg:col-start-1 lg:row-start-2 lg:translate-x-12',
  },
  {
    id: 5,
    name: 'James Thompson',
    role: 'Tech Reviewer',
    content: 'Eclipse Electric isn\'t just building bikes; they\'re building an entire platform. The integration between the hardware and the VCU app is flawless.',
    rating: 5,
    color: '#FF2DAA',
    delay: 0.5,
    position: 'mt-0 sm:mt-4 lg:mt-0 lg:col-start-2 lg:row-start-2',
  },
  {
    id: 6,
    name: 'Michael Chang',
    role: 'City Rider',
    content: 'Silent, stealthy, and stupid fast. I get stopped at traffic lights constantly by people asking what it is. The aesthetics alone are worth it.',
    rating: 5,
    color: '#00D4FF',
    delay: 0.6,
    position: 'mt-0 sm:mt-16 lg:mt-32 lg:col-start-3 lg:row-start-2 lg:-translate-x-8',
  },
];

export default function TestimonialsPage() {
  return (
    <div className="pt-24 min-h-screen pb-32" style={{ backgroundColor: 'var(--v-bg)' }}>
      {/* Background glow effects */}
      <div className="vignette-glow" />
      <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Header section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20 lg:mb-32"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-muted)' }}>Wall of Love</span>
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl leading-tight font-bold mb-6" style={{ color: 'var(--v-text)' }}>
            Real <span className="font-serif-italic" style={{ color: 'var(--v-text-secondary)' }}>Riders.</span><br />
            Real <span className="font-serif-italic" style={{ color: 'var(--v-text-secondary)' }}>Stories.</span>
          </h1>
          <p className="text-base sm:text-lg" style={{ color: 'var(--v-text-muted)' }}>
            Don't just take our word for it. See what the community is saying about the Eclipse Electric experience.
          </p>
        </motion.div>

        {/* Scattered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 lg:grid-rows-2 pb-20">
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: t.delay, type: 'spring', stiffness: 50 }}
              className={`relative ${t.position} group cursor-default`}
            >
              {/* Card */}
              <div 
                className="relative z-10 p-8 sm:p-10 rounded-3xl transition-transform duration-500 hover:-translate-y-2 h-full flex flex-col justify-between"
                style={{ 
                  backgroundColor: 'var(--v-bg-card)', 
                  border: '1px solid var(--v-border)',
                  backdropFilter: 'blur(16px)'
                }}
              >
                {/* Glow border on hover */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ border: `1px solid ${t.color}40`, boxShadow: `0 0 40px ${t.color}15` }}
                />

                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" style={{ color: t.color }} />
                    ))}
                  </div>
                  
                  <p className="text-base sm:text-lg leading-relaxed font-medium mb-8" style={{ color: 'var(--v-text)' }}>
                    "{t.content}"
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-auto pt-6" style={{ borderTop: '1px solid var(--v-border-subtle)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                    style={{ backgroundColor: t.color, color: '#000' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-wide" style={{ color: 'var(--v-text)' }}>{t.name}</h4>
                    <p className="text-[11px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--v-text-muted)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
