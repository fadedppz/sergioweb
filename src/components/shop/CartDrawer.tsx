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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[min(420px,100vw)] bg-[#080808] border-l border-white/[0.04] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.04]">
              <h2 className="text-sm font-semibold text-white tracking-wider uppercase">Cart</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-10 h-10 text-white/10 mb-4" />
                  <p className="text-sm text-white/30">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => {
                  const price = item.product.price + (item.variant?.price_delta || 0);
                  return (
                    <div key={`${item.product.id}-${item.variant?.id || 'd'}`}
                      className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="w-16 h-16 rounded-xl bg-white/[0.02] flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-6 h-6 text-white/10" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.product.name}</p>
                        {item.variant && <p className="text-xs text-white/30 mt-0.5">{item.variant.label}</p>}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-0 border border-white/[0.06] rounded-lg overflow-hidden">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                              className="px-2 py-1.5 text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1.5 text-xs font-mono text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                              className="px-2 py-1.5 text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono text-white">{formatPrice(price * item.quantity)}</span>
                            <button onClick={() => removeItem(item.product.id, item.variant?.id)}
                              className="p-1 text-white/20 hover:text-red-400 transition-colors">
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
              <div className="px-6 py-5 border-t border-white/[0.04] space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-white/50">Subtotal</span>
                  <span className="text-base font-mono font-bold text-white">{formatPrice(subtotal)}</span>
                </div>
                <Link href="/checkout" onClick={() => setDrawerOpen(false)}>
                  <Button variant="primary" size="lg" className="w-full">
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="block text-center text-xs text-white/30 hover:text-white/60 transition-colors"
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
