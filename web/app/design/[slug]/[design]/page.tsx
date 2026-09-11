import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Reveal } from '@/components/reveal';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { designCategoryBySlug } from '@/lib/design-categories';
import { designItems, designsForCategory, findDesign } from '@/lib/design-items';
import { delay } from '@/lib/motion';

export function generateStaticParams() {
  return designItems.map((item) => ({ slug: item.category, design: item.slug }));
}

export async function generateMetadata(
  props: PageProps<'/design/[slug]/[design]'>,
): Promise<Metadata> {
  const { slug, design } = await props.params;
  const item = findDesign(slug, design);
  if (!item) return {};
  return { title: `${item.title} · Kalope Homes`, description: item.summary };
}

/** Claims already made elsewhere on the site — nothing new is promised here. */
const ASSURANCES = [
  'Customisable designs',
  'Two-year warranty',
  'Free site survey',
  'One lead per project',
];

export default async function DesignDetailPage(props: PageProps<'/design/[slug]/[design]'>) {
  const { slug, design } = await props.params;
  const item = findDesign(slug, design);
  const category = designCategoryBySlug.get(slug);
  if (!item || !category) notFound();

  const siblings = designsForCategory(slug);
  const index = siblings.findIndex((entry) => entry.slug === design);
  const previous = siblings[(index - 1 + siblings.length) % siblings.length];
  const next = siblings[(index + 1) % siblings.length];

  return (
    <>
      <SiteHeader animate={false} />

      {/* Padding at the foot clears the sticky enquiry bar on phones. */}
      <main className="flex-1 pb-24 lg:pb-0">
        <Reveal immediate className="px-6 pt-5 sm:px-10 md:px-12">
          <nav
            aria-label="Breadcrumb"
            className="kh-fade-up text-muted mx-auto flex max-w-[76rem] flex-wrap items-center gap-x-2 gap-y-1 text-[12px]"
          >
            <Link href="/" className="hover:text-accent-deep transition-colors duration-300">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/design/${category.slug}`}
              className="hover:text-accent-deep transition-colors duration-300"
            >
              {category.title}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-body">{item.title}</span>
          </nav>
        </Reveal>

        <Reveal immediate className="px-6 py-8 sm:px-10 md:px-12 md:py-12">
          <div className="mx-auto grid max-w-[76rem] gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            {/* Photo. The blinds lift off it exactly as they do elsewhere. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:sticky lg:top-6 lg:self-start">
              <div className="kh-zoom absolute inset-0">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42rem"
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 z-[5] flex flex-col">
                {[0, 1, 2].map((b) => (
                  <div key={b} className="kh-blind bg-paper flex-1" style={delay(0.1 + b * 0.1)} />
                ))}
              </div>
            </div>

            <div>
              <span
                className="kh-fade-up text-accent-deep text-[10px] tracking-[0.2em] uppercase"
                style={delay(0.1)}
              >
                {category.title}
              </span>

              <h1
                className="kh-fade-up font-display mt-2 text-[clamp(1.6rem,4vw,2.5rem)] leading-[1.15] font-normal"
                style={delay(0.15)}
              >
                {item.title}
              </h1>

              <p
                className="kh-fade-up text-body mt-4 text-[15.5px] leading-[1.7]"
                style={delay(0.2)}
              >
                {item.summary}
              </p>

              <ul
                className="kh-fade-up mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2"
                style={delay(0.25)}
              >
                {ASSURANCES.map((assurance) => (
                  <li
                    key={assurance}
                    className="border-rule text-body rounded-xl border px-3 py-2.5 text-[11.5px] leading-snug"
                  >
                    {assurance}
                  </li>
                ))}
              </ul>

              <h2
                className="kh-fade-up font-display mt-9 text-[19px] font-normal"
                style={delay(0.3)}
              >
                Design details
              </h2>
              <dl className="mt-3">
                {item.specs.map((spec, i) => (
                  <div key={spec.label} className="relative py-3">
                    <div
                      className="kh-line-x bg-rule absolute inset-x-0 top-0 h-px"
                      style={delay(0.32 + i * 0.05)}
                    />
                    <div
                      className="kh-fade-up grid grid-cols-[8.5rem_1fr] gap-3 text-[14.5px]"
                      style={delay(0.34 + i * 0.05)}
                    >
                      <dt className="text-muted">{spec.label}</dt>
                      <dd className="text-ink">{spec.value}</dd>
                    </div>
                  </div>
                ))}
                <div className="kh-line-x bg-rule h-px" style={delay(0.65)} />
              </dl>

              <Link
                href="/#book"
                className="kh-fade-up bg-ink text-paper hover:bg-accent hover:text-ink mt-8 hidden rounded-full px-8 py-4 text-center text-[12px] tracking-[0.16em] uppercase transition-colors duration-300 lg:inline-block"
                style={delay(0.5)}
              >
                Get a free quote
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Step through the category without going back to the listing. */}
        <Reveal className="border-rule border-t px-6 py-10 sm:px-10 md:px-12">
          <div className="mx-auto grid max-w-[76rem] gap-4 sm:grid-cols-2">
            {[
              { entry: previous, label: 'Previous design', align: '' },
              { entry: next, label: 'Next design', align: 'sm:flex-row-reverse sm:text-right' },
            ].map(({ entry, label, align }) => (
              <Link
                key={label}
                href={`/design/${entry.category}/${entry.slug}`}
                className={`kh-fade-up group hover:bg-paper-deep flex items-center gap-4 rounded-2xl p-3 transition-colors duration-300 ${align}`}
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={entry.src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-muted block text-[11px] tracking-[0.14em] uppercase">
                    {label}
                  </span>
                  <span className="text-ink group-hover:text-accent-deep line-clamp-2 text-[14px] leading-snug transition-colors duration-300">
                    {entry.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </main>

      {/* Phones keep the enquiry within thumb reach rather than at the page foot. */}
      <div className="border-rule bg-paper/95 fixed inset-x-0 bottom-0 z-40 border-t px-5 py-3 backdrop-blur-md lg:hidden">
        <Link
          href="/#book"
          className="bg-ink text-paper hover:bg-accent hover:text-ink block rounded-full px-6 py-3.5 text-center text-[12px] tracking-[0.16em] uppercase transition-colors duration-300"
        >
          Get a free quote
        </Link>
      </div>

      <SiteFooter showCta={false} />
    </>
  );
}
