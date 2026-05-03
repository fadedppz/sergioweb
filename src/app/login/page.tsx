'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-store';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const validateFields = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!resetMode) {
      if (!password) {
        errors.password = 'Password is required';
      } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateFields()) return;

    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    if (signInError) { setError(signInError); setLoading(false); }
    else { router.push(redirect); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateFields()) return;

    setResetLoading(true);
    const { error: resetError } = await resetPassword(email);
    if (resetError) {
      setError(resetError);
    } else {
      setResetSent(true);
    }
    setResetLoading(false);
  };

  const inputStyles: React.CSSProperties = {
    backgroundColor: 'var(--v-input-bg)', border: '1px solid var(--v-border)', color: 'var(--v-text)',
  };

  const errorInputStyles: React.CSSProperties = {
    ...inputStyles,
    border: '1px solid rgba(239,68,68,0.5)',
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md px-4 relative z-10">
        <div className="text-center mb-8">
          <AnimatePresence mode="wait">
            {resetMode ? (
              <motion.div key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--v-text)' }}>
                  <span className="font-serif-italic gradient-text">Reset</span> password
                </h1>
                <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>We&apos;ll send you a link to reset your password</p>
              </motion.div>
            ) : (
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--v-text)' }}>
                  <span className="font-serif-italic gradient-text">Welcome</span> back
                </h1>
                <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Sign in to your Eclipse Electric account</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form 
          onSubmit={resetMode ? handleResetPassword : handleSubmit} 
          noValidate
          className="rounded-2xl p-6 sm:p-8 space-y-5" 
          style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}
        >
          {/* Global error */}
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

          {/* Reset success */}
          <AnimatePresence>
            {resetSent && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" 
                style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />Check your email for a password reset link!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: fieldErrors.email ? '#ef4444' : 'var(--v-text-dim)' }} />
              <input 
                type="email" value={email} 
                onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: undefined })); }}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none transition-colors" 
                style={fieldErrors.email ? errorInputStyles : inputStyles} 
                placeholder="you@email.com" autoComplete="email" 
              />
            </div>
            <AnimatePresence>
              {fieldErrors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="text-[11px] mt-1.5 ml-1" style={{ color: '#ef4444' }}
                >
                  {fieldErrors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password (hidden in reset mode) */}
          <AnimatePresence>
            {!resetMode && (
              <motion.div initial={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden">
                <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: fieldErrors.password ? '#ef4444' : 'var(--v-text-dim)' }} />
                  <input 
                    type="password" value={password} 
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })); }}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none transition-colors" 
                    style={fieldErrors.password ? errorInputStyles : inputStyles} 
                    placeholder="Your password" autoComplete="current-password" 
                  />
                </div>
                <AnimatePresence>
                  {fieldErrors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="text-[11px] mt-1.5 ml-1" style={{ color: '#ef4444' }}
                    >
                      {fieldErrors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forgot password link */}
          {!resetMode && (
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => { setResetMode(true); setError(''); setFieldErrors({}); setResetSent(false); }}
                className="text-[11px] transition-colors hover:underline" 
                style={{ color: 'var(--v-text-muted)' }}
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Submit */}
          <Button type="submit" variant="glassy" size="lg" className="w-full" disabled={loading || resetLoading}>
            {resetMode 
              ? (resetLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>)
              : (loading ? 'Signing in...' : <>Sign In <ArrowRight className="w-4 h-4" /></>)
            }
          </Button>

          {/* Bottom links */}
          <div className="text-center space-y-2">
            {resetMode ? (
              <button 
                type="button" 
                onClick={() => { setResetMode(false); setError(''); setFieldErrors({}); setResetSent(false); }}
                className="text-xs transition-colors hover:underline" 
                style={{ color: 'var(--v-text-secondary)' }}
              >
                ← Back to sign in
              </button>
            ) : (
              <p className="text-xs" style={{ color: 'var(--v-text-dim)' }}>
                Don&apos;t have an account?{' '}
                <Link href={`/signup${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                  className="font-medium" style={{ color: 'var(--v-text-secondary)' }}>Create one</Link>
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }} />}><LoginForm /></Suspense>;
}
