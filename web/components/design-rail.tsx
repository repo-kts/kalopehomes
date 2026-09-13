'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Reveal } from '@/components/reveal';
import type { DesignItem } from '@/lib/design-items';
import { delay } from '@/lib/motion';

function Arrow({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg width="15" height="10" viewBox="0 0 15 10" aria-hidden="true" fill="none">
      <path
        d={direction === 'next' ? 'M0 5h13M9 1l4 4-4 4' : 'M15 5H2M6 1 2 5l4 4'}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The browse-and-enquire rail on a category page.
 *
 * Deliberately not auto-scrolling: this is a list someone is choosing from,
 * and a shelf that moves while you are reading it is hostile. Arrows on
 * desktop, snap-swipe on touch.
 *
 * Each card carries two separate links — the card body opens the design, the
 * button goes straight to booking. They are siblings rather than nested,
 * since an anchor inside an anchor is invalid and browsers resolve it
 * unpredictably.
 */
export function DesignRail({ items, heading }: { items: DesignItem[]; heading: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync]);

  function step(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const stride = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direction * stride, behavior: reduced ? 'auto' : 'smooth' });
  }

  return (
    <Reveal className="bg-paper-deep py-16 md:py-20">
      <div className="mx-auto max-w-[76rem]">
        <div className="mb-7 flex items-end justify-between gap-6 px-6 sm:px-10 md:px-12">
          <div>
            <div className="kh-fade-up mb-4 flex items-center gap-3 sm:gap-4">
              <span className="bg-accent h-0.5 w-9 shrink-0 sm:w-14" />
              <span className="text-muted text-[10px] tracking-[0.16em] uppercase sm:text-xs sm:tracking-[0.28em]">
                Most requested
              </span>
            </div>
            <h2 className="kh-fade-up font-display text-[clamp(1.75rem,4vw,2.75rem)] font-normal">
              {heading}
            </h2>
          </div>

          <div className="kh-fade-up hidden shrink-0 gap-2 sm:flex" style={delay(0.15)}>
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Previous designs"
              className="border-rule text-ink hover:bg-ink hover:border-ink hover:text-paper flex size-11 items-center justify-center rounded-full border transition-colors duration-300 disabled:pointer-events-none disabled:opacity-30"
            >
              <Arrow direction="prev" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="Next designs"
              className="border-rule text-ink hover:bg-ink hover:border-ink hover:text-paper flex size-11 items-center justify-center rounded-full border transition-colors duration-300 disabled:pointer-events-none disabled:opacity-30"
            >
              <Arrow direction="next" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          onScroll={sync}
          tabIndex={0}
          role="region"
          aria-label={`${heading}, scrollable`}
          className="kh-swipe flex snap-x snap-mandatory overflow-x-auto px-6 pb-1 sm:px-10 md:px-12"
        >
          {items.map((item, i) => (
            <article
              key={item.slug}
              data-card
              className="bg-paper mr-4 flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl sm:w-[20rem] lg:w-[22rem]"
            >
              <Link
                href={`/design/${item.category}/${item.slug}`}
                className="group kh-fade-up block"
                style={delay((i % 4) * 0.07)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 78vw, 22rem"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <h3 className="text-ink group-hover:text-accent-deep line-clamp-2 px-5 pt-4 text-[15px] leading-snug font-medium transition-colors duration-300">
                  {item.title}
                </h3>
              </Link>

              <div className="mt-auto px-5 pt-3 pb-5">
                <Link
                  href="/#book"
                  className="border-accent-deep text-accent-deep hover:bg-accent-deep hover:text-paper block rounded-full border py-3 text-center text-[12px] tracking-[0.1em] transition-colors duration-300"
                >
                  Book free consultation
                </Link>
              </div>
            </article>
          ))}
          <div aria-hidden="true" className="w-2 shrink-0" />
        </div>
      </div>
    </Reveal>
  );
}
