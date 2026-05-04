'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Supabase updates the user's password using the active session.
  // The user should already have an active session from the email link click (via auth/callback).
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    }
  };

  const inputStyles: React.CSSProperties = {
    backgroundColor: 'var(--v-input-bg)',
    border: '1px solid var(--v-border)',
    color: 'var(--v-text)',
  };

  if (success) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="vignette-glow" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10 px-4">
          <div className="rounded-2xl p-10" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <CheckCircle2 className="w-12 h-12 text-emerald-400/60 mx-auto mb-6" />
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--v-text)' }}>Password Updated</h2>
            <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Redirecting you to your account...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md px-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--v-text)' }}>
            <span className="font-serif-italic gradient-text">Reset</span> Password
          </h1>
          <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="rounded-2xl p-6 sm:p-8 space-y-5" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" 
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v-text-dim)' }} />
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none transition-colors" 
                style={inputStyles} placeholder="Min 6 characters" autoComplete="new-password" 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v-text-dim)' }} />
              <input 
                type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none transition-colors" 
                style={inputStyles} placeholder="Confirm new password" autoComplete="new-password" 
              />
            </div>
          </div>

          <Button type="submit" variant="glassy" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : <>Update Password <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }} />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
