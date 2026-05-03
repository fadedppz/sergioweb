'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-store';

function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const validateFields = () => {
    const errors: { name?: string; email?: string; password?: string } = {};
    if (!fullName.trim()) errors.name = 'Full name is required';
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateFields()) return;

    setLoading(true);
    const { error: err } = await signUp(email, password, fullName);
    if (err) { setError(err); setLoading(false); }
    else { setSuccess(true); setLoading(false); setTimeout(() => router.push(redirect), 2000); }
  };

  const inputStyles: React.CSSProperties = { backgroundColor: 'var(--v-input-bg)', border: '1px solid var(--v-border)', color: 'var(--v-text)' };
  const errorInputStyles: React.CSSProperties = { ...inputStyles, border: '1px solid rgba(239,68,68,0.5)' };

  if (success) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="vignette-glow" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10 px-4">
          <div className="rounded-2xl p-10" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
            <CheckCircle className="w-12 h-12 text-emerald-400/60 mx-auto mb-6" />
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--v-text)' }}>Account Created</h2>
            <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Check your email to confirm. Redirecting...</p>
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
            <span className="font-serif-italic gradient-text">Create</span> account
          </h1>
          <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Join Eclipse Electric to start ordering</p>
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

          {/* Full Name */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: fieldErrors.name ? '#ef4444' : 'var(--v-text-dim)' }} />
              <input type="text" value={fullName} onChange={(e) => { setFullName(e.target.value); setFieldErrors(prev => ({ ...prev, name: undefined })); }}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none transition-colors" style={fieldErrors.name ? errorInputStyles : inputStyles} placeholder="Your full name" autoComplete="name" />
            </div>
            <AnimatePresence>
              {fieldErrors.name && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="text-[11px] mt-1.5 ml-1" style={{ color: '#ef4444' }}>{fieldErrors.name}</motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Email */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: fieldErrors.email ? '#ef4444' : 'var(--v-text-dim)' }} />
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: undefined })); }}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none transition-colors" style={fieldErrors.email ? errorInputStyles : inputStyles} placeholder="you@email.com" autoComplete="email" />
            </div>
            <AnimatePresence>
              {fieldErrors.email && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="text-[11px] mt-1.5 ml-1" style={{ color: '#ef4444' }}>{fieldErrors.email}</motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: fieldErrors.password ? '#ef4444' : 'var(--v-text-dim)' }} />
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })); }}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none transition-colors" style={fieldErrors.password ? errorInputStyles : inputStyles} placeholder="Min 6 characters" autoComplete="new-password" />
            </div>
            <AnimatePresence>
              {fieldErrors.password && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="text-[11px] mt-1.5 ml-1" style={{ color: '#ef4444' }}>{fieldErrors.password}</motion.p>
              )}
            </AnimatePresence>
          </div>

          <Button type="submit" variant="glassy" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}<ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-center text-xs" style={{ color: 'var(--v-text-dim)' }}>
            Already have an account?{' '}
            <Link href={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="font-medium" style={{ color: 'var(--v-text-secondary)' }}>Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default function SignUpPage() {
  return <Suspense fallback={<div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }} />}><SignUpForm /></Suspense>;
}
