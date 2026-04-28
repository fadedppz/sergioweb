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
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--v-text)' }}>No items in cart</h1>
          <Link href="/shop" className="text-sm underline" style={{ color: 'var(--v-text-muted)' }}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 relative z-10">
        <Link href="/cart" className="flex items-center gap-1 text-xs transition-colors mb-8 sm:mb-10" style={{ color: 'var(--v-text-muted)' }}>
          <ArrowLeft className="w-3 h-3" /> Back to Cart
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10" style={{ color: 'var(--v-text)' }}>
            <span className="font-serif-italic gradient-text">Secure</span> checkout
          </h1>

          <div className="rounded-2xl p-8 sm:p-10 text-center" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--v-bg-elevated)' }}>
              <CreditCard className="w-6 h-6" style={{ color: 'var(--v-text-muted)' }} />
            </div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--v-text)' }}>Stripe Payment</h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--v-text-muted)' }}>
              Secure checkout via Stripe. Your total: <span className="font-mono font-bold gradient-text">{formatPrice(subtotal)}</span>
            </p>
            <p className="text-xs mb-8" style={{ color: 'var(--v-text-dim)' }}>
              Add your Stripe test keys in <code style={{ color: 'var(--v-text-muted)' }}>.env.local</code> to activate.
            </p>
            <Button variant="glassy" size="lg" disabled>
              <Lock className="w-4 h-4" />Pay {formatPrice(subtotal)} — Coming Soon
            </Button>
            <div className="flex items-center justify-center gap-2 mt-6 text-[10px]" style={{ color: 'var(--v-text-dim)' }}>
              <Lock className="w-3 h-3" /><span>PCI-DSS compliant via Stripe</span>
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--v-text-muted)' }}>Order items</h3>
            {items.map((item) => (
              <div key={`${item.product.id}-${item.variant?.id}`} className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--v-border)' }}>
                <div>
                  <span className="text-xs" style={{ color: 'var(--v-text-secondary)' }}>{item.product.name}</span>
                  {item.variant && <span className="text-[10px] ml-2" style={{ color: 'var(--v-text-dim)' }}>{item.variant.label}</span>}
                  <span className="text-[10px] ml-2" style={{ color: 'var(--v-text-dim)' }}>×{item.quantity}</span>
                </div>
                <span className="text-xs font-mono" style={{ color: 'var(--v-text-secondary)' }}>{formatPrice((item.product.price + (item.variant?.price_delta || 0)) * item.quantity)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
