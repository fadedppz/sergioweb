'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useTheme } from '@/lib/theme-store';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  Settings, ScrollText, ArrowLeft, Loader2, LogOut, Sun, Moon
} from 'lucide-react';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/logs', label: 'Audit Logs', icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isAdmin, isLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else if (!isAdmin) {
        router.push('/');
      } else {
        setAuthorized(true);
      }
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--v-text-muted)' }} />
          <span className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Verifying access...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--v-bg)' }}>
      
      {/* ═══════════════════════════════════
          ADMIN TOP NAVBAR
          ═══════════════════════════════════ */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b sticky top-0 z-50 backdrop-blur-xl" 
        style={{ borderColor: 'var(--v-border)', backgroundColor: 'var(--v-bg-surface)' }}>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_#00D4FF]" style={{ backgroundColor: '#00D4FF' }} />
          <span className="text-sm font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--v-text)' }}>
            Eclipse Electric <span style={{ color: '#00D4FF' }}>Admin</span>
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-all duration-300 hover:opacity-80"
            style={{ color: 'var(--v-text-secondary)' }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-[18px] h-[18px]" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-[18px] h-[18px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Return as Shopper */}
          <Link 
            href="/"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--v-bg-card)', color: 'var(--v-text)', border: '1px solid var(--v-border-hover)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return as Shopper
          </Link>
          
          <div className="flex items-center gap-3 pl-3 sm:pl-5 border-l" style={{ borderColor: 'var(--v-border)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm"
              style={{ backgroundColor: 'var(--v-btn-primary-bg)', color: 'var(--v-btn-primary-text)' }}>
              {(profile?.full_name || user?.email || 'A')[0].toUpperCase()}
            </div>
            <button onClick={() => signOut()} className="p-1.5 rounded-full transition-colors hover:bg-red-500/10 text-red-400" aria-label="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r py-6 px-4 overflow-y-auto" style={{ borderColor: 'var(--v-border)' }}>
          <nav className="flex-1 space-y-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-medium transition-all ${
                    isActive ? 'bg-[rgba(0,212,255,0.08)] shadow-[inset_2px_0_0_#00D4FF]' : 'hover:bg-[var(--v-bg-card)]'
                  }`}
                  style={{ color: isActive ? '#00D4FF' : 'var(--v-text-muted)' }}>
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Admin Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-2 py-2 flex items-center justify-around"
          style={{ backgroundColor: 'var(--v-bg-surface)', borderColor: 'var(--v-border)' }}>
          {adminLinks.slice(0, 5).map((link) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}
                className="flex flex-col items-center gap-1 p-2 rounded-lg text-[9px] transition-colors"
                style={{ color: isActive ? '#00D4FF' : 'var(--v-text-dim)' }}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
