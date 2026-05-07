'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionChecking, setSessionChecking] = useState(true);
  const [noSession, setNoSession] = useState(false);
  const router = useRouter();
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  // Wait for the session to be available — the user arrives here via
  // /auth/callback which exchanges the code and sets session cookies.
  // We also listen for the PASSWORD_RECOVERY auth event as a signal.
  useEffect(() => {
    let mounted = true;

    // Listen for auth state changes (PASSWORD_RECOVERY event)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: { user: unknown } | null) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setSessionReady(true);
        setSessionChecking(false);
      }
    });

    // Also check if session already exists (user may have already been authed by the callback)
    const checkSession = async () => {
      // Small delay to let the auth state listener fire first
      await new Promise(r => setTimeout(r, 500));
      if (!mounted) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
        setSessionChecking(false);
      } else {
        // Give a bit more time for the auth callback cookies to propagate
        await new Promise(r => setTimeout(r, 2000));
        if (!mounted) return;
        const { data: { session: retrySession } } = await supabase.auth.getSession();
        if (retrySession) {
          setSessionReady(true);
          setSessionChecking(false);
        } else {
          setNoSession(true);
          setSessionChecking(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);
  
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

  // Loading state while checking for session
  if (sessionChecking) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="vignette-glow" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center relative z-10 px-4">
          <div className="rounded-2xl p-10" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--v-text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Verifying your reset link...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // No valid session found — link expired or invalid
  if (noSession && !sessionReady) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="vignette-glow" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10 px-4">
          <div className="rounded-2xl p-10 max-w-md" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <AlertCircle className="w-12 h-12 mx-auto mb-6" style={{ color: '#ef4444' }} />
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--v-text)' }}>Reset Link Expired</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--v-text-muted)' }}>
              This password reset link has expired or is invalid. Please request a new one.
            </p>
            <Link href="/login">
              <Button variant="glassy" size="lg" className="w-full">
                Back to Login <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
