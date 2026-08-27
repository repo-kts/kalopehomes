import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

/** Simple styled native checkbox. */
export function Checkbox({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type="checkbox"
      className={cn(
        'size-4 rounded border-input text-primary accent-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    />
  );
}
