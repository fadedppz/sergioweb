'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AccountConfirmedPage() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10 px-4 max-w-md">
        <div className="rounded-2xl p-10" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
          <CheckCircle className="w-16 h-16 text-emerald-400/80 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--v-text)' }}>Account Confirmed!</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--v-text-muted)' }}>
            Your email has been successfully verified. You now have full access to Eclipse Electric.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/account">
              <Button variant="glassy" size="lg" className="w-full">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" size="lg" className="w-full">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
