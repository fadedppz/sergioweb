'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface AuditLog {
  id: string; admin_email: string; action: string; target_type: string;
  target_id: string; details: Record<string, unknown>; created_at: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('admin_audit_logs').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data }: { data: AuditLog[] | null }) => { setLogs(data || []); setLoading(false); });
  }, []);

  if (loading) return <div className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--v-text)' }}>Audit Logs</h1>
      {logs.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: 'var(--v-text-dim)' }}>No audit logs yet.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--v-text)' }}>
                  <span className="font-mono px-1.5 py-0.5 rounded text-[10px] mr-2" style={{ backgroundColor: 'var(--v-bg-elevated)', color: '#00D4FF' }}>
                    {log.action}
                  </span>
                  {log.target_type && <span style={{ color: 'var(--v-text-muted)' }}>{log.target_type} {log.target_id?.slice(0, 8)}</span>}
                </p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--v-text-dim)' }}>by {log.admin_email}</p>
              </div>
              <span className="text-[10px] shrink-0" style={{ color: 'var(--v-text-dim)' }}>
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
