'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-store';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    if (signInError) { setError(signInError); setLoading(false); }
    else { router.push(redirect); }
  };

  const inputStyles: React.CSSProperties = {
    backgroundColor: 'var(--v-input-bg)', border: '1px solid var(--v-border)', color: 'var(--v-text)',
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md px-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--v-text)' }}>
            <span className="font-serif-italic gradient-text">Welcome</span> back
          </h1>
          <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Sign in to your Eclipse Electric account</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl p-6 sm:p-8 space-y-5" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v-text-dim)' }} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none" style={inputStyles} placeholder="you@email.com" autoComplete="email" />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v-text-dim)' }} />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none" style={inputStyles} placeholder="Your password" autoComplete="current-password" minLength={6} />
            </div>
          </div>
          <Button type="submit" variant="glassy" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}<ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-center text-xs" style={{ color: 'var(--v-text-dim)' }}>
            Don&apos;t have an account?{' '}
            <Link href={`/signup${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="font-medium" style={{ color: 'var(--v-text-secondary)' }}>Create one</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }} />}><LoginForm /></Suspense>;
}
