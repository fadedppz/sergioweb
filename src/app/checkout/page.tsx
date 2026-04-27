'use client';

import { motion } from 'framer-motion';
import { Lock, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { formatPrice } from '@/data/products';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-4">No items in cart</h1>
          <Link href="/shop" className="text-sm text-white/40 hover:text-white underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="vignette-glow" />
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-16 relative z-10">
        <Link href="/cart" className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mb-10">
          <ArrowLeft className="w-3 h-3" /> Back to Cart
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-10">
            <span className="font-serif-italic gradient-text">Secure</span> checkout
          </h1>

          <div className="glass-card-static p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-6 h-6 text-white/30" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-3">Stripe Payment</h2>
            <p className="text-sm text-white/40 mb-6 max-w-md mx-auto">
              Secure checkout via Stripe. Your total: <span className="font-mono font-bold gradient-text">{formatPrice(subtotal)}</span>
            </p>
            <p className="text-xs text-white/15 mb-8">
              Add your Stripe test keys in <code className="text-white/30">.env.local</code> to activate.
            </p>
            <Button variant="primary" size="lg" disabled>
              <Lock className="w-4 h-4" />Pay {formatPrice(subtotal)} — Coming Soon
            </Button>
            <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-white/15">
              <Lock className="w-3 h-3" /><span>PCI-DSS compliant via Stripe</span>
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-4">Order items</h3>
            {items.map((item) => (
              <div key={`${item.product.id}-${item.variant?.id}`} className="flex justify-between py-2 border-b border-white/[0.04]">
                <div>
                  <span className="text-xs text-white/60">{item.product.name}</span>
                  {item.variant && <span className="text-[10px] text-white/20 ml-2">{item.variant.label}</span>}
                  <span className="text-[10px] text-white/20 ml-2">×{item.quantity}</span>
                </div>
                <span className="text-xs font-mono text-white/60">{formatPrice((item.product.price + (item.variant?.price_delta || 0)) * item.quantity)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
