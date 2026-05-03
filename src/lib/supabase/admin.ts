import { createClient } from '@supabase/supabase-js';

/**
 * Admin/service-role Supabase client.
 * BYPASSES Row Level Security — use only in server-side code for admin operations.
 * NEVER expose this client to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Log an admin action to the audit log.
 * Uses the service-role client to bypass RLS (audit logs are insert-only for admins).
 */
export async function logAdminAction(params: {
  adminId: string;
  adminEmail: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  const admin = createAdminClient();

  await admin.from('admin_audit_logs').insert({
    admin_id: params.adminId,
    admin_email: params.adminEmail,
    action: params.action,
    target_type: params.targetType || '',
    target_id: params.targetId || '',
    details: params.details || {},
    ip_address: params.ipAddress || '',
  });
}
