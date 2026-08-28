import Image from 'next/image';

import { Reveal } from '@/components/reveal';
import { bestSellers } from '@/lib/site-content';
import { delay } from '@/lib/motion';

/**
 * T-07 · Zoom settle.
 *
 * A mosaic of overlay tiles — the first spans two columns and two rows — so
 * this reads differently from the caption-below grid used by Selected
 * projects. The entry zoom sits on an outer wrapper and the hover scale on an
 * inner one: an animation with `both` fill would otherwise pin the transform
 * and swallow the hover.
 */
export function BestSelling() {
  return (
    <Reveal id="best-selling" className="bg-paper-deep px-6 py-16 sm:px-10 md:px-12 md:py-20">
      <div className="mx-auto max-w-[76rem]">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="kh-fade-up mb-5 flex items-center gap-3 sm:gap-4">
              <span className="bg-accent h-0.5 w-9 shrink-0 sm:w-14" />
              <span className="text-muted text-[10px] tracking-[0.16em] uppercase sm:text-xs sm:tracking-[0.28em]">
                Most requested
              </span>
            </div>
            <h2 className="kh-fade-up font-serif text-[clamp(2.25rem,5vw,4rem)] font-normal">
              Best selling
            </h2>
          </div>
          <p
            className="kh-fade-up text-body max-w-[24rem] text-[15px] leading-[1.7]"
            style={delay(0.15)}
          >
            The pieces our clients ask for most. Designed, made in our workshop and fitted by the
            same team.
          </p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {bestSellers.map((item, i) => {
            const feature = i === 0;
            return (
              <a
                key={item.name}
                href="#book"
                className={`group relative block overflow-hidden ${
                  feature
                    ? 'h-[12rem] sm:col-span-2 sm:h-[14rem] lg:row-span-2 lg:h-auto'
                    : 'h-[9rem] sm:h-[10rem]'
                }`}
              >
                <div className="kh-zoom absolute inset-0" style={delay((i % 3) * 0.1)}>
                  <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes={
                        feature
                          ? '(max-width: 1024px) 100vw, 66vw'
                          : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      }
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="from-ink-deep/90 via-ink-deep/30 absolute inset-0 bg-gradient-to-t to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="text-accent text-[10px] tracking-[0.2em] uppercase">
                    {item.category}
                  </span>
                  <h3
                    className={`text-paper mt-1.5 font-serif ${
                      feature ? 'text-[20px] sm:text-[23px]' : 'text-[16.5px]'
                    }`}
                  >
                    {item.name}
                  </h3>
                  {feature && (
                    <p className="text-muted-light mt-1.5 max-w-[26rem] text-[13.5px] leading-[1.55]">
                      {item.desc}
                    </p>
                  )}
                  <span className="text-paper/70 group-hover:text-accent mt-3 inline-block text-[11px] tracking-[0.16em] uppercase transition-colors duration-300">
                    Enquire →
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
