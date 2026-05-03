'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function AccountPage() {
  const { user, profile, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isLoading && !user) {
    router.push('/login?redirect=/account');
    return null;
  }

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="animate-pulse text-sm" style={{ color: 'var(--v-text-muted)' }}>Loading...</div>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from('profiles').update({
      full_name: fullName.trim(),
      phone: phone.trim(),
    }).eq('id', user!.id);
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyles: React.CSSProperties = {
    backgroundColor: 'var(--v-input-bg)',
    border: '1px solid var(--v-border)',
    color: 'var(--v-text)',
  };

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-muted)' }}>Account</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-8" style={{ color: 'var(--v-text)' }}>
            <span className="font-serif-italic gradient-text">My</span> account
          </h1>

          {saved && (
            <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
              Profile updated successfully.
            </div>
          )}

          {/* Profile Card */}
          <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--v-text)' }}>Profile</h2>
              {!editing && (
                <button onClick={() => { setEditing(true); setFullName(profile?.full_name || ''); setPhone(profile?.phone || ''); }}
                  className="text-xs" style={{ color: 'var(--v-text-muted)' }}>Edit</button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyles} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyles} />
                </div>
                <div className="flex gap-3">
                  <Button variant="glassy" size="md" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="outline" size="md" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" style={{ color: 'var(--v-text-dim)' }} />
                  <span className="text-sm" style={{ color: 'var(--v-text-secondary)' }}>{profile?.full_name || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" style={{ color: 'var(--v-text-dim)' }} />
                  <span className="text-sm" style={{ color: 'var(--v-text-secondary)' }}>{user?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" style={{ color: 'var(--v-text-dim)' }} />
                  <span className="text-sm" style={{ color: 'var(--v-text-secondary)' }}>{profile?.phone || 'Not set'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/account/orders" className="rounded-2xl p-6 flex items-center justify-between group transition-all"
              style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" style={{ color: 'var(--v-text-muted)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--v-text)' }}>Order History</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--v-text-dim)' }} />
            </Link>

            {isAdmin && (
              <Link href="/admin" className="rounded-2xl p-6 flex items-center justify-between group transition-all"
                style={{ backgroundColor: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: '#00D4FF' }}>Admin Dashboard</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: '#00D4FF' }} />
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
