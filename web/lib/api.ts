/**
 * Read-only client for the Kalope Homes API's public surface
 * (`api/src/modules/public/public.routes.ts`).
 *
 * Every call is allowed to fail. The site is a brochure: if the API is down,
 * unreachable at build time, or the database is empty, pages fall back to the
 * curated content in `site-content.ts` rather than erroring. So `getPublic`
 * returns `null` instead of throwing, and callers supply the fallback.
 */

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');

/** The API wraps every successful response as `{ data }`. */
interface Envelope<T> {
  data: T;
}

export async function getPublic<T>(path: string, revalidate = 300): Promise<T | null> {
  const url = `${API_URL}/api/v1/public${path}`;
  try {
    const response = await fetch(url, {
      next: { revalidate },
      headers: { accept: 'application/json' },
    });
    if (!response.ok) {
      console.warn(`[api] ${response.status} ${response.statusText} from ${url}`);
      return null;
    }
    const body = (await response.json()) as Envelope<T>;
    return body.data ?? null;
  } catch (error) {
    // Connection refused, DNS failure, timeout — all expected when the API
    // is not running locally. Log once and let the caller fall back.
    console.warn(`[api] unreachable: ${url} (${(error as Error).message})`);
    return null;
  }
}
