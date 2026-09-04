import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Reveal } from '@/components/reveal';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { designCategories, designCategoryBySlug } from '@/lib/design-categories';
import { delay } from '@/lib/motion';

/** All twelve pages are known at build time, so all twelve prerender. */
export function generateStaticParams() {
  return designCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(props: PageProps<'/design/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const category = designCategoryBySlug.get(slug);
  if (!category) return {};
  return {
    title: `${category.title} · Kalope Homes`,
    description: category.intro,
  };
}

const SHAPE = {
  tall: 'aspect-[3/4]',
  square: 'aspect-square',
  wide: 'aspect-[4/3]',
} as const;

export default async function DesignCategoryPage(props: PageProps<'/design/[slug]'>) {
  const { slug } = await props.params;
  const category = designCategoryBySlug.get(slug);
  if (!category) notFound();

  const others = designCategories.filter((item) => item.slug !== slug);

  return (
    <>
      <SiteHeader animate={false} />

      <main className="flex-1">
        {/* Intro. The blinds lift off the photo exactly as they do on the home page. */}
        <Reveal immediate className="px-6 pt-6 pb-14 sm:px-10 md:px-12 md:pt-10 md:pb-20">
          <div className="mx-auto max-w-[76rem]">
            <Link
              href="/#projects"
              className="kh-fade-up text-muted hover:text-accent-deep mb-6 inline-block text-[11px] tracking-[0.16em] uppercase transition-colors duration-300"
            >
              ← All designs
            </Link>

            <div className="kh-fade-up mb-4 flex items-center gap-3 sm:gap-4" style={delay(0.05)}>
              <span className="bg-accent h-0.5 w-9 shrink-0 sm:w-14" />
              <span className="text-muted text-[10px] tracking-[0.16em] uppercase sm:text-xs sm:tracking-[0.28em]">
                {category.kicker}
              </span>
            </div>

            <h1
              className="kh-fade-up font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.05] font-normal"
              style={delay(0.1)}
            >
              {category.title}
            </h1>

            <p
              className="kh-fade-up text-body mt-5 max-w-[38rem] text-[16px] leading-[1.75]"
              style={delay(0.18)}
            >
              {category.intro}
            </p>

            <div className="relative mt-10 aspect-[4/3] overflow-hidden sm:aspect-[16/9] lg:aspect-[16/7]">
              <div className="kh-zoom absolute inset-0" style={delay(0.2)}>
                <Image
                  src={category.hero.src}
                  alt={category.hero.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 76rem"
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 z-[5] flex flex-col">
                {[0, 1, 2].map((b) => (
                  <div
                    key={b}
                    className="kh-blind bg-paper flex-1"
                    style={delay(0.25 + b * 0.12)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Scope. Rules draw in one after another, as in Services. */}
        <Reveal className="bg-ink text-paper px-6 py-16 sm:px-10 md:px-12 md:py-20">
          <div className="mx-auto max-w-[76rem]">
            <h2 className="kh-fade-up font-display mb-8 text-[clamp(1.75rem,4vw,2.75rem)] font-normal md:mb-10">
              What the scope covers
            </h2>
            <ul>
              {category.points.map((point, i) => (
                <li key={point} className="relative py-5">
                  <div
                    className="kh-line-x bg-rule-dark absolute inset-x-0 top-0 h-px"
                    style={delay(i * 0.1)}
                  />
                  <div
                    className="kh-fade-up grid grid-cols-[2rem_1fr] gap-3 sm:grid-cols-[3rem_1fr]"
                    style={delay(i * 0.1 + 0.06)}
                  >
                    <span className="text-accent font-display pt-0.5 text-[14px]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-muted-light text-[16px] leading-[1.65] sm:text-[17px]">
                      {point}
                    </span>
                  </div>
                </li>
              ))}
              <li>
                <div className="kh-line-x bg-rule-dark h-px" style={delay(0.45)} />
              </li>
            </ul>
          </div>
        </Reveal>

        {/* Gallery. Two staggered columns on a phone, four across on desktop. */}
        <Reveal className="bg-paper-deep px-6 py-16 sm:px-10 md:px-12 md:py-20">
          <div className="mx-auto max-w-[76rem]">
            <h2 className="kh-fade-up font-display mb-8 text-[clamp(1.75rem,4vw,2.75rem)] font-normal md:mb-10">
              A closer look
            </h2>
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-6 sm:gap-4 lg:grid-cols-4">
              {category.gallery.map((shot, i) => (
                <figure
                  key={shot.src + i}
                  className={`kh-fade-up group relative overflow-hidden lg:mt-0 ${
                    i % 2 === 1 ? 'mt-8 lg:mt-0' : ''
                  } ${SHAPE[shot.shape]}`}
                  style={delay((i % 4) * 0.08)}
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </figure>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Sideways navigation to the other eleven. */}
        <Reveal className="px-6 py-16 sm:px-10 md:px-12 md:py-20">
          <div className="mx-auto max-w-[76rem]">
            <h2 className="kh-fade-up font-display mb-6 text-[clamp(1.5rem,3.5vw,2.25rem)] font-normal">
              Explore other designs
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {others.map((item, i) => (
                <Link
                  key={item.slug}
                  href={`/design/${item.slug}`}
                  className="kh-fade-up border-rule text-body hover:border-ink hover:bg-ink hover:text-paper rounded-full border px-4 py-2.5 text-[13px] transition-colors duration-300"
                  style={delay(Math.min(i, 8) * 0.04)}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="border-rule mt-12 flex flex-col items-start gap-5 border-t pt-10 sm:flex-row sm:items-center sm:justify-between">
              <p className="kh-fade-up font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight">
                Planning {category.title.toLowerCase()}?
              </p>
              <Link
                href="/#book"
                className="kh-fade-up bg-ink text-paper hover:bg-accent hover:text-ink shrink-0 px-7 py-3.5 text-[12px] tracking-[0.16em] uppercase transition-colors duration-300"
                style={delay(0.1)}
              >
                Book a consultancy
              </Link>
            </div>
          </div>
        </Reveal>
      </main>

      <SiteFooter showCta={false} />
    </>
  );
}
