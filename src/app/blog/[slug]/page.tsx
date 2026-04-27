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
    <div className="pt-[72px] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/blog" className="flex items-center gap-1 text-sm text-[#888888] hover:text-[#00D4FF] transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
        </Link>
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs font-medium text-[#7B2FFF] uppercase tracking-wider">Article</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5] mt-2 mb-4">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-[#888888] mb-12">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Mar 15, 2025</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 6 min read</span>
          </div>
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-[#CCCCCC] leading-relaxed">
              This blog post is coming soon. We&apos;re working on building out our content library with in-depth reviews,
              comparisons, and guides for the Surron electric motorcycle community.
            </p>
            <p className="text-[#CCCCCC] leading-relaxed">
              In the meantime, check out our <Link href="/shop" className="text-[#00D4FF] hover:underline">product catalog</Link> or
              reach out via our <Link href="/contact" className="text-[#00D4FF] hover:underline">contact page</Link> if you have questions.
            </p>
            <div className="mt-12 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
              <p className="text-[#888888] mb-4">Want to be notified when new articles drop?</p>
              <Link href="/#newsletter" className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D4FF] text-[#0A0A0A] font-semibold rounded-lg hover:bg-[#00BFEA] transition-colors">
                Subscribe to Newsletter
              </Link>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
