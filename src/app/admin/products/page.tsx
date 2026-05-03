'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface Product {
  id: string; slug: string; name: string; price: number; stock_qty: number;
  category: string; is_featured: boolean; is_active: boolean; created_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from('products').update({ is_active: !current }).eq('id', id);
    fetchProducts();
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())
  );

  if (loading) return <div className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Loading products...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--v-text)' }}>Products ({products.length})</h1>
        <Button variant="glassy" size="sm" onClick={() => alert('Product creation form — coming in next iteration')}>
          <Plus className="w-3 h-3" /> Add Product
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v-text-dim)' }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none"
          style={{ backgroundColor: 'var(--v-input-bg)', border: '1px solid var(--v-border)', color: 'var(--v-text)' }} />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--v-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--v-border)', backgroundColor: 'var(--v-bg-card)' }}>
                <th className="text-left px-4 py-3 font-medium uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Product</th>
                <th className="text-left px-4 py-3 font-medium uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Category</th>
                <th className="text-right px-4 py-3 font-medium uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Price</th>
                <th className="text-right px-4 py-3 font-medium uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Stock</th>
                <th className="text-center px-4 py-3 font-medium uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Status</th>
                <th className="text-right px-4 py-3 font-medium uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--v-border)' }} className="transition-colors hover:bg-[var(--v-bg-card)]">
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: 'var(--v-text)' }}>{product.name}</p>
                    <p className="text-[10px] font-mono" style={{ color: 'var(--v-text-dim)' }}>{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 capitalize" style={{ color: 'var(--v-text-muted)' }}>{product.category}</td>
                  <td className="px-4 py-3 text-right font-mono" style={{ color: 'var(--v-text)' }}>
                    ${(product.price / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono ${product.stock_qty === 0 ? 'text-red-400' : product.stock_qty < 5 ? 'text-amber-400' : ''}`}
                      style={{ color: product.stock_qty >= 5 ? 'var(--v-text-secondary)' : undefined }}>
                      {product.stock_qty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(product.id, product.is_active)}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-semibold transition-colors cursor-pointer`}
                      style={{
                        backgroundColor: product.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: product.is_active ? '#10b981' : '#ef4444',
                      }}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg transition-colors hover:bg-[var(--v-bg-card)]" style={{ color: 'var(--v-text-muted)' }}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteProduct(product.id, product.name)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(239,68,68,0.1)]" style={{ color: 'var(--v-text-dim)' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
