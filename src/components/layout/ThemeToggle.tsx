'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const sysPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    // Check if html tag already has data-theme (from our layout script)
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light';
    
    if (currentTheme) {
      setTheme(currentTheme);
    } else if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (sysPrefersLight) {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Avoid hydration mismatch by not rendering the icon until mounted
  if (!mounted) return <div className="w-9 h-9 rounded-full border" style={{ borderColor: 'var(--v-border)' }} />;

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--v-bg-card)] border overflow-hidden"
      style={{ borderColor: 'var(--v-border)' }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3, ease: 'backOut' }}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4" style={{ color: 'var(--v-text-secondary)' }} />
          ) : (
            <Sun className="w-4 h-4" style={{ color: 'var(--v-text-secondary)' }} />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
