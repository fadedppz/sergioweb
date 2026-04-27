'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Check, Package, Truck, Shield } from 'lucide-react';
import { getProductBySlug, formatPrice, products } from '@/data/products';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductCard } from '@/components/shop/ProductCard';
import { useCart } from '@/lib/cart-store';
import { ProductVariant } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(product?.variants?.[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-sm text-white/40 hover:text-white underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock_qty === 0;
  const isOnSale = product.compare_price && product.compare_price > product.price;
  const currentPrice = product.price + (selectedVariant?.price_delta || 0);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-16 min-h-screen">
      <div className="vignette-glow" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-white/30 mb-10">
          <Link href="/shop" className="hover:text-white/60 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Shop
          </Link>
          <span className="text-white/10">/</span>
          <span className="capitalize">{product.category}</span>
          <span className="text-white/10">/</span>
          <span className="text-white/50">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square bg-gradient-to-b from-[#0D0D0D] to-[#080808] rounded-3xl border border-white/[0.04] flex items-center justify-center relative overflow-hidden">
              <div className="w-32 h-32 rounded-full bg-white/[0.015] flex items-center justify-center">
                <Package className="w-16 h-16 text-white/[0.06]" />
              </div>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_featured && <Badge variant="featured">Featured</Badge>}
                {isOnSale && <Badge variant="sale">Sale</Badge>}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-3">
              {product.category === 'bikes' ? 'Electric Bikes' : product.category === 'parts' ? 'Parts' : 'Accessories'}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-5">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl font-mono font-bold gradient-text">{formatPrice(currentPrice)}</span>
              {isOnSale && product.compare_price && (
                <>
                  <span className="text-base font-mono text-white/20 line-through">{formatPrice(product.compare_price)}</span>
                  <Badge variant="sale">−{formatPrice(product.compare_price - product.price)}</Badge>
                </>
              )}
            </div>

            <p className="text-sm text-white/50 leading-relaxed mb-8">{product.description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-3">
                  {product.category === 'accessories' ? 'Size' : 'Color'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button key={v.id} onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 text-xs rounded-full border transition-all duration-200 ${
                        selectedVariant?.id === v.id
                          ? 'border-white bg-white text-black font-semibold'
                          : 'border-white/[0.08] text-white/40 hover:border-white/[0.2]'
                      }`}>
                      {v.label}
                      {v.price_delta > 0 && <span className="ml-1 opacity-50">+{formatPrice(v.price_delta)}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + ATC */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center border border-white/[0.06] rounded-full overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-sm text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors">−</button>
                <span className="px-4 py-3 text-sm font-mono text-white min-w-[48px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-sm text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors">+</button>
              </div>
              <Button variant="primary" size="lg" onClick={() => addItem(product, selectedVariant, quantity)}
                disabled={isOutOfStock} className="flex-1">
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock ? 'Notify Me' : 'Add to Cart'}
              </Button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders $500+' },
                { icon: Shield, label: 'Warranty', sub: '1-2 Years' },
                { icon: Check, label: 'Authentic', sub: 'Genuine Surron' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.015] border border-white/[0.04]">
                  <b.icon className="w-4 h-4 text-white/30 mb-2" />
                  <span className="text-[10px] font-medium text-white/60">{b.label}</span>
                  <span className="text-[9px] text-white/25 mt-0.5">{b.sub}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Specs */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-medium">Specifications</span>
          </div>
          <div className="rounded-3xl border border-white/[0.04] overflow-hidden">
            <div className="divide-y divide-white/[0.04]">
              {Object.entries(product.specs).map(([key, value], idx) => (
                <div key={key} className={`flex items-center px-6 py-4 ${idx % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <span className="w-1/3 text-xs text-white/30 font-medium">{key}</span>
                  <span className="flex-1 text-xs font-mono text-white/70">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-medium">Related</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, idx) => <ProductCard key={p.id} product={p} index={idx} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
