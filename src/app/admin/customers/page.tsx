'use client';

import { useState, useEffect } from 'react';
import { Search, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Customer {
  id: string; email: string; full_name: string; role: string; created_at: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }: { data: Customer[] | null }) => { setCustomers(data || []); setLoading(false); });
  }, []);

  const filtered = customers.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--v-text)' }}>Customers ({customers.length})</h1>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v-text-dim)' }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none"
          style={{ backgroundColor: 'var(--v-input-bg)', border: '1px solid var(--v-border)', color: 'var(--v-text)' }} />
      </div>
      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-2xl p-4 flex items-center justify-between"
            style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: 'var(--v-btn-primary-bg)', color: 'var(--v-btn-primary-text)' }}>
                {(c.full_name || c.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--v-text)' }}>{c.full_name || 'No name'}</p>
                <p className="text-[10px] flex items-center gap-1" style={{ color: 'var(--v-text-dim)' }}>
                  <Mail className="w-3 h-3" /> {c.email}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: c.role === 'admin' ? 'rgba(0,212,255,0.15)' : 'var(--v-bg-card)', color: c.role === 'admin' ? '#00D4FF' : 'var(--v-text-dim)' }}>
                {c.role}
              </span>
              <p className="text-[10px] mt-1" style={{ color: 'var(--v-text-dim)' }}>{new Date(c.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
