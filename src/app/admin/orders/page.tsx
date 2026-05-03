'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Order {
  id: string; status: string; total: number; created_at: string;
  shipping_name: string; shipping_city: string; shipping_state: string;
  coupon_code: string | null; user_id: string;
  order_items: Array<{ product_name: string; quantity: number; unit_price: number }>;
}

const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const statusColors: Record<string, string> = {
  pending: '#f59e0b', paid: '#3b82f6', processing: '#8b5cf6',
  shipped: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444', refunded: '#6b7280',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const supabase = createClient();
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    fetchOrders();
  };

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search && !o.shipping_name.toLowerCase().includes(search.toLowerCase()) && !o.id.includes(search)) return false;
    return true;
  });

  if (loading) return <div className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Loading orders...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--v-text)' }}>Orders ({orders.length})</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v-text-dim)' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or ID..."
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none"
            style={{ backgroundColor: 'var(--v-input-bg)', border: '1px solid var(--v-border)', color: 'var(--v-text)' }} />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto" style={{ border: '1px solid var(--v-border)' }}>
          {['all', ...statusOptions].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-3 py-1.5 text-[10px] rounded-lg capitalize transition-all shrink-0"
              style={{
                backgroundColor: filter === s ? 'var(--v-btn-primary-bg)' : 'transparent',
                color: filter === s ? 'var(--v-btn-primary-text)' : 'var(--v-text-muted)',
                fontWeight: filter === s ? 600 : 400,
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: 'var(--v-text-dim)' }}>No orders found.</p>
        ) : filtered.map((order) => (
          <div key={order.id} className="rounded-2xl p-4 sm:p-5" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs font-mono mb-1" style={{ color: 'var(--v-text-secondary)' }}>#{order.id.slice(0, 8)}</p>
                <p className="text-sm font-medium" style={{ color: 'var(--v-text)' }}>{order.shipping_name}</p>
                <p className="text-[10px]" style={{ color: 'var(--v-text-dim)' }}>
                  {order.shipping_city}, {order.shipping_state} — {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--v-text)' }}>
                  ${(order.total / 100).toFixed(2)}
                </span>
                <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="text-[10px] font-semibold uppercase rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                  style={{
                    backgroundColor: `${statusColors[order.status]}20`,
                    color: statusColors[order.status],
                    border: `1px solid ${statusColors[order.status]}40`,
                  }}>
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {order.order_items && order.order_items.length > 0 && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--v-border)' }}>
                {order.order_items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[10px] py-0.5">
                    <span style={{ color: 'var(--v-text-muted)' }}>{item.product_name} x{item.quantity}</span>
                    <span className="font-mono" style={{ color: 'var(--v-text-dim)' }}>${(item.unit_price * item.quantity / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
