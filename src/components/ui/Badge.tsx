import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'featured' | 'sale' | 'preorder' | 'default';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    featured: 'glassy-3d glassy-3d-featured',
    sale: 'glassy-3d glassy-3d-sale',
    preorder: 'glassy-3d glassy-3d-featured', // reuse featured color scheme
    default: 'glassy-3d text-white/60',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
