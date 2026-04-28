'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Package } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/data/products';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/lib/cart-store';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const isOutOfStock = product.stock_qty === 0;
  const isOnSale = product.compare_price && product.compare_price > product.price;
  const productUrl = `/shop/${product.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative"
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          backgroundColor: 'var(--v-bg-card)',
          border: '1px solid var(--v-border)',
        }}
      >
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

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOutOfStock) addItem(product, product.variants?.[0]);
                }}
                disabled={isOutOfStock}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-semibold rounded-full hover:bg-white/90 transition-all disabled:opacity-40"
              >
                <ShoppingCart className="w-3 h-3" />
                {isOutOfStock ? 'Sold Out' : 'Add'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); router.push(productUrl); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full hover:bg-white/20 transition-all"
              >
                <Eye className="w-3 h-3" />
                View
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.is_featured && <Badge variant="featured">Featured</Badge>}
              {isOnSale && <Badge variant="sale">Sale</Badge>}
              {isOutOfStock && <Badge variant="preorder">Pre-Order</Badge>}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4">
          <Link href={productUrl}>
            <p className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--v-text-dim)' }}>
              {product.category === 'bikes' ? 'Electric Bikes' : product.category === 'parts' ? 'Parts' : 'Accessories'}
            </p>
            <h3 className="text-sm font-medium transition-colors duration-300 line-clamp-1" style={{ color: 'var(--v-text-secondary)' }}>
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-sm sm:text-base font-mono font-bold" style={{ color: 'var(--v-text)' }}>{formatPrice(product.price)}</span>
            {isOnSale && product.compare_price && (
              <span className="text-xs font-mono line-through" style={{ color: 'var(--v-text-dim)' }}>{formatPrice(product.compare_price)}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            <div className={`w-1 h-1 rounded-full ${
              isOutOfStock ? 'bg-red-500/60' : product.stock_qty < 5 ? 'bg-amber-400/60' : 'bg-emerald-400/40'
            }`} />
            <span className="text-[10px]" style={{ color: 'var(--v-text-dim)' }}>
              {isOutOfStock ? 'Pre-order' : product.stock_qty < 5 ? `${product.stock_qty} left` : 'In stock'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
