import type { Quotation } from '@/types/quotation';
import { QUOTATION_VERSION, createQuotation } from './quotation';

const KEY = 'kalope.quotation.draft';

/** Saved drafts are best-effort: a blocked or full localStorage must not break the editor. */
export function loadDraft(): Quotation {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createQuotation();
    const parsed = JSON.parse(raw) as Quotation;
    if (parsed?.version !== QUOTATION_VERSION || !Array.isArray(parsed.sections)) {
      return createQuotation();
    }
    return parsed;
  } catch {
    return createQuotation();
  }
}

export function saveDraft(quotation: Quotation): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(quotation));
  } catch {
    // Quota or private-mode failure — the in-memory draft is still intact.
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to recover from; the caller resets state regardless.
  }
}
