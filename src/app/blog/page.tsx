'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const blogPosts = [
  {
    slug: 'surron-light-bee-x-vs-ultra-bee',
    title: 'Surron Light Bee X vs Ultra Bee: Which One Should You Buy?',
    excerpt: 'A head-to-head comparison of Surron\'s two most popular models. We break down power, range, weight, and value to help you choose.',
    date: '2025-03-15',
    readTime: '6 min read',
    category: 'Comparisons',
  },
  {
    slug: 'top-5-surron-upgrades',
    title: 'Top 5 Must-Have Surron Upgrades for 2025',
    excerpt: 'From upgraded batteries to performance controllers, these are the mods that make the biggest difference to your ride quality.',
    date: '2025-03-01',
    readTime: '5 min read',
    category: 'Guides',
  },
  {
    slug: 'electric-vs-gas-dirt-bikes',
    title: 'Electric vs Gas Dirt Bikes: The Honest Truth',
    excerpt: 'We put a Surron Storm Bee against a Yamaha YZ450F on the same track. The results surprised everyone.',
    date: '2025-02-20',
    readTime: '8 min read',
    category: 'Reviews',
  },
  {
    slug: 'surron-maintenance-guide',
    title: 'The Complete Surron Maintenance Guide',
    excerpt: 'Everything you need to know about keeping your electric motorcycle running at peak performance. Spoiler: it\'s way less than a gas bike.',
    date: '2025-02-10',
    readTime: '7 min read',
    category: 'Guides',
  },
  {
    slug: 'is-surron-street-legal',
    title: 'Is the Surron Street Legal? A State-by-State Breakdown',
    excerpt: 'The answer depends on your model and where you live. We researched registration requirements for all 50 states.',
    date: '2025-01-28',
    readTime: '10 min read',
    category: 'Legal',
  },
];

export default function BlogPage() {
  return (
    <div className="pt-[72px] min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-muted)' }}>Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl leading-tight mb-4">
            <span className="font-serif-italic gradient-text">The Eclipse Electric</span>{' '}
            <span className="font-bold" style={{ color: 'var(--v-text)' }}>Journal</span>
          </h1>
          <p className="text-sm max-w-lg" style={{ color: 'var(--v-text-secondary)' }}>Guides, reviews, comparisons, and news from the electric motorcycle world.</p>
        </motion.div>

        <div className="space-y-4 sm:space-y-6">
          {blogPosts.map((post, idx) => (
            <motion.div key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}>
              <Link href={`/blog/${post.slug}`}>
                <GlassCard className="p-5 sm:p-8 group cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--v-accent)' }}>{post.category}</span>
                        <span className="text-xs" style={{ color: 'var(--v-text-dim)' }}>•</span>
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--v-text-muted)' }}>
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--v-text-dim)' }}>•</span>
                        <span className="text-xs" style={{ color: 'var(--v-text-muted)' }}>{post.readTime}</span>
                      </div>
                      <h2 className="text-base sm:text-lg font-semibold transition-colors mb-2" style={{ color: 'var(--v-text)' }}>
                        {post.title}
                      </h2>
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--v-text-muted)' }}>{post.excerpt}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 shrink-0 transition-colors" style={{ color: 'var(--v-text-dim)' }} />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
