'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Sun, Moon, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { useTheme } from '@/lib/theme-store';
import { useAuth } from '@/lib/auth-store';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/shop', label: 'SHOP', badge: '17' },
  { href: '/testimonials', label: 'TESTIMONIALS' },
  { href: '#', label: 'BUILD YOURS (Coming Soon!)' },
  { href: '/blog', label: 'INSIGHTS' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { items, setDrawerOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, profile, isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Hide global navbar on admin routes
  if (pathname?.startsWith('/admin')) return null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = () => setUserMenuOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [userMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-xl border-b'
            : 'bg-transparent'
        }`}
        style={{
          backgroundColor: scrolled ? 'var(--v-nav-bg)' : 'transparent',
          borderColor: scrolled ? 'var(--v-border-subtle)' : 'transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-lg font-bold tracking-[0.15em]" style={{ color: 'var(--v-text)' }}>
                Eclipse Electric
              </span>
              <span className="text-[10px] font-medium tracking-wider" style={{ color: 'var(--v-text-muted)' }}>®</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-300 ${link.href === '#' ? 'opacity-50 cursor-not-allowed hover:opacity-50' : 'hover:opacity-100'}`}
                  style={{ color: 'var(--v-text-secondary)' }}
                  onClick={(e) => link.href === '#' && e.preventDefault()}
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-1 text-[9px]" style={{ color: 'var(--v-text-dim)' }}>({link.badge})</span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
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

              {/* User / Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                    className="flex items-center gap-2 p-2 rounded-full transition-colors"
                    style={{ color: 'var(--v-text-secondary)' }}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: 'var(--v-btn-primary-bg)', color: 'var(--v-btn-primary-text)' }}>
                      {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-12 w-56 rounded-2xl overflow-hidden shadow-2xl z-50"
                        style={{ backgroundColor: 'var(--v-bg-elevated)', border: '1px solid var(--v-border)' }}
                      >
                        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--v-border)' }}>
                          <p className="text-xs font-medium truncate" style={{ color: 'var(--v-text)' }}>
                            {profile?.full_name || 'User'}
                          </p>
                          <p className="text-[10px] truncate" style={{ color: 'var(--v-text-dim)' }}>
                            {user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-xs transition-colors hover:bg-[var(--v-bg-card)]"
                            style={{ color: 'var(--v-text-secondary)' }} onClick={() => setUserMenuOpen(false)}>
                            <User className="w-3.5 h-3.5" /> My Account
                          </Link>
                          <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2.5 text-xs transition-colors hover:bg-[var(--v-bg-card)]"
                            style={{ color: 'var(--v-text-secondary)' }} onClick={() => setUserMenuOpen(false)}>
                            <ShoppingBag className="w-3.5 h-3.5" /> Order History
                          </Link>
                          {isAdmin && (
                            <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-xs transition-colors hover:bg-[var(--v-bg-card)]"
                              style={{ color: '#00D4FF' }} onClick={() => setUserMenuOpen(false)}>
                              <LayoutDashboard className="w-3.5 h-3.5" /> Admin Dashboard
                            </Link>
                          )}
                        </div>
                        <div style={{ borderTop: '1px solid var(--v-border)' }}>
                          <button onClick={() => { signOut(); setUserMenuOpen(false); }}
                            className="flex items-center gap-3 px-4 py-2.5 text-xs w-full transition-colors hover:bg-[var(--v-bg-card)]"
                            style={{ color: 'var(--v-text-muted)' }}>
                            <LogOut className="w-3.5 h-3.5" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-[11px] uppercase tracking-[0.1em] font-medium rounded-full transition-colors"
                  style={{ color: 'var(--v-text-secondary)', border: '1px solid var(--v-border)' }}>
                  <User className="w-3.5 h-3.5" /> Sign In
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative p-2 transition-colors"
                style={{ color: 'var(--v-text-secondary)' }}
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--v-btn-primary-bg)', color: 'var(--v-btn-primary-text)' }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 transition-colors"
                style={{ color: 'var(--v-text-secondary)' }}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 backdrop-blur-2xl" style={{ backgroundColor: 'var(--v-overlay)' }} />
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative z-10 flex flex-col items-center justify-center h-full gap-8"
            >
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (link.href === '#') {
                        e.preventDefault();
                      } else {
                        setMobileOpen(false);
                      }
                    }}
                    className={`text-2xl font-light tracking-[0.1em] transition-colors ${link.href === '#' ? 'opacity-50 cursor-not-allowed hover:opacity-50' : 'hover:opacity-100'}`}
                    style={{ color: 'var(--v-text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Auth links in mobile */}
              {user ? (
                <>
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Link href="/account" onClick={() => setMobileOpen(false)}
                      className="text-lg font-light tracking-[0.1em]" style={{ color: 'var(--v-text-secondary)' }}>
                      MY ACCOUNT
                    </Link>
                  </motion.div>
                  {isAdmin && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                      <Link href="/admin" onClick={() => setMobileOpen(false)}
                        className="text-lg font-light tracking-[0.1em]" style={{ color: '#00D4FF' }}>
                        ADMIN
                      </Link>
                    </motion.div>
                  )}
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="text-lg font-light tracking-[0.1em]" style={{ color: 'var(--v-text-muted)' }}>
                    SIGN OUT
                  </motion.button>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-all"
                    style={{ color: 'var(--v-text-secondary)', border: '1px solid var(--v-border)' }}>
                    <User className="w-4 h-4" /> Sign In
                  </Link>
                </motion.div>
              )}

              {/* Theme toggle in mobile */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                onClick={toggleTheme}
                className="flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-all"
                style={{ color: 'var(--v-text-secondary)', border: '1px solid var(--v-border)' }}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
