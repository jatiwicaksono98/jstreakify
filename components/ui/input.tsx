import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styling
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'dark:bg-input/30 flex w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',

        // Borders and background
        'border-black bg-white font-medium md:text-base h-12',

        // Focus ring with Zewu color
        'focus-visible:border-[#8C6239] focus-visible:ring-[1px] focus-visible:ring-[#8C6239]/50',

        // Error states
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',

        className
      )}
      {...props}
    />
  );
}

export { Input };
