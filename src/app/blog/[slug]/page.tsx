'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="pt-[72px] min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link href="/blog" className="flex items-center gap-1 text-sm transition-colors mb-8" style={{ color: 'var(--v-text-muted)' }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
        </Link>
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--v-accent)' }}>Article</span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--v-text)' }}>{title}</h1>
          <div className="flex items-center gap-4 text-sm mb-10 sm:mb-12" style={{ color: 'var(--v-text-muted)' }}>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Mar 15, 2025</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 6 min read</span>
          </div>
          <div className="space-y-6">
            <p className="leading-relaxed" style={{ color: 'var(--v-text-secondary)' }}>
              This blog post is coming soon. We&apos;re working on building out our content library with in-depth reviews,
              comparisons, and guides for the Surron electric motorcycle community.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--v-text-secondary)' }}>
              In the meantime, check out our <Link href="/shop" className="underline" style={{ color: 'var(--v-accent)' }}>product catalog</Link> or
              reach out via our <Link href="/contact" className="underline" style={{ color: 'var(--v-accent)' }}>contact page</Link> if you have questions.
            </p>
            <div className="mt-12 p-8 rounded-2xl text-center" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
              <p className="mb-4 text-sm" style={{ color: 'var(--v-text-muted)' }}>Want to be notified when new articles drop?</p>
              <Link href="/#newsletter" className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--v-btn-primary-bg)', color: 'var(--v-btn-primary-text)' }}>
                Subscribe to Newsletter
              </Link>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
