/** Units offered in the "Unit" column of a quotation table. */
export const UNITS = ['Sq.ft', 'Nos', 'Rft', 'Set', 'Lump Sum'] as const;

export type Unit = (typeof UNITS)[number];

/** Only `Sq.ft` rows contribute to the "Total Area" line on the document. */
export const AREA_UNIT: Unit = 'Sq.ft';

// ---------------------------------------------------------------------------
// Catalog (mind-map derived selection tree)
// ---------------------------------------------------------------------------

export interface CatalogNode {
  id: string;
  label: string;
  /** Unit for this node and everything below it, unless overridden deeper. */
  unit?: Unit;
  /** Fills the "Category" column for any row picked at or below this node. */
  category?: string;
  /** Grouping-only node — kept in the picker, dropped from the description. */
  omitFromDescription?: boolean;
  children?: CatalogNode[];
}

export interface CatalogSection {
  id: string;
  label: string;
  groups: CatalogNode[];
}

// ---------------------------------------------------------------------------
// Quotation document (the dynamic half of the printed page)
// ---------------------------------------------------------------------------

export interface LineItem {
  id: string;
  category: string;
  description: string;
  unit: Unit;
  /** Kept as strings so a half-typed "1." doesn't fight the input. */
  quantity: string;
  rate: string;
}

export interface QuoteSection {
  id: string;
  /** Centred heading printed above the table, e.g. "Modular Kitchen". */
  title: string;
  items: LineItem[];
  /**
   * Empty rows padded onto the end of the table. The reference quotation
   * (KH114) leaves two, so a hand-written addition still has somewhere to go.
   */
  blankRows: number;
}

export interface ClientDetails {
  quotationNo: string;
  /** ISO `yyyy-mm-dd`; printed as "3 April, 2026". */
  date: string;
  clientName: string;
  projectLocation: string;
  contactNumber: string;
  preparedBy: string;
}

export interface Quotation {
  /** Bumped when the persisted shape changes so stale drafts are discarded. */
  version: number;
  details: ClientDetails;
  sections: QuoteSection[];
  /** Flat amount taken off the subtotal to reach the final amount. */
  discount: string;
}

export interface SectionTotals {
  section: QuoteSection;
  grandTotal: number;
  area: number;
}

export interface QuotationTotals {
  sections: SectionTotals[];
  totalArea: number;
  subtotal: number;
  discount: number;
  finalAmount: number;
}
