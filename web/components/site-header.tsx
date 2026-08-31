'use client';

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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [showAllDesigns, setShowAllDesigns] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);
  const [mobileDesignOpen, setMobileDesignOpen] = useState(false);

  // Closing also folds the submenu, so the menu reopens tidy rather than
  // however it was last left.
  const closeMenu = useCallback(() => {
    setOpen(false);
    setMobileDesignOpen(false);
    setShowAllDesigns(false);
  }, []);

  // Keep the page from scrolling behind the open mobile menu.
  useEffect(() => {
    if (!open) return;
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
      setDesignOpen(false);
    }
  }

  return (
    <nav
      className="kh-fade relative z-50 flex items-center justify-between px-6 py-4 sm:px-10 md:px-12"
      style={delay(1.25)}
    >
      <a href="#hero">
        <Logo />
      </a>

      <div className="hidden items-center gap-6 text-[12px] tracking-[0.16em] uppercase xl:flex">
        {nav.map((link) =>
          link.children ? (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => setDesignOpen(true)}
              onMouseLeave={() => setDesignOpen(false)}
              onFocusCapture={() => setDesignOpen(true)}
              onBlurCapture={handleBlur}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setDesignOpen(false);
              }}
            >
              <a
                href={link.href}
                aria-expanded={designOpen}
                aria-haspopup="true"
                className="text-ink hover:text-accent-deep flex items-center gap-2 transition-colors duration-300"
              >
                {link.label}
                <Chevron open={designOpen} />
              </a>

              {designOpen && (
                // The padding is a hover bridge — without it the menu closes
                // as the pointer crosses the gap below the trigger.
                <div className="kh-menu absolute top-full left-0 z-40 pt-4">
                  <div className="border-rule bg-paper w-[30rem] border p-7 shadow-2xl shadow-black/10">
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-1">
                      {link.children.map((child) => (
                        <li key={child.label}>
                          <a
                            href={child.href}
                            onClick={() => setDesignOpen(false)}
                            className="text-body hover:text-accent-deep block py-1.5 text-[13px] tracking-normal normal-case transition-colors duration-200"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={link.href}
                      onClick={() => setDesignOpen(false)}
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
              className="text-ink hover:text-accent-deep transition-colors duration-300"
            >
              {link.label}
            </a>
          ),
        )}
        <a
          href="#book"
          className="bg-ink text-paper hover:bg-accent hover:text-ink ml-2 px-5 py-3 transition-colors duration-300"
        >
          Book a consultancy
        </a>
      </div>

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
        className={open ? 'bg-paper text-ink fixed inset-0 z-50 flex flex-col xl:hidden' : 'hidden'}
      >
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          <a href="#hero" onClick={closeMenu}>
            <Logo />
          </a>
          <button
            type="button"
            onClick={closeMenu}
            className="border-rule text-muted hover:border-ink hover:text-ink rounded-full border px-4 py-2 text-[11px] tracking-[0.16em] uppercase transition-colors duration-300"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 sm:px-8">
          <div className="flex min-h-full flex-col justify-center">
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

            <a
              href="#book"
              onClick={closeMenu}
              className="bg-accent text-ink hover:bg-ink hover:text-paper mt-4 flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-[12.5px] font-medium tracking-[0.14em] uppercase transition-colors duration-300"
            >
              Book a consultancy
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
