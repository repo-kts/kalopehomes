'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Reveal } from '@/components/reveal';
import { projects } from '@/lib/site-content';
import { delay } from '@/lib/motion';
import { useAutoScroll } from '@/lib/use-auto-scroll';

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
 * T-02 · Blind reveal, as a drifting swipe track.
 *
 * The row scrolls on its own but stays fully under the visitor's control —
 * see `useAutoScroll`. The list is rendered twice so the loop is seamless, and
 * cards carry their own right margin rather than a flex `gap`: with a gap, the
 * halfway wrap point lands half a gap out and the loop jumps each cycle.
 *
 * Below `sm`, cards away from centre scale down and dim so the row reads as a
 * deck. That is driven by scroll position rather than a timer, so it tracks
 * the finger and reverses when the visitor swipes back.
 */
export function Projects() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { hold, handlers } = useAutoScroll(trackRef);
  const [active, setActive] = useState(0);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-card]'));
    if (cards.length < 2) return;

    // Measured rather than assumed, so it survives the margin changing at `sm`.
    const stride = cards[1].offsetLeft - cards[0].offsetLeft;
    if (stride > 0) {
      setActive(Math.round(el.scrollLeft / stride) % projects.length);
    }

    const deck = window.matchMedia('(max-width: 639px)').matches;
    const middle = el.scrollLeft + el.clientWidth / 2;
    for (const card of cards) {
      if (!deck) {
        card.style.transform = '';
        card.style.opacity = '';
        continue;
      }
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle);
      const away = Math.min(1, distance / card.offsetWidth);
      card.style.transform = `scale(${(1 - away * 0.13).toFixed(4)})`;
      card.style.opacity = (1 - away * 0.45).toFixed(3);
    }
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync]);

  function step(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    hold();
    const cards = el.querySelectorAll<HTMLElement>('[data-card]');
    const distance =
      cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : el.clientWidth * 0.8;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direction * distance, behavior: reduced ? 'auto' : 'smooth' });
  }

  return (
    <Reveal id="projects" className="bg-ink text-paper py-16 md:py-20">
      <div className="mb-8 flex items-end justify-between gap-6 px-6 sm:px-10 md:mb-12 md:px-12">
        <div>
          <div className="kh-fade-up mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4">
            <span className="bg-accent h-0.5 w-9 shrink-0 sm:w-14" />
            <span className="text-muted-dim text-[10px] tracking-[0.16em] uppercase sm:text-xs sm:tracking-[0.28em]">
              Our work
            </span>
          </div>
          <h2 className="kh-fade-up font-serif text-[clamp(2.25rem,5vw,4rem)] font-normal">
            Selected projects
          </h2>
        </div>

        <div className="kh-fade-up hidden shrink-0 gap-2 sm:flex" style={delay(0.2)}>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous project"
            className="border-rule-dark text-paper hover:bg-accent hover:border-accent hover:text-ink flex size-11 items-center justify-center border transition-colors duration-300"
          >
            <Arrow direction="prev" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next project"
            className="border-rule-dark text-paper hover:bg-accent hover:border-accent hover:text-ink flex size-11 items-center justify-center border transition-colors duration-300"
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
        aria-label="Selected projects, scrollable"
        {...handlers}
        className="kh-swipe flex snap-x snap-mandatory overflow-x-auto px-[8vw] sm:px-10 md:px-12"
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1 || undefined}>
            {projects.map((project, i) => {
              const base = i * 0.15;
              return (
                <article
                  key={project.name}
                  data-card
                  className="group relative mr-3 w-[84vw] shrink-0 snap-center will-change-transform sm:mr-5 sm:w-[58vw] sm:snap-start lg:w-[27rem]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[3/2]">
                    <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                      <Image
                        src={project.src}
                        alt={project.alt}
                        fill
                        sizes="(max-width: 640px) 84vw, (max-width: 1024px) 58vw, 27rem"
                        className="object-cover"
                      />
                    </div>

                    {/* Three blinds lift off each photo in turn. */}
                    <div className="pointer-events-none absolute inset-0 z-[5] flex flex-col">
                      {[0, 1, 2].map((b) => (
                        <div
                          key={b}
                          className="kh-blind bg-ink flex-1"
                          style={delay(base + b * 0.12)}
                        />
                      ))}
                    </div>
                  </div>

                  <div
                    className="kh-fade-up border-rule-dark mt-4 flex items-baseline justify-between gap-4 border-t pt-3.5"
                    style={delay(base + 0.24)}
                  >
                    <div>
                      <h3 className="font-serif text-[20px] sm:text-[21px]">{project.name}</h3>
                      <p className="text-muted-light mt-1 text-[13px]">{project.meta}</p>
                    </div>
                    <span className="text-accent font-serif text-[15px]">{project.num}</span>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </div>

      {/* Swipe affordance and position, phones only. */}
      <div aria-hidden="true" className="mt-6 flex gap-1.5 px-[8vw] sm:hidden">
        {projects.map((project, i) => (
          <span
            key={project.name}
            className={`h-0.5 flex-1 transition-colors duration-500 ${
              i === active ? 'bg-accent' : 'bg-rule-dark'
            }`}
          />
        ))}
      </div>
    </Reveal>
  );
}
