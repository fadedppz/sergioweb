'use client';

import Link from 'next/link';

const footerLinks = {
  Web: [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Build Yours', href: '/build' },
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
  return (
    <footer className="relative border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold tracking-[0.15em] text-white mb-1">VANDAL</h3>
            <span className="text-[10px] text-white/20 tracking-wider">®</span>
            <p className="text-sm text-white/30 mt-4 leading-relaxed max-w-xs">
              Premium Surron electric motorcycles and performance parts. The future of off-road.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-medium mb-6">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white transition-colors duration-300"
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
        <div className="mt-20 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">© 2025 VANDAL. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/faq" className="text-xs text-white/20 hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="/faq" className="text-xs text-white/20 hover:text-white/50 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
