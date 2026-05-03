'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  Settings, ScrollText, ArrowLeft, Loader2
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
  const { user, isAdmin, isLoading } = useAuth();
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
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--v-text-muted)' }} />
          <span className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Verifying access...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen flex" style={{ backgroundColor: 'var(--v-bg)' }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r py-6 px-4" style={{ borderColor: 'var(--v-border)' }}>
        <div className="flex items-center gap-2 px-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#00D4FF]" />
          <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: '#00D4FF' }}>Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-1">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-[rgba(0,212,255,0.08)]' : 'hover:bg-[var(--v-bg-card)]'
                }`}
                style={{ color: isActive ? '#00D4FF' : 'var(--v-text-muted)' }}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs transition-colors" style={{ color: 'var(--v-text-dim)' }}>
          <ArrowLeft className="w-3 h-3" /> Back to Store
        </Link>
      </aside>

      {/* Mobile Admin Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-2 py-2 flex items-center justify-around"
        style={{ backgroundColor: 'var(--v-bg-surface)', borderColor: 'var(--v-border)' }}>
        {adminLinks.slice(0, 5).map((link) => {
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[9px] transition-colors ${isActive ? '' : ''}`}
              style={{ color: isActive ? '#00D4FF' : 'var(--v-text-dim)' }}>
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
