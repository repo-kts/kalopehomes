'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FocusEvent } from 'react';

import { Logo } from '@/components/logo';
import { nav } from '@/lib/site-content';
import { delay } from '@/lib/motion';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="9"
      height="6"
      viewBox="0 0 9 6"
      aria-hidden="true"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M1 1.5 L4.5 5 L8 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 14 10"
      aria-hidden="true"
      fill="none"
      className={className}
    >
      <path
        d="M0 5h12M8.5 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Design categories shown before the list asks to be expanded. */
const DESIGN_PREVIEW = 5;

export function SiteHeader({ animate = true }: { animate?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAllDesigns, setShowAllDesigns] = useState(false);
  // Which row's Design panel is open ('header' | 'bar' | null). A boolean
  // here opens both copies of the row at once.
  const [designIn, setDesignIn] = useState<string | null>(null);
  const [mobileDesignOpen, setMobileDesignOpen] = useState(false);

  // Closing also folds the submenu, so the menu reopens tidy rather than
  // however it was last left.
  const closeMenu = useCallback(() => {
    setOpen(false);
    setMobileDesignOpen(false);
    setShowAllDesigns(false);
  }, []);

  // The header lives inside the hero and scrolls away with it, so past the
  // fold there is nothing to navigate from. A floating button fills that gap
  // at every width, not just on phones.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keep the page from scrolling behind the open mobile menu.
  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close the dropdown only when focus leaves the whole group, not when it
  // moves between the trigger and the panel.
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setDesignIn(null);
    }
  }

  // One horizontal row, rendered by the header itself and by the bar that
  // slides down when the hamburger is pressed, so the two cannot drift apart.
  const linkRow = (className: string, scope: string) => (
    <div className={className}>
      {nav.map((link) =>
        link.children ? (
          <div
            key={link.href}
            className="relative"
            onMouseEnter={() => setDesignIn(scope)}
            onMouseLeave={() => setDesignIn(null)}
            onFocusCapture={() => setDesignIn(scope)}
            onBlurCapture={handleBlur}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setDesignIn(null);
            }}
          >
            <a
              href={link.href}
              aria-expanded={designIn === scope}
              aria-haspopup="true"
              className="text-ink hover:text-accent-deep flex items-center gap-2 transition-colors duration-300"
            >
              {link.label}
              <Chevron open={designIn === scope} />
            </a>

            {designIn === scope && (
              // The padding is a hover bridge — without it the menu closes
              // as the pointer crosses the gap below the trigger.
              <div className="kh-menu absolute top-full left-0 z-40 pt-4">
                <div className="border-rule bg-paper w-[30rem] border p-7 shadow-2xl shadow-black/10">
                  <ul className="grid grid-cols-2 gap-x-8 gap-y-1">
                    {link.children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={child.href}
                          onClick={() => setDesignIn(null)}
                          className="text-body hover:text-accent-deep block py-1.5 text-[13px] tracking-normal normal-case transition-colors duration-200"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={link.href}
                    onClick={() => setDesignIn(null)}
                    className="border-rule text-accent-deep hover:text-ink mt-5 block border-t pt-4 text-[11.5px] tracking-[0.16em] uppercase transition-colors duration-200"
                  >
                    View selected projects →
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <a
            key={link.href}
            href={link.href}
            onClick={closeMenu}
            className="text-ink hover:text-accent-deep transition-colors duration-300"
          >
            {link.label}
          </a>
        ),
      )}
      <Link
        href="/#book"
        onClick={closeMenu}
        className="border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-paper ml-2 rounded-full border px-5 py-2.5 transition-colors duration-300"
      >
        Book a consultancy
      </Link>
    </div>
  );

  return (
    <>
      <nav
        className={`relative z-50 flex items-center justify-between px-6 py-4 sm:px-10 md:px-12 ${
          animate ? 'kh-fade' : ''
        }`}
        style={animate ? delay(1.25) : undefined}
      >
        <Link href="/#hero">
          <Logo />
        </Link>

        {linkRow(
          'hidden items-center gap-6 text-[12px] tracking-[0.16em] uppercase xl:flex',
          'header',
        )}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-[12px] tracking-[0.16em] uppercase xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          Menu
        </button>

        <div
          id="mobile-nav"
          inert={!open}
          className={`bg-paper text-ink fixed inset-0 z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none lg:hidden ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mx-auto flex w-full max-w-[34rem] items-center justify-between px-5 py-4 sm:px-8">
            <Link href="/#hero" onClick={closeMenu}>
              <Logo />
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="border-rule text-muted hover:border-ink hover:text-ink flex size-10 items-center justify-center rounded-full border transition-colors duration-300"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none">
                <path
                  d="M1 1l10 10M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-6 sm:px-8">
            <div className="mx-auto flex min-h-full w-full max-w-[34rem] flex-col justify-center">
              <div className="divide-rule bg-paper-deep divide-y overflow-hidden rounded-2xl">
                {nav.map((link) =>
                  link.children ? (
                    <div key={link.href}>
                      <button
                        type="button"
                        onClick={() => setMobileDesignOpen((value) => !value)}
                        aria-expanded={mobileDesignOpen}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium"
                      >
                        {link.label}
                        <Chevron open={mobileDesignOpen} />
                      </button>
                      {mobileDesignOpen && (
                        <div className="border-rule mx-5 mb-4 border-t pt-3">
                          <ul className="grid gap-y-0.5 sm:grid-cols-2 sm:gap-x-5">
                            {(showAllDesigns
                              ? link.children
                              : link.children.slice(0, DESIGN_PREVIEW)
                            ).map((child) => (
                              <li key={child.label}>
                                <a
                                  href={child.href}
                                  onClick={closeMenu}
                                  className="text-body hover:text-accent-deep block py-2 text-[14px] transition-colors duration-200"
                                >
                                  {child.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                          {link.children.length > DESIGN_PREVIEW && (
                            <button
                              type="button"
                              onClick={() => setShowAllDesigns((value) => !value)}
                              className="text-accent-deep hover:text-ink mt-2.5 text-[12px] font-medium tracking-[0.12em] uppercase transition-colors duration-200"
                            >
                              {showAllDesigns
                                ? 'Show fewer'
                                : `+ ${link.children.length - DESIGN_PREVIEW} more designs`}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className="hover:text-accent-deep flex items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium transition-colors duration-200"
                    >
                      {link.label}
                      <ArrowRight className="text-muted" />
                    </a>
                  ),
                )}
              </div>

              <Link
                href="/#book"
                onClick={closeMenu}
                className="bg-accent text-ink hover:bg-ink hover:text-paper mt-4 flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-[12.5px] font-medium tracking-[0.14em] uppercase transition-colors duration-300"
              >
                Book a consultancy
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/*
        Laptop: the header's own nav row, brought back down rather than a
        vertical drawer. Stays mounted so it can slide; `inert` keeps it out of
        the tab order while it is parked above the viewport.
      */}
      <div
        inert={!open}
        className={`fixed inset-x-0 top-0 z-50 hidden transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none lg:block ${
          open ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-end px-6 py-4 sm:px-10 md:px-12">
          <div className="flex items-center gap-6">
            {linkRow('flex items-center gap-6 text-[12px] tracking-[0.16em] uppercase', 'bar')}
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="border-rule text-muted hover:border-ink hover:text-ink flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none">
                <path
                  d="M1 1l10 10M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav"
        className={`fixed top-4 right-4 z-40 flex size-12 items-center justify-center text-white mix-blend-difference transition-all duration-300 sm:top-6 sm:right-6 ${
          scrolled && !open
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        {/*
          No plate and no shadow. `mix-blend-difference` inverts the strokes
          against whatever is behind them, so they read light over the dark
          sections and dark over the paper ones without having to know which
          is which.
        */}
        <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true" fill="none">
          <path
            d="M0 1h22M0 7h22M0 13h22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </>
  );
}
