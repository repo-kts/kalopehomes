import { catalogSections } from '@/data/catalog';
import { AREA_UNIT } from '@/types/quotation';
import type {
  CatalogNode,
  ClientDetails,
  CompanyContact,
  LineItem,
  Quotation,
  QuotationTotals,
  QuoteSection,
  Unit,
} from '@/types/quotation';
import { toNumber, todayIso } from './format';

export const QUOTATION_VERSION = 1;

let counter = 0;

export function createId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}

export function createLineItem(partial: Partial<LineItem> = {}): LineItem {
  return {
    id: createId('item'),
    category: '',
    description: '',
    unit: AREA_UNIT,
    quantity: '',
    rate: '',
    ...partial,
  };
}

export function createSection(title = 'Modular Kitchen'): QuoteSection {
  return { id: createId('section'), title, items: [createLineItem()], blankRows: 2 };
}

/** What the printed letterhead has always said; the starting point every time. */
export const DEFAULT_COMPANY: CompanyContact = {
  phone: '+91 90974 59541',
  email: 'info@kalopehomes.com',
  website: 'www.kalopehomes.com',
};

export function createQuotation(): Quotation {
  const details: ClientDetails = {
    quotationNo: 'KH',
    date: todayIso(),
    clientName: '',
    projectLocation: '',
    contactNumber: '',
    preparedBy: 'Kalope Homes',
  };
  return {
    version: QUOTATION_VERSION,
    details,
    company: { ...DEFAULT_COMPANY },
    sections: [createSection()],
    discount: '',
  };
}

// ---------------------------------------------------------------------------
// Totals
// ---------------------------------------------------------------------------

export function lineAmount(item: LineItem): number {
  return toNumber(item.quantity) * toNumber(item.rate);
}

/** A row only reaches the paper once it says something — blank rows are padding. */
export function isFilled(item: LineItem): boolean {
  return Boolean(item.category.trim() || item.description.trim()) || lineAmount(item) > 0;
}

export function computeTotals(quotation: Quotation): QuotationTotals {
  const sections = quotation.sections.map((section) => {
    const filled = section.items.filter(isFilled);
    return {
      section,
      grandTotal: filled.reduce((sum, item) => sum + lineAmount(item), 0),
      area: filled
        .filter((item) => item.unit === AREA_UNIT)
        .reduce((sum, item) => sum + toNumber(item.quantity), 0),
    };
  });

  const subtotal = sections.reduce((sum, entry) => sum + entry.grandTotal, 0);
  const discount = Math.min(toNumber(quotation.discount), subtotal);

  return {
    sections,
    totalArea: sections.reduce((sum, entry) => sum + entry.area, 0),
    subtotal,
    discount,
    finalAmount: subtotal - discount,
  };
}

// ---------------------------------------------------------------------------
// Catalog -> line item
// ---------------------------------------------------------------------------

export interface ResolvedSelection {
  category: string;
  description: string;
  unit: Unit;
}

/**
 * Turns a picked mind-map path into the three columns the table needs. The
 * deepest node carrying `category` / `unit` wins; grouping-only nodes are
 * skipped, and everything after the category node forms the description.
 */
export function resolveSelection(path: CatalogNode[]): ResolvedSelection {
  let category = '';
  let unit: Unit = AREA_UNIT;
  let categoryIndex = -1;

  path.forEach((node, index) => {
    if (node.category) {
      category = node.category;
      categoryIndex = index;
    }
    if (node.unit) unit = node.unit;
  });

  const description = path
    .slice(categoryIndex + 1)
    .filter((node) => !node.omitFromDescription)
    .map((node) => node.label)
    .join(' – ');

  return { category, description, unit };
}

/** Default section title for the catalog tab currently open in the picker. */
export function catalogSectionTitle(sectionId: string): string {
  return catalogSections.find((section) => section.id === sectionId)?.label ?? 'Modular Kitchen';
}
