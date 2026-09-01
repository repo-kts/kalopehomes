'use client';

import { useCallback, useEffect, useRef, type RefObject } from 'react';

type Options = {
  /** Drift in px per frame. 0.45 is roughly 27px/s at 60fps. */
  speed?: number;
  /** How long drift stays paused after a touch, wheel or button press. */
  holdMs?: number;
};

/**
 * Drifts a horizontal scroller while leaving it fully under the visitor's
 * control — swipe, drag, wheel, keyboard and buttons all still work, because
 * this moves real `scrollLeft` rather than animating a transform the visitor
 * cannot touch.
 *
 * The track must render its children **twice**; the position wraps at the
 * halfway mark so the loop is seamless in both directions.
 *
 * Scroll snapping is switched off while drifting and restored the moment the
 * visitor takes over. Mandatory snap points otherwise drag the scroll position
 * back on every frame and the drift stutters or stalls outright.
 *
 * Drift is skipped entirely under `prefers-reduced-motion`, leaving an
 * ordinary scroller.
 */
export function useAutoScroll(
  ref: RefObject<HTMLDivElement | null>,
  { speed = 0.45, holdMs = 3000 }: Options = {},
) {
  const hoverRef = useRef(false);
  const holdUntilRef = useRef(0);

  const hold = useCallback(() => {
    holdUntilRef.current = Date.now() + holdMs;
  }, [holdMs]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Start just inside the first copy so wrapping backwards has somewhere to go.
    el.scrollLeft = 1;

    let frame = 0;
    let snapOff = false;

    const tick = () => {
      const half = el.scrollWidth / 2;
      if (half > 0) {
        const drifting = !hoverRef.current && Date.now() >= holdUntilRef.current;

        if (drifting !== snapOff) {
          snapOff = drifting;
          el.style.scrollSnapType = drifting ? 'none' : '';
        }

        if (drifting) el.scrollLeft += speed;

        if (el.scrollLeft >= half) el.scrollLeft -= half;
        else if (el.scrollLeft <= 0) el.scrollLeft = half - 1;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el.style.scrollSnapType = '';
    };
  }, [ref, speed]);

  return {
    hold,
    /** Spread onto the scroll container. */
    handlers: {
      onPointerEnter: () => {
        hoverRef.current = true;
      },
      onPointerLeave: () => {
        hoverRef.current = false;
      },
      onFocusCapture: () => {
        hoverRef.current = true;
      },
      onBlurCapture: () => {
        hoverRef.current = false;
      },
      onTouchStart: hold,
      onTouchMove: hold,
      onWheel: hold,
      onKeyDown: hold,
    },
  };
}
