import type { CSSProperties } from 'react';

/**
 * Stagger helper. The `kh-*` animation classes in `globals.css` read their
 * delay from the `--kh-d` custom property.
 */
export function delay(seconds: number): CSSProperties {
  return { '--kh-d': `${seconds}s` } as CSSProperties;
}
