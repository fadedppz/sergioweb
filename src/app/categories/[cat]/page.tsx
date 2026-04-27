'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { products } from '@/data/products';
import { ProductCard } from '@/components/shop/ProductCard';
import Link from 'next/link';

const categoryMeta: Record<string, { title: string; serifWord: string; description: string }> = {
  bikes: {
    title: 'Bikes',
    serifWord: 'Electric',
    description: 'Surron electric motorcycles — from lightweight trail bikes to full-size highway machines.',
  },
  parts: {
    title: 'upgrades',
    serifWord: 'Performance',
    description: 'Batteries, controllers, suspension, and drivetrain upgrades for your Surron.',
  },
  accessories: {
    title: 'gear',
    serifWord: 'Rider',
    description: 'Helmets, gloves, chargers, mounts, and security gear for every rider.',
  },
};

export default function CategoryPage() {
  const params = useParams();
  const cat = params.cat as string;
  const meta = categoryMeta[cat];
  const categoryProducts = products.filter(p => p.category === cat);

  if (!meta) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-4">Category Not Found</h1>
          <Link href="/shop" className="text-sm text-white/40 hover:text-white underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="vignette-glow" />
      <div className="relative py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-xs text-white/30 mb-6">
              <Link href="/shop" className="hover:text-white/60 transition-colors">Shop</Link>
              <span className="text-white/10">/</span>
              <span className="text-white/50 capitalize">{cat}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl leading-tight mb-4">
              <span className="font-serif-italic gradient-text">{meta.serifWord}</span>{' '}
              <span className="font-bold text-white">{meta.title}</span>
            </h1>
            <p className="text-sm text-white/40 max-w-lg">{meta.description}</p>
            <p className="text-[10px] text-white/15 mt-3 uppercase tracking-widest">{categoryProducts.length} products</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
