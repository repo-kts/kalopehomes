import { z } from 'zod';

/** URL-or-empty helper (media is stored as URLs). */
export const urlField = z.url().or(z.literal('')).optional();

export const slugField = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be a lowercase, hyphenated slug');

export const contentStatus = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

/** Generates a URL-safe slug from arbitrary text. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
