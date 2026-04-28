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
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="vignette-glow" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center relative z-10">
          <ShoppingBag className="w-12 h-12 mx-auto mb-6" style={{ color: 'var(--v-text-dim)' }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--v-text)' }}>Your cart is empty</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--v-text-muted)' }}>Nothing here yet.</p>
          <Link href="/shop"><Button variant="glassy">Shop Now <ArrowRight className="w-4 h-4" /></Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 relative z-10">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--v-text)' }}>
            <span className="font-serif-italic gradient-text">Your</span> cart
          </h1>
          <button onClick={clearCart} className="text-xs hover:text-red-400 transition-colors" style={{ color: 'var(--v-text-dim)' }}>Clear</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item) => {
              const price = item.product.price + (item.variant?.price_delta || 0);
              return (
                <motion.div key={`${item.product.id}-${item.variant?.id || 'd'}`}
                  layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl"
                  style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--v-bg-elevated)' }}>
                    <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: 'var(--v-text-dim)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.product.slug}`} className="text-sm font-medium transition-colors" style={{ color: 'var(--v-text)' }}>
                      {item.product.name}
                    </Link>
                    {item.variant && <p className="text-xs mt-0.5" style={{ color: 'var(--v-text-dim)' }}>{item.variant.label}</p>}
                    <p className="text-base font-mono font-bold gradient-text mt-2">{formatPrice(price)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center rounded-full overflow-hidden" style={{ border: '1px solid var(--v-border)' }}>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                          className="px-3 py-1.5 transition-colors" style={{ color: 'var(--v-text-muted)' }}>
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1.5 text-xs font-mono" style={{ color: 'var(--v-text)' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                          className="px-3 py-1.5 transition-colors" style={{ color: 'var(--v-text-muted)' }}>
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-sm font-mono" style={{ color: 'var(--v-text)' }}>{formatPrice(price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.product.id, item.variant?.id)}
                          className="p-1.5 hover:text-red-400 transition-colors" style={{ color: 'var(--v-text-dim)' }}>
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
            <div className="sticky top-24 rounded-2xl p-5 sm:p-6 space-y-4" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--v-text)' }}>Summary</h2>
              <div className="space-y-3 pb-4" style={{ borderBottom: '1px solid var(--v-border)' }}>
                <div className="flex justify-between text-xs"><span style={{ color: 'var(--v-text-muted)' }}>Subtotal</span><span className="font-mono" style={{ color: 'var(--v-text)' }}>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-xs"><span style={{ color: 'var(--v-text-muted)' }}>Shipping</span><span style={{ color: 'var(--v-text-dim)' }}>At checkout</span></div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold" style={{ color: 'var(--v-text)' }}>Total</span>
                <span className="text-lg font-mono font-bold gradient-text">{formatPrice(subtotal)}</span>
              </div>
              <Link href="/checkout">
                <Button variant="glassy" size="lg" className="w-full mt-2">Checkout <ArrowRight className="w-4 h-4" /></Button>
              </Link>
              <Link href="/shop" className="flex items-center justify-center gap-1 text-xs transition-colors mt-2" style={{ color: 'var(--v-text-dim)' }}>
                <ArrowLeft className="w-3 h-3" /> Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
