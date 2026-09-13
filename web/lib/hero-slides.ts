import { getPublic } from '@/lib/api';

/** An active HOME_HERO row, as returned by `/public/hero`. */
export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  ctaText: string | null;
  ctaLink: string | null;
}

/**
 * Active home-hero slides in the order the admin set, or an empty array when
 * the API is unreachable or nothing is scheduled. The endpoint already filters
 * on `isActive` and the startsAt/endsAt window, so whatever comes back is
 * meant to be on screen right now.
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const slides = await getPublic<HeroSlide[]>('/hero?placement=HOME_HERO');
  return slides?.filter((slide) => slide.imageUrl) ?? [];
}

/**
 * Splits a headline so the last word carries the accent colour, matching the
 * hand-written headline this replaces ("like *architecture.*"). A rule rather
 * than markup, so the admin only ever types plain text.
 */
export function splitHeadline(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return { lead: '', accent: title.trim() };
  return { lead: `${words.slice(0, -1).join(' ')} `, accent: words[words.length - 1] };
}
