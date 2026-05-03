'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const footerLinks = {
  Web: [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Build Yours (Waitlist)', href: '/build' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  Categories: [
    { label: 'Electric Bikes', href: '/categories/bikes' },
    { label: 'Parts & Upgrades', href: '/categories/parts' },
    { label: 'Accessories', href: '/categories/accessories' },
  ],
  Support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
    { label: 'Shipping & Returns', href: '/faq' },
  ],
};

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="relative" style={{ borderTop: '1px solid var(--v-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold tracking-[0.15em] mb-1" style={{ color: 'var(--v-text)' }}>Eclipse Electric</h3>
            <span className="text-[10px] tracking-wider" style={{ color: 'var(--v-text-dim)' }}>®</span>
            <p className="text-sm mt-4 leading-relaxed max-w-xs" style={{ color: 'var(--v-text-muted)' }}>
              Premium Surron electric motorcycles and performance parts. The future of off-road.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                className="text-[10px] uppercase tracking-[0.3em] font-medium mb-4 sm:mb-6"
                style={{ color: 'var(--v-text-muted)' }}
              >
                {title}
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors duration-300 hover:opacity-80`}
                      style={{ color: 'var(--v-text-secondary)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 sm:mt-20 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--v-border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--v-text-dim)' }}>© 2025 Eclipse Electric. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/faq" className="text-xs transition-colors hover:opacity-80" style={{ color: 'var(--v-text-dim)' }}>Privacy</Link>
            <Link href="/faq" className="text-xs transition-colors hover:opacity-80" style={{ color: 'var(--v-text-dim)' }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
