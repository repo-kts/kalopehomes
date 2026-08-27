/** Indian digit grouping: 236050 -> "2,36,050". */
const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });

/** Parses a form field that may be blank or half-typed. */
export function toNumber(value: string | number | null | undefined): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number.parseFloat(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Table cells print bare digits, exactly as the reference quotation does. */
export function formatPlain(value: number): string {
  return String(Math.round(value * 100) / 100);
}

/** Grouped, no symbol — "2,36,050". */
export function formatGrouped(value: number): string {
  return inr.format(Math.round(value * 100) / 100);
}

/** Grouped with the rupee sign — "₹2,36,050". */
export function formatCurrency(value: number): string {
  return `₹${formatGrouped(value)}`;
}

/** Trims trailing zeros so "218" doesn't print as "218.00". */
export function formatArea(value: number): string {
  return `${formatGrouped(value)} sq. ft.`;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** `2026-04-03` -> `3 April, 2026`, the format used on the approved document. */
export function formatDocumentDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return iso;
  const [, year, month, day] = match;
  const monthName = MONTHS[Number(month) - 1];
  if (!monthName) return iso;
  return `${Number(day)} ${monthName}, ${year}`;
}

export function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
