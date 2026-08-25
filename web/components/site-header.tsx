'use client';

import { useEffect, useState, type FocusEvent } from 'react';

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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);
  const [mobileDesignOpen, setMobileDesignOpen] = useState(false);

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
        <div className="flex items-center justify-between px-6 py-4 sm:px-10">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[12px] tracking-[0.16em] uppercase"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-10">
          <div className="flex min-h-full flex-col justify-center gap-1 py-6">
            {nav.map((link) =>
              link.children ? (
                <div key={link.href} className="border-rule border-b">
                  <button
                    type="button"
                    onClick={() => setMobileDesignOpen((value) => !value)}
                    aria-expanded={mobileDesignOpen}
                    className="flex w-full items-center justify-between py-4 font-serif text-3xl"
                  >
                    {link.label}
                    <Chevron open={mobileDesignOpen} />
                  </button>
                  {mobileDesignOpen && (
                    <ul className="grid grid-cols-2 gap-x-5 gap-y-1 pb-5">
                      {link.children.map((child) => (
                        <li key={child.label}>
                          <a
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="text-body hover:text-accent-deep block py-1.5 text-[13px]"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-rule hover:text-accent-deep border-b py-4 font-serif text-3xl transition-colors duration-300"
                >
                  {link.label}
                </a>
              ),
            )}
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="bg-ink text-paper hover:bg-accent hover:text-ink mt-6 px-6 py-4 text-center text-[13px] tracking-[0.16em] uppercase transition-colors duration-300"
            >
              Book a consultancy
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
