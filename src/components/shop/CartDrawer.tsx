'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { formatPrice } from '@/data/products';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, drawerOpen, setDrawerOpen } = useCart();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm z-50"
            style={{ backgroundColor: 'var(--v-overlay)' }}
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[min(420px,100vw)] z-50 flex flex-col"
            style={{ backgroundColor: 'var(--v-bg-surface)', borderLeft: '1px solid var(--v-border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-5" style={{ borderBottom: '1px solid var(--v-border)' }}>
              <h2 className="text-sm font-semibold tracking-wider uppercase" style={{ color: 'var(--v-text)' }}>Cart</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 transition-colors" style={{ color: 'var(--v-text-muted)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-10 h-10 mb-4" style={{ color: 'var(--v-text-dim)' }} />
                  <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => {
                  const price = item.product.price + (item.variant?.price_delta || 0);
                  return (
                    <div
                      key={`${item.product.id}-${item.variant?.id || 'd'}`}
                      className="flex gap-4 p-4 rounded-2xl"
                      style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}
                    >
                      <div
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'var(--v-bg-card)' }}
                      >
                        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--v-text-dim)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--v-text)' }}>{item.product.name}</p>
                        {item.variant && <p className="text-xs mt-0.5" style={{ color: 'var(--v-text-muted)' }}>{item.variant.label}</p>}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--v-border)' }}>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                              className="px-2 py-1.5 transition-colors"
                              style={{ color: 'var(--v-text-muted)' }}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1.5 text-xs font-mono" style={{ color: 'var(--v-text)' }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                              className="px-2 py-1.5 transition-colors"
                              style={{ color: 'var(--v-text-muted)' }}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-sm font-mono" style={{ color: 'var(--v-text)' }}>{formatPrice(price * item.quantity)}</span>
                            <button
                              onClick={() => removeItem(item.product.id, item.variant?.id)}
                              className="p-1 hover:text-red-400 transition-colors"
                              style={{ color: 'var(--v-text-dim)' }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 sm:px-6 py-5 space-y-4" style={{ borderTop: '1px solid var(--v-border)' }}>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Subtotal</span>
                  <span className="text-base font-mono font-bold" style={{ color: 'var(--v-text)' }}>{formatPrice(subtotal)}</span>
                </div>
                <Link href="/checkout" onClick={() => setDrawerOpen(false)}>
                  <Button variant="glassy" size="lg" className="w-full">
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="block text-center text-xs transition-colors"
                  style={{ color: 'var(--v-text-muted)' }}
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
