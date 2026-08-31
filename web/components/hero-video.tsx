'use client';

import { useEffect, useRef, useState } from 'react';

/** How long the curtain takes to clear. The last panel finishes at ~1.22s. */
const INTRO_MS = 1500;

/**
 * Hero showreel, layered over the poster image.
 *
 * Loading is deferred (`preload="none"`) and playback only starts once the
 * curtain has cleared, so the 1.5MB file never competes with first paint. The
 * video fades up when it actually begins, so a blocked or failed play just
 * leaves the poster in place.
 *
 * Autoplay requires `muted`; the file has no audio track at all. Playback is
 * skipped entirely for anyone who has asked for reduced motion.
 */
export function HeroVideo({
  src,
  poster,
  fallback,
}: {
  src: string;
  poster?: string;
  fallback?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Portrait phones crop a 16:9 clip to a narrow strip and pay several
    // megabytes for it. They keep the poster instead.
    if (!window.matchMedia('(min-width: 768px)').matches) return;

    const timer = setTimeout(() => {
      el.play()
        .then(() => setReady(true))
        .catch(() => {
          /* Autoplay refused — the poster stays in place. */
        });
    }, INTRO_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label="Walkthrough of a completed Kalope Homes interior"
      className={`absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-700 ${
        ready ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <source src={src} type="video/webm" />
      {fallback ? <source src={fallback} type="video/mp4" /> : null}
    </video>
  );
}
