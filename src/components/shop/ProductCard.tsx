'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Package, Star, Heart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/data/products';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/lib/cart-store';
import { useWishlist } from '@/lib/wishlist-store';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  
  const isOutOfStock = product.stock_qty === 0;
  const isOnSale = product.compare_price && product.compare_price > product.price;
  const productUrl = `/shop/${product.slug}`;
  const isSaved = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative flex flex-col"
    >
      <div className="relative overflow-hidden transition-all duration-500 mb-4">
        {/* Image Container */}
        <div
          onClick={() => router.push(productUrl)}
          className="block cursor-pointer"
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && router.push(productUrl)}
        >
          <div className="relative aspect-[4/3] overflow-hidden" style={{ background: 'linear-gradient(to bottom, var(--v-bg-elevated), var(--v-bg-surface))' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg-card)' }}>
                <Package className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: 'var(--v-text-dim)' }} />
              </div>
            </div>

            {/* Quick Add overlay (Patagonia style - full width at bottom) */}
            <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOutOfStock) addItem(product, product.variants?.[0]);
                }}
                disabled={isOutOfStock}
                className="w-full py-2.5 bg-black text-white text-[10px] font-bold tracking-wider uppercase hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--v-text)' }}
              >
                <ShoppingBag className="w-3.5 h-3.5" style={{ color: 'var(--v-bg)' }} />
                <span style={{ color: 'var(--v-bg)' }}>{isOutOfStock ? 'Sold Out' : 'Quick Add'}</span>
              </button>
            </div>

            {/* Wishlist Heart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-30"
              style={{ 
                backgroundColor: isSaved ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid var(--v-border-subtle)'
              }}
              aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart 
                className={`w-4 h-4 transition-all duration-300 ${isSaved ? 'scale-110' : 'scale-100 hover:scale-110'}`} 
                style={{ 
                  color: 'var(--v-text)', 
                  fill: isSaved ? 'var(--v-text)' : 'transparent' 
                }} 
              />
            </button>

          </div>
        </div>

        {/* Product Info (Patagonia style) */}
        <div className="flex flex-col flex-1 px-1">
          <Link href={productUrl} className="group-hover:opacity-80 transition-opacity">
            <h3 className="text-base font-semibold mb-1 mt-2" style={{ color: 'var(--v-text)' }}>
              {product.name}
            </h3>
          </Link>

          {/* Star rating placeholder */}
          <div className="flex items-center gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 fill-current" style={{ color: star === 5 ? 'var(--v-border)' : 'var(--v-text)' }} />
            ))}
            <span className="text-[10px] ml-1" style={{ color: 'var(--v-text-muted)' }}>(24)</span>
          </div>

          {/* Swatches (simulated with random colors or product variants) */}
          <div className="flex gap-1.5 mb-3">
            <div className="w-4 h-4 rounded-full border shadow-inner" style={{ backgroundColor: '#111', borderColor: 'var(--v-border)' }} />
            <div className="w-4 h-4 rounded-full border shadow-inner" style={{ backgroundColor: '#ccc', borderColor: 'var(--v-border)' }} />
            {product.category === 'bikes' && (
              <div className="w-4 h-4 rounded-full border shadow-inner" style={{ backgroundColor: '#7B2FFF', borderColor: 'var(--v-border)' }} />
            )}
          </div>

          <div className="mt-auto flex items-end justify-between pt-2">
            <div className="flex flex-col">
              {isOnSale && product.compare_price && (
                <span className="text-xs font-mono line-through mb-0.5" style={{ color: 'var(--v-text-dim)' }}>
                  {formatPrice(product.compare_price)}
                </span>
              )}
              <span className="text-base font-mono font-bold" style={{ color: isOnSale ? '#00D4FF' : 'var(--v-text)' }}>
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${
                isOutOfStock ? 'bg-red-500/60' : product.stock_qty < 5 ? 'bg-amber-400/60' : 'bg-emerald-400/60'
              }`} />
              <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--v-text-dim)' }}>
                {isOutOfStock ? 'Pre-order' : 'In stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
