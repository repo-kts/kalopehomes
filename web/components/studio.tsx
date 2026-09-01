import Image from 'next/image';

import { Reveal } from '@/components/reveal';
import { studio } from '@/lib/site-content';
import { delay } from '@/lib/motion';

/** T-05 · Split frame — two paper halves part like curtains over the photo. */
export function Studio() {
  return (
    <Reveal id="studio" className="px-6 py-16 sm:px-10 md:px-12 md:py-20 lg:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-18">
        <div className="relative h-[24rem] overflow-hidden lg:h-[32.5rem]">
          <Image
            src={studio.image.src}
            alt={studio.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 z-[5] flex">
            <div className="kh-frame-l bg-paper flex-1" />
            <div className="kh-frame-r bg-paper flex-1" />
          </div>
        </div>

        <div>
          <h2
            className="kh-fade-up font-display mb-6 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.08] font-normal"
            style={delay(0.2)}
          >
            {studio.heading}
          </h2>

          {studio.body.map((paragraph, i) => (
            <p
              key={i}
              className="kh-fade-up text-body mb-4.5 text-[16.5px] leading-[1.75] last:mb-9"
              style={delay(0.35 + i * 0.15)}
            >
              {paragraph}
            </p>
          ))}

          <div className="kh-fade-up flex flex-wrap gap-10 sm:gap-12" style={delay(0.65)}>
            {studio.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-accent-deep font-display text-4xl">{stat.value}</div>
                <div className="text-muted mt-1 text-[13px] tracking-[0.12em] uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
