'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('site_settings').select('*').then(({ data }: { data: Array<{ key: string; value: string }> | null }) => {
      const map: Record<string, string> = {};
      (data || []).forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
      setSettings(map);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Loading...</div>;

  const inputStyles: React.CSSProperties = { backgroundColor: 'var(--v-input-bg)', border: '1px solid var(--v-border)', color: 'var(--v-text)' };

  const fields = [
    { key: 'store_name', label: 'Store Name' },
    { key: 'store_email', label: 'Contact Email' },
    { key: 'store_phone', label: 'Phone' },
    { key: 'notification_email', label: 'Notification Email' },
    { key: 'shipping_policy', label: 'Shipping Policy', textarea: true },
    { key: 'return_policy', label: 'Return Policy', textarea: true },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--v-text)' }}>Settings</h1>
        <Button variant="glassy" size="sm" onClick={handleSave} disabled={saving}>
          <Save className="w-3 h-3" /> {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {saved && (
        <div className="mb-4 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
          Settings saved.
        </div>
      )}

      <div className="rounded-2xl p-5 sm:p-6 space-y-5" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-[10px] uppercase tracking-wider font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>{f.label}</label>
            {f.textarea ? (
              <textarea rows={3} value={settings[f.key] || ''} onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none" style={inputStyles} />
            ) : (
              <input type="text" value={settings[f.key] || ''} onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyles} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
