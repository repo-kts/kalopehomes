'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Reveal } from '@/components/reveal';
import { services } from '@/lib/site-content';
import { delay } from '@/lib/motion';

/** A plus that loses its vertical stroke when the row opens. */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span className="relative block size-3.5 shrink-0" aria-hidden="true">
      <span className="bg-ink absolute top-1/2 left-0 h-px w-full -translate-y-1/2" />
      <span
        className={`bg-ink absolute top-0 left-1/2 h-full w-px -translate-x-1/2 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? 'scale-y-0' : 'scale-y-100'
        }`}
      />
    </span>
  );
}

/**
 * T-03 · Rule draw, as an accordion.
 *
 * Six services collapse to six lines, so the section stays short and the
 * descriptions appear only when asked for. The open panel animates via
 * `grid-template-rows: 0fr -> 1fr`, which transitions to real content height
 * without measuring anything in JS.
 */
export function Services() {
  const [open, setOpen] = useState(0);

  return (
    <Reveal id="services" className="px-6 py-16 sm:px-10 md:px-12 md:py-20">
      <div className="mx-auto max-w-[76rem]">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="kh-fade-up mb-5 flex items-center gap-3 sm:gap-4">
              <span className="bg-accent h-0.5 w-9 shrink-0 sm:w-14" />
              <span className="text-muted text-[10px] tracking-[0.16em] uppercase sm:text-xs sm:tracking-[0.28em]">
                What we do
              </span>
            </div>
            <h2 className="kh-fade-up font-display text-[clamp(2.25rem,5vw,4rem)] font-normal">
              Services provided
            </h2>
          </div>
          <p
            className="kh-fade-up text-body max-w-[24rem] text-[15px] leading-[1.7]"
            style={delay(0.15)}
          >
            Office and home, drawing to handover. Every service below is delivered by our own team
            on one contract.
          </p>
        </div>

        <div>
          {services.map((service, i) => {
            const isOpen = open === i;
            return (
              <div key={service.num} className="relative">
                <div
                  className="kh-line-x bg-rule absolute inset-x-0 top-0 h-px"
                  style={delay(i * 0.08)}
                />
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`service-${service.num}`}
                    className="group flex w-full items-center gap-4 py-5 text-left sm:gap-6"
                  >
                    <span
                      className={`font-display text-[13px] transition-colors duration-300 ${
                        isOpen ? 'text-accent-deep' : 'text-muted'
                      }`}
                    >
                      {service.num}
                    </span>
                    <span
                      className={`group-hover:text-accent-deep font-display flex-1 text-[21px] leading-tight font-normal transition-colors duration-300 sm:text-[26px] ${
                        isOpen ? 'text-accent-deep' : ''
                      }`}
                    >
                      {service.name}
                    </span>
                    <PlusMinus open={isOpen} />
                  </button>
                </h3>

                <div
                  id={`service-${service.num}`}
                  className={`grid transition-[grid-template-rows] duration-400 ease-out motion-reduce:transition-none ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-body max-w-[44rem] pb-6 pl-8 text-[15px] leading-[1.7] sm:pl-11">
                      {service.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="kh-line-x bg-rule h-px" style={delay(0.55)} />
        </div>

        <Link
          href="/#book"
          className="kh-fade-up border-ink hover:bg-ink hover:text-paper mt-9 inline-block border px-7 py-3.5 text-[12px] tracking-[0.16em] uppercase transition-colors duration-300"
          style={delay(0.5)}
        >
          Discuss your project
        </Link>
      </div>
    </Reveal>
  );
}
