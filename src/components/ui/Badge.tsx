import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'featured' | 'sale' | 'preorder' | 'default';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    featured: 'bg-white/[0.06] text-white/80 border-white/[0.08]',
    sale: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/20',
    preorder: 'bg-[#7B2FFF]/10 text-[#7B2FFF] border-[#7B2FFF]/20',
    default: 'bg-white/[0.04] text-white/60 border-white/[0.06]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
