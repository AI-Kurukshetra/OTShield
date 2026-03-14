'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const SearchInput = ({
  placeholder = 'Search assets, alerts, or events...',
  value,
  onChange,
  className,
}: SearchInputProps) => {
  return (
    <div className={cn('relative w-full group', className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-brand-primary transition-colors" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-brand-card/40 border border-brand-border/50 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/5 transition-all placeholder:text-zinc-600"
      />
    </div>
  );
};
