import { getPublic } from '@/lib/api';
import { gallery as fallbackGallery, type GalleryItem } from '@/lib/site-content';

/** A published row of the `gallery` table, as returned by `/public/gallery`. */
interface GalleryRecord {
  id: string;
  title: string;
  description: string | null;
  imageUrls: string[];
  isFeatured: boolean;
}

export interface GalleryTile extends GalleryItem {
  /**
   * True for images that came from the CMS. Those live on whatever host was
   * pasted into the admin, which cannot be known ahead of time and so cannot
   * be listed in `images.remotePatterns` — they are rendered unoptimized.
   */
  fromCms: boolean;
}

/**
 * Tile shapes repeat on this cycle. The CMS stores no aspect ratio, and a wall
 * of identical tiles reads as a table, so the varied heights are assigned here
 * by position. The cycle length is coprime with the column counts (2, 3, 4) so
 * the same shape does not stack up in one column.
 */
const SHAPE_CYCLE = ['tall', 'square', 'wide', 'square', 'tall', 'wide', 'square'] as const;

/**
 * Every published gallery image, newest and featured first, flattened one tile
 * per image. Falls back to the curated placeholder set when the API is
 * unreachable or has nothing published yet, so the page is never empty.
 */
export async function getGalleryTiles(): Promise<{ tiles: GalleryTile[]; live: boolean }> {
  const records = await getPublic<GalleryRecord[]>('/gallery');

  const tiles: GalleryTile[] =
    records?.flatMap((record) =>
      record.imageUrls.filter(Boolean).map((src) => ({
        src,
        label: record.title,
        // The CMS has no per-image alt text, so the item's own words are the
        // best description available. Falls back to the title.
        alt: record.description?.trim() || record.title,
        shape: 'square' as GalleryItem['shape'],
        fromCms: true,
      })),
    ) ?? [];

  if (tiles.length === 0) {
    return {
      tiles: fallbackGallery.map((item) => ({ ...item, fromCms: false })),
      live: false,
    };
  }

  return {
    tiles: tiles.map((tile, i) => ({ ...tile, shape: SHAPE_CYCLE[i % SHAPE_CYCLE.length] })),
    live: true,
  };
}
