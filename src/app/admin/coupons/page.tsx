'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface Coupon {
  id: string; code: string; discount_type: string; discount_value: number;
  min_order: number; max_uses: number | null; current_uses: number;
  is_active: boolean; expires_at: string | null; created_at: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discount_type: 'percentage', discount_value: 10, min_order: 0, max_uses: '' });

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setCoupons((data as Coupon[]) || []);
    setLoading(false);
  };

  const createCoupon = async () => {
    const supabase = createClient();
    await supabase.from('coupons').insert({
      code: form.code.toUpperCase().trim(),
      discount_type: form.discount_type,
      discount_value: form.discount_type === 'percentage' ? form.discount_value : form.discount_value * 100,
      min_order: form.min_order * 100,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
    });
    setShowForm(false);
    setForm({ code: '', discount_type: 'percentage', discount_value: 10, min_order: 0, max_uses: '' });
    fetchCoupons();
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    const supabase = createClient();
    await supabase.from('coupons').delete().eq('id', id);
    fetchCoupons();
  };

  const toggleActive = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from('coupons').update({ is_active: !current }).eq('id', id);
    fetchCoupons();
  };

  if (loading) return <div className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Loading...</div>;

  const inputStyles: React.CSSProperties = { backgroundColor: 'var(--v-input-bg)', border: '1px solid var(--v-border)', color: 'var(--v-text)' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--v-text)' }}>Coupons ({coupons.length})</h1>
        <Button variant="glassy" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-3 h-3" /> New Coupon
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-5 mb-6 space-y-4" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-medium mb-1 block" style={{ color: 'var(--v-text-muted)' }}>Code</label>
              <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none font-mono" style={inputStyles} placeholder="SAVE20" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-medium mb-1 block" style={{ color: 'var(--v-text-muted)' }}>Type</label>
              <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none" style={inputStyles}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-medium mb-1 block" style={{ color: 'var(--v-text-muted)' }}>Value</label>
              <input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none" style={inputStyles} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-medium mb-1 block" style={{ color: 'var(--v-text-muted)' }}>Max Uses (empty = unlimited)</label>
              <input type="text" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none" style={inputStyles} placeholder="Unlimited" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="glassy" size="sm" onClick={createCoupon} disabled={!form.code}>Create</Button>
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {coupons.map((c) => (
          <div key={c.id} className="rounded-2xl p-4 flex items-center justify-between"
            style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <div>
              <p className="text-sm font-mono font-bold" style={{ color: 'var(--v-text)' }}>{c.code}</p>
              <p className="text-[10px]" style={{ color: 'var(--v-text-muted)' }}>
                {c.discount_type === 'percentage' ? `${c.discount_value}% off` : `$${(c.discount_value / 100).toFixed(2)} off`}
                {c.max_uses && ` — ${c.current_uses}/${c.max_uses} used`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleActive(c.id, c.is_active)}
                className="px-2 py-0.5 rounded-full text-[9px] font-semibold"
                style={{ backgroundColor: c.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: c.is_active ? '#10b981' : '#ef4444' }}>
                {c.is_active ? 'Active' : 'Inactive'}
              </button>
              <button onClick={() => deleteCoupon(c.id)} className="p-1.5" style={{ color: 'var(--v-text-dim)' }}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
