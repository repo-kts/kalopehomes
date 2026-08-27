import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ClientDetails, LineItem, Quotation, QuoteSection } from '@/types/quotation';
import { computeTotals, createLineItem, createQuotation, createSection } from './quotation';
import { clearDraft, loadDraft, saveDraft } from './storage';

/** Holds the editable quotation and mirrors it into localStorage as it changes. */
export function useQuotation() {
  const [quotation, setQuotation] = useState<Quotation>(loadDraft);

  useEffect(() => {
    saveDraft(quotation);
  }, [quotation]);

  const mapSection = useCallback(
    (sectionId: string, update: (section: QuoteSection) => QuoteSection) => {
      setQuotation((current) => ({
        ...current,
        sections: current.sections.map((section) =>
          section.id === sectionId ? update(section) : section,
        ),
      }));
    },
    [],
  );

  const actions = useMemo(
    () => ({
      setDetail<K extends keyof ClientDetails>(key: K, value: ClientDetails[K]) {
        setQuotation((current) => ({ ...current, details: { ...current.details, [key]: value } }));
      },

      setDiscount(value: string) {
        setQuotation((current) => ({ ...current, discount: value }));
      },

      addSection(title?: string) {
        setQuotation((current) => ({
          ...current,
          sections: [...current.sections, createSection(title)],
        }));
      },

      updateSection(sectionId: string, patch: Partial<QuoteSection>) {
        mapSection(sectionId, (section) => ({ ...section, ...patch }));
      },

      removeSection(sectionId: string) {
        setQuotation((current) => {
          const sections = current.sections.filter((section) => section.id !== sectionId);
          // A quotation without a table has nothing to price; keep one alive.
          return { ...current, sections: sections.length > 0 ? sections : [createSection()] };
        });
      },

      addItem(sectionId: string, partial?: Partial<LineItem>) {
        mapSection(sectionId, (section) => ({
          ...section,
          items: [...section.items, createLineItem(partial)],
        }));
      },

      updateItem(sectionId: string, itemId: string, patch: Partial<LineItem>) {
        mapSection(sectionId, (section) => ({
          ...section,
          items: section.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
        }));
      },

      removeItem(sectionId: string, itemId: string) {
        mapSection(sectionId, (section) => {
          const items = section.items.filter((item) => item.id !== itemId);
          return { ...section, items: items.length > 0 ? items : [createLineItem()] };
        });
      },

      moveItem(sectionId: string, itemId: string, delta: -1 | 1) {
        mapSection(sectionId, (section) => {
          const from = section.items.findIndex((item) => item.id === itemId);
          const to = from + delta;
          if (from < 0 || to < 0 || to >= section.items.length) return section;
          const items = [...section.items];
          [items[from], items[to]] = [items[to], items[from]];
          return { ...section, items };
        });
      },

      reset() {
        clearDraft();
        setQuotation(createQuotation());
      },

      replace(next: Quotation) {
        setQuotation(next);
      },
    }),
    [mapSection],
  );

  const totals = useMemo(() => computeTotals(quotation), [quotation]);

  return { quotation, totals, actions };
}

export type QuotationActions = ReturnType<typeof useQuotation>['actions'];
