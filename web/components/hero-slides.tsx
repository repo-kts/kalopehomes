'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { type HeroSlide, splitHeadline } from '@/lib/hero-slides';
import { delay } from '@/lib/motion';

const ROTATE_MS = 6000;

/**
 * The hero when slides are managed in the admin.
 *
 * Renders the background, the scrims and the copy together because they are
 * interleaved by z-index, and a single slide index has to drive all of them.
 * With one slide this is static — the rotation only exists so that adding a
 * second slide in the admin actually does something.
 */
export function HeroSlides({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % slides.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const active = slides[index];
  const { lead, accent } = splitHeadline(active.title);

  return (
    <div
      className="contents"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* Backgrounds are all mounted and cross-faded, so switching does not
          flash a gap while the next image decodes. */}
      {slides.map((slide, i) => (
        <picture key={slide.id}>
          {slide.mobileImageUrl && (
            <source media="(max-width: 640px)" srcSet={slide.mobileImageUrl} />
          )}
          {/* A plain <img> inside <picture>: art direction between the desktop
              and mobile images needs a media query, and CMS hosts are unknown
              at build time so next/image could not optimize them anyway. */}
          <img
            src={slide.imageUrl}
            alt={i === index ? slide.title : ''}
            fetchPriority={i === 0 ? 'high' : 'low'}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </picture>
      ))}

      {/* Same scrims as the video hero: paper-tinted, never black. */}
      <div className="from-paper/80 via-paper/60 to-paper/40 lg:from-paper/60 lg:via-paper/25 pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r lg:to-transparent" />
      <div className="from-paper pointer-events-none absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b to-transparent" />

      <div className="relative z-10 flex flex-1 items-center px-6 pb-16 sm:px-10 md:px-12 lg:pb-20">
        <div className="max-w-[42rem]">
          {/* Keyed on the slide so the copy re-enters when the slide changes. */}
          <div key={active.id} className="kh-fade">
            <h1 className="font-display text-[clamp(1.75rem,min(5vw,7.4vh),3.75rem)] leading-[1.02] font-normal tracking-[-0.01em]">
              <span className="block overflow-hidden">
                <span className="kh-rise block" style={delay(0.7)}>
                  {lead}
                  <span className="text-accent-deep">{accent}</span>
                </span>
              </span>
            </h1>

            {active.subtitle && (
              <p
                className="kh-fade-up text-body mt-5 max-w-[26rem] text-[16px] leading-[1.65]"
                style={delay(1.05)}
              >
                {active.subtitle}
              </p>
            )}

            <div className="kh-fade-up mt-7 flex flex-wrap gap-3" style={delay(1.18)}>
              <Link
                href={active.ctaLink || '/#projects'}
                className="bg-ink text-paper hover:bg-accent hover:text-ink px-7 py-3.5 text-[12px] tracking-[0.16em] uppercase transition-colors duration-300"
              >
                {active.ctaText || 'View projects'}
              </Link>
            </div>
          </div>

          {slides.length > 1 && (
            <div className="mt-9 flex gap-2.5" role="tablist" aria-label="Hero slides">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={slide.title}
                  onClick={() => go(i)}
                  className={`h-0.5 transition-all duration-300 ${
                    i === index ? 'bg-ink w-10' : 'bg-ink/30 hover:bg-ink/60 w-5'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
