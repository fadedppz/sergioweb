import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'accent' | 'glassy';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  glow = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none';

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-sm',
  };

  const variantClasses = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    accent: 'bg-[#00D4FF] text-[#000000] font-semibold rounded-full hover:bg-[#00BFEA] hover:-translate-y-0.5',
    glassy: 'glassy-3d text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-px',
  };

  const glowClass = glow && variant === 'accent' ? 'shadow-[0_0_30px_rgba(0,212,255,0.25)]' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${glowClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
