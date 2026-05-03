'use client';

import { useWishlist } from '@/lib/wishlist-store';
import { ProductCard } from '@/components/shop/ProductCard';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-[0.1em] uppercase mb-4" style={{ color: 'var(--v-text)' }}>
            Your Wishlist
          </h1>
          <p className="text-sm md:text-base max-w-2xl" style={{ color: 'var(--v-text-secondary)' }}>
            Keep track of the bikes and gear you have your eye on. Ready to make a move?
          </p>
        </div>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col items-center justify-center text-center py-32 rounded-3xl overflow-hidden group"
            style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)', backdropFilter: 'blur(16px)' }}
          >
            {/* Glassy shine */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.03)] to-transparent pointer-events-none" />

            <div className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl" style={{ backgroundColor: 'var(--v-bg-elevated)', border: '1px solid var(--v-border)' }}>
              <Heart className="w-10 h-10" style={{ color: 'var(--v-text-muted)' }} />
            </div>
            <h2 className="relative z-10 text-xl font-bold mb-3 tracking-wide" style={{ color: 'var(--v-text)' }}>Nothing here yet.</h2>
            <p className="relative z-10 text-sm mb-8 max-w-md mx-auto" style={{ color: 'var(--v-text-muted)' }}>
              Explore our collection of premium electric motorcycles and performance parts to start building your wishlist.
            </p>
            <Link href="/shop" 
              className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--v-text)', color: 'var(--v-bg)' }}>
              Explore the Shop
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {items.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
