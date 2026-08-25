import { randomBytes } from 'node:crypto';

/**
 * Human-friendly, collision-resistant reference like "LD-LX3F9A2B".
 * The random suffix (uppercase base32) keeps concurrent inserts unique without
 * a DB sequence; callers rely on the unique constraint as the final guard.
 */
export function generateReference(prefix: string): string {
  const suffix = randomBytes(5).toString('hex').toUpperCase().slice(0, 8);
  return `${prefix}-${suffix}`;
}
