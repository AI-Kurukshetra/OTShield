'use client';

import React from 'react';
import { cn } from '@/src/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

const iconClassName = 'w-4 h-4';

export const PrimaryButton = ({ icon: Icon, children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        'flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-black rounded-2xl text-sm font-bold hover:bg-brand-primary/90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)]',
        className,
      )}
      {...props}
    >
      {Icon && <Icon className={iconClassName} />}
      {children}
    </button>
  );
};

export const SecondaryButton = ({ icon: Icon, children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        'flex items-center gap-2 px-5 py-2.5 bg-brand-card/40 border border-brand-border/50 rounded-2xl text-sm font-bold text-zinc-300 hover:bg-brand-card/60 transition-all',
        className,
      )}
      {...props}
    >
      {Icon && <Icon className={iconClassName} />}
      {children}
    </button>
  );
};
