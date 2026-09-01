'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { rooms } from '@/lib/site-content';

const EASE_IN_OUT_CUBIC = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * T-06 · Room sequence — a tall section with a sticky viewport. Scroll
 * progress wipes each room over the one before it while the caption swaps.
 */
/** Time each room holds before the phone view moves to the next. */
const ROOM_MS = 4000;

/** How long auto-advance waits after someone picks a room themselves. */
const HOLD_MS = 10000;

export function RoomSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const holdUntilRef = useRef(0);
  const [room, setRoom] = useState(0);

  // Phones cycle through the rooms on their own. It only runs while the
  // section is actually on screen, and stands down for a while whenever
  // someone picks a room themselves.
  useEffect(() => {
    const el = pickerRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let visible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    const timer = window.setInterval(() => {
      if (!visible) return;
      if (Date.now() < holdUntilRef.current) return;
      if (!window.matchMedia('(max-width: 1023px)').matches) return;
      setRoom((current) => (current + 1) % rooms.length);
    }, ROOM_MS);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  const pickRoom = useCallback((index: number) => {
    setRoom(index);
    holdUntilRef.current = Date.now() + HOLD_MS;
  }, []);
  const activeRef = useRef(-1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const total = rooms.length;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!window.matchMedia('(min-width: 1024px)').matches) return;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;

      const progress = clamp01(-rect.top / travel);
      const scaled = progress * (total - 1);

      // Each room after the first wipes up from the bottom of the frame.
      for (let i = 1; i < total; i++) {
        const local = EASE_IN_OUT_CUBIC(clamp01(scaled - (i - 1)));
        const wrap = section.querySelector<HTMLElement>(`[data-room-clip="${i}"]`);
        if (wrap) wrap.style.clipPath = `inset(0 0 ${(1 - local) * 100}% 0)`;
        const img = section.querySelector<HTMLElement>(`[data-room-scale="${i}"]`);
        if (img) img.style.transform = `scale(${1.14 - 0.14 * local})`;
      }

      const first = section.querySelector<HTMLElement>('[data-room-scale="0"]');
      if (first) first.style.transform = `scale(${1 + 0.1 * clamp01(scaled)})`;

      const active = Math.min(total - 1, Math.round(scaled));
      if (active !== activeRef.current) {
        activeRef.current = active;
        section.querySelectorAll<HTMLElement>('[data-room-caption]').forEach((caption) => {
          const on = Number(caption.dataset.roomCaption) === active;
          caption.style.opacity = on ? '1' : '0';
          caption.style.transform = on ? 'translateY(0)' : 'translateY(24px)';
        });
        const counter = section.querySelector<HTMLElement>('[data-room-counter]');
        if (counter) {
          counter.textContent = `0${active + 1} / 0${total}`;
        }
      }

      const fill = section.querySelector<HTMLElement>('[data-room-progress]');
      if (fill) fill.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="rooms" ref={sectionRef} className="bg-ink-deep relative lg:h-[340vh]">
      {/*
        Phones get a plain vertical walkthrough. The sticky version below
        needs 340vh of scroll to play four rooms, which on a handset is a very
        long hostage-taking of the scrollbar for one section.
      */}
      {/*
        Phones pick a room instead of scrolling through one. The sticky
        version below needs 340vh to play four rooms, and stacking them
        vertically instead just traded scroll-jacking for a long column. This
        holds the whole section to roughly one screen.
      */}
      <div ref={pickerRef} className="text-paper px-6 py-16 sm:px-10 lg:hidden">
        <div className="kh-fade-up mb-6 flex items-center gap-3">
          <span className="bg-accent h-0.5 w-9 shrink-0" />
          <span className="text-muted-dim text-[10px] tracking-[0.16em] uppercase">
            Walk through the home
          </span>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          {rooms.map((item, i) => (
            <div
              key={item.name}
              aria-hidden={i !== room}
              className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                i === room ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image src={item.src} alt={item.alt} fill sizes="100vw" className="object-cover" />
            </div>
          ))}
        </div>

        <div className="kh-swipe -mx-6 mt-4 flex gap-2 overflow-x-auto px-6 sm:-mx-10 sm:px-10">
          {rooms.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => pickRoom(i)}
              aria-pressed={i === room}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13px] transition-colors duration-300 ${
                i === room
                  ? 'border-accent bg-accent text-ink'
                  : 'border-rule-dark text-muted-light'
              }`}
            >
              {item.name.replace(/^The /, '')}
            </button>
          ))}
        </div>

        {/* Fixed height so switching rooms does not shunt the page around. */}
        <div aria-live="polite" className="mt-5 min-h-[9rem]">
          <span className="text-accent text-[11px] tracking-[0.2em] uppercase">
            {rooms[room].num}
          </span>
          <h3 className="mt-1.5 font-serif text-[26px] leading-tight font-normal">
            {rooms[room].name}
          </h3>
          <p className="text-muted-light mt-2 text-[15px] leading-[1.65]">{rooms[room].desc}</p>
        </div>
      </div>

      <div className="sticky top-0 hidden h-svh overflow-hidden lg:grid lg:grid-cols-[0.85fr_1.15fr]">
        <div className="absolute inset-0 lg:relative lg:inset-auto lg:order-2">
          {rooms.map((room, i) => (
            <div
              key={room.name}
              data-room-clip={i}
              className="absolute inset-0 overflow-hidden will-change-[clip-path]"
              style={i > 0 ? { clipPath: 'inset(0 0 100% 0)' } : undefined}
            >
              <div data-room-scale={i} className="absolute inset-0 will-change-transform">
                <Image
                  src={room.src}
                  alt={room.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <a
                href={room.creditHref}
                target="_blank"
                rel="noreferrer"
                className="bg-ink-deep/45 text-paper/75 absolute bottom-3 left-3.5 hidden px-2 py-1 text-[11px] lg:block"
              >
                {room.credit}
              </a>
            </div>
          ))}
        </div>

        <div className="from-ink-deep via-ink-deep/75 text-paper relative z-10 flex h-full flex-col justify-end bg-gradient-to-t to-transparent px-6 pb-10 sm:px-10 sm:pb-14 lg:order-1 lg:justify-center lg:bg-none lg:px-14 lg:pb-0">
          <div className="mb-6 flex items-center gap-3.5">
            <span className="bg-accent h-0.5 w-11" />
            <span className="text-muted-dim text-xs tracking-[0.26em] uppercase">
              Scroll to walk through the home
            </span>
          </div>

          <div className="relative h-[13rem] sm:h-[15rem]">
            {rooms.map((room, i) => (
              <div
                key={room.name}
                data-room-caption={i}
                className="pointer-events-none absolute inset-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? 'translateY(0)' : 'translateY(24px)',
                }}
              >
                <div className="text-accent mb-3 font-serif text-[15px]">{room.num}</div>
                <h3 className="mb-4 font-serif text-[clamp(2rem,6vw,3.625rem)] leading-[1.05] font-normal">
                  {room.name}
                </h3>
                <p className="text-muted-light max-w-[24rem] text-[15.5px] leading-[1.7]">
                  {room.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-[24rem] sm:mt-10">
            <div className="bg-rule-dark h-0.5">
              <div data-room-progress className="bg-accent h-full origin-left scale-x-0" />
            </div>
            <div className="text-muted-dim mt-3 flex justify-between text-xs tracking-[0.2em]">
              <span data-room-counter>01 / 04</span>
              <span className="uppercase">Kalope walkthrough</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
