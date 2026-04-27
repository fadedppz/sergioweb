'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/data/products';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="vignette-glow" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center relative z-10">
          <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
          <p className="text-sm text-white/30 mb-8">Nothing here yet.</p>
          <Link href="/shop"><Button variant="primary">Shop Now <ArrowRight className="w-4 h-4" /></Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="vignette-glow" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-white">
            <span className="font-serif-italic gradient-text">Your</span> cart
          </h1>
          <button onClick={clearCart} className="text-xs text-white/20 hover:text-red-400 transition-colors">Clear</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.product.price + (item.variant?.price_delta || 0);
              return (
                <motion.div key={`${item.product.id}-${item.variant?.id || 'd'}`}
                  layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex gap-5 p-5 bg-white/[0.015] border border-white/[0.04] rounded-2xl">
                  <div className="w-20 h-20 bg-white/[0.02] rounded-xl flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-8 h-8 text-white/[0.06]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.product.slug}`} className="text-sm font-medium text-white hover:text-white/70 transition-colors">
                      {item.product.name}
                    </Link>
                    {item.variant && <p className="text-xs text-white/25 mt-0.5">{item.variant.label}</p>}
                    <p className="text-base font-mono font-bold gradient-text mt-2">{formatPrice(price)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/[0.06] rounded-full overflow-hidden">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                          className="px-3 py-1.5 text-white/30 hover:text-white hover:bg-white/[0.04] transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1.5 text-xs font-mono text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                          className="px-3 py-1.5 text-white/30 hover:text-white hover:bg-white/[0.04] transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-white">{formatPrice(price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.product.id, item.variant?.id)}
                          className="p-1.5 text-white/15 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div>
            <div className="sticky top-24 glass-card-static p-6 space-y-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Summary</h2>
              <div className="space-y-3 border-b border-white/[0.04] pb-4">
                <div className="flex justify-between text-xs"><span className="text-white/30">Subtotal</span><span className="font-mono text-white">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-xs"><span className="text-white/30">Shipping</span><span className="text-white/20">At checkout</span></div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-white">Total</span>
                <span className="text-lg font-mono font-bold gradient-text">{formatPrice(subtotal)}</span>
              </div>
              <Link href="/checkout">
                <Button variant="primary" size="lg" className="w-full mt-2">Checkout <ArrowRight className="w-4 h-4" /></Button>
              </Link>
              <Link href="/shop" className="flex items-center justify-center gap-1 text-xs text-white/20 hover:text-white/40 transition-colors mt-2">
                <ArrowLeft className="w-3 h-3" /> Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
