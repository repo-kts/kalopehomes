import Link from 'next/link';
import Image from 'next/image';

import { HeroVideo } from '@/components/hero-video';
import { Reveal } from '@/components/reveal';
import { SiteHeader } from '@/components/site-header';
import { hero, heroHeadline } from '@/lib/site-content';
import { delay } from '@/lib/motion';

/**
 * T-01 · Panel curtain.
 *
 * The showreel runs full-bleed behind the whole hero. The footage is a bright
 * interior, so the type stays dark ink and the scrims are paper-tinted rather
 * than black — a dark overlay would fight the film instead of supporting it.
 */
export function Hero() {
  return (
    <Reveal id="hero" immediate className="relative flex min-h-svh flex-col overflow-hidden">
      {/* Poster first, video layered over it once playback starts. */}
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <HeroVideo src={hero.video} fallback={hero.videoFallback} poster={hero.image.src} />

      {/* Keeps the headline legible across the left of the frame. */}
      <div className="from-paper/80 via-paper/60 to-paper/40 lg:from-paper/60 lg:via-paper/25 pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r lg:to-transparent" />
      {/* Keeps the logo and nav legible along the top. */}
      <div className="from-paper pointer-events-none absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b to-transparent" />

      <div className="pointer-events-none absolute inset-0 z-30 flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="kh-panel bg-ink flex-1" style={delay(i * 0.08)} />
        ))}
      </div>

      <SiteHeader />

      <div className="relative z-10 flex flex-1 items-center px-6 pb-16 sm:px-10 md:px-12 lg:pb-20">
        <div className="max-w-[42rem]">
          <h1 className="font-serif text-[clamp(1.75rem,min(5vw,7.4vh),3.75rem)] leading-[1.02] font-normal tracking-[-0.01em]">
            {heroHeadline.map((line, i) => (
              <span key={line.text} className="block overflow-hidden">
                <span className="kh-rise block" style={delay(0.7 + i * 0.14)}>
                  {line.text}
                  {line.accent ? <span className="text-accent-deep">{line.accent}</span> : null}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="kh-fade-up text-body mt-5 max-w-[26rem] text-[16px] leading-[1.65]"
            style={delay(1.05)}
          >
            {hero.body}
          </p>

          <div className="kh-fade-up mt-7 flex flex-wrap gap-3" style={delay(1.18)}>
            <Link
              href="/#projects"
              className="bg-ink text-paper hover:bg-accent hover:text-ink px-7 py-3.5 text-[12px] tracking-[0.16em] uppercase transition-colors duration-300"
            >
              View projects
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
