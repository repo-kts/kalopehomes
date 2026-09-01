'use client';

import { useRef } from 'react';

import { Reveal } from '@/components/reveal';
import { reviews } from '@/lib/site-content';
import { delay } from '@/lib/motion';
import { useAutoScroll } from '@/lib/use-auto-scroll';

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="text-accent-deep flex shrink-0 gap-0.5 text-[11px]"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true" className={n <= rating ? '' : 'opacity-25'}>
          ★
        </span>
      ))}
    </div>
  );
}

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
 * T-08 · Reviews.
 *
 * A real scroll container that also drifts on its own, rather than a CSS
 * animation the visitor cannot touch. That way the strip moves unprompted but
 * swiping, dragging, the wheel, the arrows and the keyboard all still work.
 *
 * The list is rendered twice and the scroll position wraps at the halfway
 * mark, so the loop is seamless in both directions. Drift pauses on hover and
 * focus, and for a few seconds after any touch or wheel input, so a quote can
 * always be read to the end.
 *
 * The quotes in `lib/site-content.ts` are placeholders, not real customers.
 */
export function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { hold, handlers } = useAutoScroll(trackRef);

  function step(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    hold();
    const card = el.querySelector<HTMLElement>('[data-card]');
    const distance = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direction * distance, behavior: reduced ? 'auto' : 'smooth' });
  }

  return (
    <Reveal id="reviews" className="bg-ink text-paper py-16 md:py-20">
      <div className="mb-8 flex items-end justify-between gap-6 px-6 sm:px-10 md:mb-12 md:px-12">
        <div>
          <div className="kh-fade-up mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4">
            <span className="bg-accent h-0.5 w-9 shrink-0 sm:w-14" />
            <span className="text-muted-dim text-[10px] tracking-[0.16em] uppercase sm:text-xs sm:tracking-[0.28em]">
              In their words
            </span>
          </div>
          <h2 className="kh-fade-up font-display text-[clamp(2.25rem,5vw,4rem)] font-normal">
            Customer reviews
          </h2>
        </div>

        <div className="kh-fade-up hidden shrink-0 gap-2 sm:flex" style={delay(0.2)}>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous review"
            className="border-rule-dark text-paper hover:bg-accent hover:border-accent hover:text-ink flex size-11 items-center justify-center border transition-colors duration-300"
          >
            <Arrow direction="prev" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next review"
            className="border-rule-dark text-paper hover:bg-accent hover:border-accent hover:text-ink flex size-11 items-center justify-center border transition-colors duration-300"
          >
            <Arrow direction="next" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="Customer reviews, scrollable"
        {...handlers}
        className="kh-swipe kh-edge-fade flex overflow-x-auto px-6 sm:px-10 md:px-12"
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex" aria-hidden={copy === 1 || undefined}>
            {reviews.map((review) => (
              <li
                key={review.quote}
                data-card
                className="mr-4 w-[17.5rem] shrink-0 sm:mr-5 sm:w-[22rem]"
              >
                <figure className="bg-paper-deep flex h-full flex-col rounded-2xl p-7 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      aria-hidden="true"
                      className="text-accent-deep font-display text-[38px] leading-[0.7]"
                    >
                      &ldquo;
                    </span>
                    <Stars rating={review.rating} />
                  </div>

                  <blockquote className="text-ink/85 font-display mt-4 flex-1 text-[16px] leading-[1.6]">
                    {review.quote}
                  </blockquote>

                  <figcaption className="border-rule mt-7 flex items-start gap-3.5 border-t pt-5">
                    <span className="bg-teal-deep text-paper font-display flex size-10 shrink-0 items-center justify-center rounded-full text-[14px]">
                      {review.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="text-ink font-display block text-[15.5px] leading-snug">
                        {review.name}
                      </span>
                      <span className="text-muted mt-1 block text-[12px] leading-snug">
                        {review.meta}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </Reveal>
  );
}
