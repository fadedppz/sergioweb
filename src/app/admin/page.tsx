'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  ordersToday: number;
  recentOrders: Array<{ id: string; total: number; status: string; created_at: string; shipping_name: string }>;
  lowStockProducts: Array<{ id: string; name: string; stock_qty: number }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const supabase = createClient();

    // Fetch in parallel
    const [ordersRes, customersRes, productsRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
      supabase.from('products').select('id, name, stock_qty').lt('stock_qty', 5).order('stock_qty', { ascending: true }),
    ]);

    const orders = ordersRes.data || [];
    const today = new Date().toISOString().split('T')[0];
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const ordersToday = orders.filter(o => o.created_at?.startsWith(today)).length;

    setStats({
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: customersRes.count || 0,
      ordersToday,
      recentOrders: orders.slice(0, 5),
      lowStockProducts: (productsRes.data || []) as Array<{ id: string; name: string; stock_qty: number }>,
    });
    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-sm" style={{ color: 'var(--v-text-muted)' }}>Loading dashboard...</div>;
  }

  const statCards = [
    { label: 'Total Revenue', value: `$${((stats?.totalRevenue || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: '#10b981' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: '#3b82f6' },
    { label: 'Customers', value: stats?.totalCustomers || 0, icon: Users, color: '#8b5cf6' },
    { label: 'Orders Today', value: stats?.ordersToday || 0, icon: TrendingUp, color: '#f59e0b' },
  ];

  const statusColors: Record<string, string> = {
    pending: '#f59e0b', paid: '#3b82f6', processing: '#8b5cf6',
    shipped: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444', refunded: '#6b7280',
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--v-text)' }}>
        <span className="font-serif-italic gradient-text">Admin</span> Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl p-4 sm:p-5" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: 'var(--v-text-dim)' }}>{stat.label}</span>
            </div>
            <p className="text-xl sm:text-2xl font-mono font-bold" style={{ color: 'var(--v-text)' }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--v-text)' }}>Recent Orders</h3>
          {(stats?.recentOrders || []).length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--v-text-dim)' }}>No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--v-border)' }}>
                  <div>
                    <p className="text-xs font-mono" style={{ color: 'var(--v-text-secondary)' }}>#{order.id.slice(0, 8)}</p>
                    <p className="text-[10px]" style={{ color: 'var(--v-text-dim)' }}>{order.shipping_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-semibold" style={{ color: 'var(--v-text)' }}>
                      ${(order.total / 100).toFixed(2)}
                    </p>
                    <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${statusColors[order.status] || '#666'}20`, color: statusColors[order.status] || '#666' }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--v-text)' }}>
            <AlertTriangle className="w-4 h-4 inline mr-2" style={{ color: '#f59e0b' }} />
            Low Stock
          </h3>
          {(stats?.lowStockProducts || []).length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--v-text-dim)' }}>All products are well stocked.</p>
          ) : (
            <div className="space-y-3">
              {stats?.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--v-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--v-text-secondary)' }}>{product.name}</span>
                  <span className={`text-xs font-mono font-bold ${product.stock_qty === 0 ? 'text-red-400' : 'text-amber-400'}`}>
                    {product.stock_qty} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
