'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CreditCard, ArrowLeft, AlertCircle, CheckCircle, Truck, ShieldCheck, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/lib/auth-store';
import { formatPrice } from '@/data/products';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<'shipping' | 'review' | 'success'>('shipping');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');

  // Shipping form state
  const [shipping, setShipping] = useState({
    name: '', line1: '', line2: '', city: '', state: '', postal: '', country: 'US',
  });

  const inputStyles: React.CSSProperties = {
    backgroundColor: 'var(--v-input-bg)',
    border: '1px solid var(--v-border)',
    color: 'var(--v-text)',
  };

  // Auth gate — redirect to login if not authenticated
  if (!isLoading && !user) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="vignette-glow" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center relative z-10 px-4 max-w-md">
          <div className="rounded-2xl p-8 sm:p-10" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <Lock className="w-10 h-10 mx-auto mb-5" style={{ color: 'var(--v-text-dim)' }} />
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--v-text)' }}>Sign in to checkout</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--v-text-muted)' }}>
              You need an account to place an order. Your cart items will be saved.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/login?redirect=/checkout">
                <Button variant="glassy" size="lg" className="w-full">Sign In</Button>
              </Link>
              <Link href="/signup?redirect=/checkout">
                <Button variant="outline" size="lg" className="w-full">Create Account</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--v-text)' }}>No items in cart</h1>
          <Link href="/shop" className="text-sm underline" style={{ color: 'var(--v-text-muted)' }}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            variantId: item.variant?.id || null,
            quantity: item.quantity,
          })),
          shipping,
          couponCode: couponCode || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to place order.');
        setLoading(false);
        return;
      }

      // Order placed successfully
      setOrderId(data.orderId);
      setInvoiceNumber(data.invoiceNumber);
      clearCart();
      setStep('success');
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  // Success state
  if (step === 'success') {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="vignette-glow" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10 px-4 max-w-md">
          <div className="rounded-2xl p-10" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <CheckCircle className="w-14 h-14 text-emerald-400/60 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--v-text)' }}>Order Placed</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--v-text-muted)' }}>
              Thank you for your purchase. A confirmation email has been sent.
            </p>
            <div className="rounded-xl p-4 mb-6 text-left space-y-2" style={{ backgroundColor: 'var(--v-bg-elevated)', border: '1px solid var(--v-border)' }}>
              <p className="text-xs" style={{ color: 'var(--v-text-muted)' }}>
                <span className="font-medium" style={{ color: 'var(--v-text-secondary)' }}>Order ID:</span> {orderId.slice(0, 8)}...
              </p>
              <p className="text-xs" style={{ color: 'var(--v-text-muted)' }}>
                <span className="font-medium" style={{ color: 'var(--v-text-secondary)' }}>Invoice:</span> {invoiceNumber}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/account/orders"><Button variant="glassy" size="lg" className="w-full">View Orders</Button></Link>
              <Link href="/shop"><Button variant="outline" size="lg" className="w-full">Continue Shopping</Button></Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 relative z-10">
        <Link href="/cart" className="flex items-center gap-1 text-xs transition-colors mb-8" style={{ color: 'var(--v-text-muted)' }}>
          <ArrowLeft className="w-3 h-3" /> Back to Cart
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: 'var(--v-text)' }}>
            <span className="font-serif-italic gradient-text">Secure</span> checkout
          </h1>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-6" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Form */}
              <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-5 h-5" style={{ color: 'var(--v-text-muted)' }} />
                  <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--v-text)' }}>Shipping Address</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Full Name</label>
                    <input type="text" required value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyles} placeholder="John Doe" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Address Line 1</label>
                    <input type="text" required value={shipping.line1} onChange={(e) => setShipping({ ...shipping, line1: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyles} placeholder="123 Main St" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Address Line 2 (Optional)</label>
                    <input type="text" value={shipping.line2} onChange={(e) => setShipping({ ...shipping, line2: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyles} placeholder="Apt, Suite, Unit" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>City</label>
                    <input type="text" required value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyles} placeholder="Denver" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>State</label>
                    <input type="text" required value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyles} placeholder="CO" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>ZIP Code</label>
                    <input type="text" required value={shipping.postal} onChange={(e) => setShipping({ ...shipping, postal: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyles} placeholder="80202" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Country</label>
                    <input type="text" required value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyles} placeholder="US" />
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="w-4 h-4" style={{ color: 'var(--v-text-muted)' }} />
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--v-text-secondary)' }}>Discount Code</h3>
                </div>
                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none font-mono" style={inputStyles} placeholder="Enter code" />
              </div>

              {/* Payment info */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5" style={{ color: 'var(--v-text-muted)' }} />
                  <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--v-text)' }}>Payment</h2>
                </div>
                <p className="text-xs" style={{ color: 'var(--v-text-muted)' }}>
                  Secure payment via Stripe will be activated once payment keys are configured. 
                  For now, orders are created in &quot;pending&quot; status.
                </p>
                <div className="flex items-center gap-2 mt-3 text-[10px]" style={{ color: 'var(--v-text-dim)' }}>
                  <ShieldCheck className="w-3 h-3" /> PCI-DSS compliant via Stripe
                </div>
              </div>
            </div>

            {/* Right — Summary */}
            <div>
              <div className="sticky top-24 rounded-2xl p-5 sm:p-6" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--v-text)' }}>Order Summary</h3>
                <div className="space-y-3 pb-4" style={{ borderBottom: '1px solid var(--v-border)' }}>
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.variant?.id}`} className="flex justify-between text-xs">
                      <div>
                        <span style={{ color: 'var(--v-text-secondary)' }}>{item.product.name}</span>
                        {item.variant && <span className="text-[10px] ml-1" style={{ color: 'var(--v-text-dim)' }}>({item.variant.label})</span>}
                        <span className="text-[10px] ml-1" style={{ color: 'var(--v-text-dim)' }}>x{item.quantity}</span>
                      </div>
                      <span className="font-mono" style={{ color: 'var(--v-text-secondary)' }}>
                        {formatPrice((item.product.price + (item.variant?.price_delta || 0)) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 py-3" style={{ borderBottom: '1px solid var(--v-border)' }}>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--v-text-muted)' }}>Subtotal</span>
                    <span className="font-mono" style={{ color: 'var(--v-text)' }}>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--v-text-muted)' }}>Shipping</span>
                    <span style={{ color: subtotal >= 500 ? '#00D4FF' : 'var(--v-text-secondary)' }} className="text-xs">
                      {subtotal >= 500 ? 'FREE' : formatPrice(29.99)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between pt-3 mb-4">
                  <span className="text-sm font-semibold" style={{ color: 'var(--v-text)' }}>Total</span>
                  <span className="text-lg font-mono font-bold gradient-text">{formatPrice(subtotal >= 500 ? subtotal : subtotal + 29.99)}</span>
                </div>

                <Button
                  variant="glassy" size="lg" className="w-full"
                  disabled={loading || !shipping.name || !shipping.line1 || !shipping.city || !shipping.state || !shipping.postal}
                  onClick={handlePlaceOrder}
                >
                  <Lock className="w-4 h-4" />
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-[10px]" style={{ color: 'var(--v-text-dim)' }}>
                  <Lock className="w-3 h-3" /> Encrypted & Secure
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
