'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  /** Play on mount instead of waiting for the section to scroll into view. */
  immediate?: boolean;
  /** How much of the section must be visible before it plays. */
  threshold?: number;
};

/**
 * Wraps a section and flips `data-shown` to `true` once it enters the
 * viewport. Descendants carrying a `kh-*` class animate off that flag, so
 * the markup itself stays static and server-rendered.
 */
export function Reveal({
  id,
  className,
  children,
  immediate = false,
  threshold = 0.22,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (immediate) {
      const timer = setTimeout(() => setShown(true), 150);
      return () => clearTimeout(timer);
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate, threshold]);

  return (
    <section id={id} ref={ref} data-shown={shown} className={className}>
      {children}
    </section>
  );
}
