import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';

import { Reveal } from '@/components/reveal';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getGalleryTiles } from '@/lib/gallery';
import { delay } from '@/lib/motion';

export const metadata: Metadata = {
  title: 'Gallery · Kalope Homes',
  description: 'Rooms, kitchens, wardrobes and workspaces designed and built by Kalope Homes.',
};

/**
 * Images are managed in the admin, so the page cannot be frozen at build time.
 * It prerenders with whatever is published and refreshes every five minutes.
 */
export const revalidate = 300;

/** Tile heights, varied so the columns interlock instead of forming rows. */
const SHAPE = {
  tall: 'aspect-[3/4]',
  square: 'aspect-square',
  wide: 'aspect-[4/3]',
} as const;

export default async function GalleryPage() {
  const { tiles } = await getGalleryTiles();

  return (
    <>
      <SiteHeader animate={false} />

      <main className="flex-1 px-6 pb-20 sm:px-10 md:px-12">
        <div className="mx-auto max-w-[86rem]">
          <Reveal immediate className="pt-6 pb-10 md:pt-10 md:pb-14">
            <div className="kh-fade-up mb-4 flex items-center gap-3 sm:gap-4">
              <span className="bg-accent h-0.5 w-9 shrink-0 sm:w-14" />
              <span className="text-muted text-[10px] tracking-[0.16em] uppercase sm:text-xs sm:tracking-[0.28em]">
                Our work
              </span>
            </div>
            <h1 className="kh-fade-up font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05] font-normal">
              Gallery
            </h1>
            <p
              className="kh-fade-up text-body mt-4 max-w-[32rem] text-[16px] leading-[1.7]"
              style={delay(0.12)}
            >
              Rooms, kitchens, wardrobes and workspaces we have designed and built. Every one
              delivered by our own team on a single contract.
            </p>
          </Reveal>

          {/*
            CSS columns rather than a grid: tiles keep their own height and the
            columns fill unevenly, which is what makes a gallery read as a wall
            of work rather than a table of it.
          */}
          <Reveal className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
            {tiles.map((item, i) => (
              <figure
                key={`${item.src}-${i}`}
                className="kh-fade-up group relative mb-3 break-inside-avoid overflow-hidden sm:mb-4"
                style={delay((i % 8) * 0.06)}
              >
                <div className={`relative ${SHAPE[item.shape]}`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    /* CMS hosts are unknown at build time, so these bypass the
                       optimizer rather than 400 on an unlisted hostname. Add the
                       real photo host to `images.remotePatterns` and drop this to
                       turn optimization back on. */
                    unoptimized={item.fromCms}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <figcaption className="bg-paper/90 text-ink absolute bottom-2 left-2 px-2.5 py-1 text-[11px] tracking-[0.06em] backdrop-blur-sm">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </Reveal>

          <Reveal className="border-rule mt-14 flex flex-col items-start gap-5 border-t pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="kh-fade-up font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight">
              Something here for your place?
            </p>
            <Link
              href="/#book"
              className="kh-fade-up bg-ink text-paper hover:bg-accent hover:text-ink shrink-0 px-7 py-3.5 text-[12px] tracking-[0.16em] uppercase transition-colors duration-300"
              style={delay(0.1)}
            >
              Book a consultancy
            </Link>
          </Reveal>
        </div>
      </main>

      <SiteFooter showCta={false} />
    </>
  );
}
