'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { createClient } from '@/lib/supabase/client';

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  shipping_name: string;
  order_items: Array<{ product_name: string; variant_label: string; quantity: number; unit_price: number }>;
}

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  paid: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#10b981',
  cancelled: '#ef4444',
  refunded: '#6b7280',
};

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/account/orders');
      return;
    }
    if (user) {
      fetchOrders();
    }
  }, [user, isLoading]);

  const fetchOrders = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
  };

  if (isLoading || loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="animate-pulse text-sm" style={{ color: 'var(--v-text-muted)' }}>Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 relative z-10">
        <Link href="/account" className="flex items-center gap-1 text-xs transition-colors mb-6" style={{ color: 'var(--v-text-muted)' }}>
          <ArrowLeft className="w-3 h-3" /> Back to Account
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: 'var(--v-text)' }}>
            <span className="font-serif-italic gradient-text">Order</span> history
          </h1>

          {orders.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
              <Package className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--v-text-dim)' }} />
              <p className="text-sm mb-4" style={{ color: 'var(--v-text-muted)' }}>No orders yet</p>
              <Link href="/shop" className="text-xs underline" style={{ color: 'var(--v-text-secondary)' }}>Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order.id} href={`/account/orders/${order.id}`}>
                  <div className="rounded-2xl p-5 sm:p-6 transition-all hover:border-[var(--v-border-hover)] cursor-pointer"
                    style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono" style={{ color: 'var(--v-text-secondary)' }}>
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                          style={{ backgroundColor: `${statusColors[order.status]}20`, color: statusColors[order.status] }}>
                          {order.status}
                        </span>
                      </div>
                      <span className="text-sm font-mono font-bold gradient-text">
                        ${(order.total / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--v-text-dim)' }}>
                      <span>{order.order_items?.length || 0} item(s)</span>
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
