import Image from 'next/image';

import { Reveal } from '@/components/reveal';
import { bestSellers } from '@/lib/site-content';
import { delay } from '@/lib/motion';

/**
 * T-07 · Zoom settle.
 *
 * Two layouts from one set of markup, so no image is ever downloaded twice.
 *
 * Phones get a staggered catalogue: the right-hand column is dropped half a
 * card so the two columns interlock, and the crops alternate tall / square
 * down the page. That irregular rhythm is what stops six products reading as
 * a spreadsheet. Captions sit on paper below each photo, closed by a hairline
 * carrying the index and an arrow.
 *
 * From `lg` the caption moves onto the image, the scrim appears and the grid
 * becomes the mosaic with the first product spanning two columns and two rows.
 */
export function BestSelling() {
  return (
    <Reveal id="best-selling" className="bg-paper-deep px-6 py-16 sm:px-10 md:px-12 md:py-20">
      <div className="mx-auto max-w-[76rem]">
        <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="kh-fade-up mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4">
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

        <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:gap-4 lg:grid-cols-3 lg:gap-4">
          {bestSellers.map((item, i) => {
            const feature = i === 0;
            const rightColumn = i % 2 === 1;
            return (
              <a
                key={item.name}
                href="#book"
                className={`group relative flex flex-col lg:mt-0 lg:block ${
                  rightColumn ? 'mt-9' : ''
                } ${feature ? 'lg:col-span-2 lg:row-span-2 lg:h-auto' : 'lg:h-[10rem]'}`}
              >
                <div
                  className={`relative overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto ${
                    rightColumn ? 'aspect-square' : 'aspect-[3/4]'
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
                            ? '(max-width: 1024px) 50vw, 66vw'
                            : '(max-width: 1024px) 50vw, 33vw'
                        }
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* The scrim only exists where the caption sits on the photo. */}
                <div className="from-ink-deep/90 via-ink-deep/30 pointer-events-none absolute inset-0 z-[1] hidden bg-gradient-to-t to-transparent lg:block" />

                <div className="relative z-[2] pt-3 lg:absolute lg:inset-x-0 lg:bottom-0 lg:p-4 lg:pt-0">
                  <span className="text-accent-deep lg:text-accent text-[10px] tracking-[0.2em] uppercase">
                    {item.category}
                  </span>
                  <h3
                    className={`text-ink lg:text-paper mt-1 font-serif ${
                      feature
                        ? 'text-[17px] sm:text-[19px] lg:text-[23px]'
                        : 'text-[17px] lg:text-[16.5px]'
                    }`}
                  >
                    {item.name}
                  </h3>

                  {feature && (
                    <p className="text-muted-light mt-1.5 hidden max-w-[26rem] text-[13.5px] leading-[1.55] lg:block">
                      {item.desc}
                    </p>
                  )}

                  {/* Phones close each card with a rule, the index and an arrow. */}
                  <div className="border-rule mt-2.5 flex items-center justify-between border-t pt-2 lg:hidden">
                    <span className="text-muted text-[10px] tracking-[0.16em] uppercase">
                      {item.num}
                    </span>
                    <span className="text-accent-deep text-[13px] leading-none">→</span>
                  </div>

                  <span className="text-paper/70 group-hover:text-accent mt-3 hidden text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 lg:inline-block">
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
