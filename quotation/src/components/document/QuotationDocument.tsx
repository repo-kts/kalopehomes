import { useMemo, type ReactNode } from 'react';
import letterhead from '@/assets/letterhead.png';
import * as doc from '@/data/document';
import { computeTotals } from '@/lib/quotation';
import type { Quotation } from '@/types/quotation';
import { ClientApproval, CostBreakup, DetailsBlock, TotalsBlock } from './DetailsBlock';
import { SectionTable } from './ItemsTable';
import { LetterheadContact } from './LetterheadContact';
import { sectionRowParts } from './SectionRows';
import { PaginatedDocument, type FlowBlock } from './Paginator';
import {
  DocHeading,
  DocList,
  DocListItem,
  DocNote,
  DocParagraph,
  DocSubHeading,
  DocTitle,
  type ListMarker,
} from './primitives';

/**
 * Gaps between blocks, in millimetres, measured off the approved document.
 * They are not a design system — they reproduce the empty paragraphs the
 * original was typed with.
 */
const GAP = {
  details: 5.9,
  intro: 5.2,
  subsection: 5,
  note: 4.2,
  table: 4.1,
  afterTable: 5.1,
  totals: 5.1,
} as const;

/** A heading plus a body that cannot be broken up — moves whole, heading and all. */
function headed(id: string, heading: string, body: ReactNode): FlowBlock {
  return {
    kind: 'atom',
    id,
    node: (
      <>
        <DocHeading>{heading}</DocHeading>
        {body}
      </>
    ),
  };
}

interface HeadedListOptions {
  heading?: string;
  subHeading?: string;
  marker?: ListMarker;
  spaced?: boolean;
  gap?: number;
}

/**
 * A heading and its list, as a block the paginator may break between entries.
 *
 * Two guarantees fall out of the `split` packing rule, which refuses to place
 * the chrome without at least one entry under it:
 *  - a heading is never left at the foot of a page on its own — when the space
 *    left cannot hold the heading *and* an entry, the break falls above the
 *    heading and the two travel to the next page together;
 *  - a list too long for one page continues on the next instead of being
 *    clipped, repeating its heading as "… (contd.)" like the item tables.
 */
function headedList(id: string, items: string[], options: HeadedListOptions = {}): FlowBlock {
  const { heading, subHeading, marker, spaced, gap } = options;

  return {
    kind: 'split',
    id,
    gap,
    parts: items.map((item, index) => {
      const partId = `${id}-${index}`;
      return { id: partId, node: <DocListItem key={partId} id={partId} text={item} /> };
    }),
    render: (entries, meta) => {
      // "(contd.)" goes on the most specific label the block prints.
      const contd = (label: string) => (meta.isFirst ? label : `${label} (contd.)`);
      return (
        <>
          {heading !== undefined && (
            <DocHeading>{subHeading ? heading : contd(heading)}</DocHeading>
          )}
          {subHeading !== undefined && <DocSubHeading>{contd(subHeading)}</DocSubHeading>}
          <DocList marker={marker} spaced={spaced}>
            {entries}
          </DocList>
        </>
      );
    },
  };
}

function buildBlocks(quotation: Quotation): FlowBlock[] {
  const totals = computeTotals(quotation);

  const blocks: FlowBlock[] = [
    { kind: 'atom', id: 'title', gap: 0, node: <DocTitle>{doc.DOCUMENT_TITLE}</DocTitle> },
    {
      kind: 'atom',
      id: 'details',
      gap: GAP.details,
      node: <DetailsBlock details={quotation.details} />,
    },
    {
      kind: 'atom',
      id: 'intro',
      gap: GAP.intro,
      node: <DocParagraph text={doc.INTRO_PARAGRAPH} />,
    },
    headedList('why', doc.WHY_KALOPE_HOMES, { heading: 'Why Kalope Homes', marker: 'arrow' }),
    headedList('materials', doc.MATERIAL_SPECIFICATIONS, {
      heading: 'Material Specifications',
      spaced: true,
    }),

    // Page one ends here on the approved document; keep that break deliberate.
    { kind: 'break', id: 'break-cover' },

    headedList('scope', doc.WORK_INCLUDED, {
      heading: 'Scope of Work',
      subHeading: 'Work Included',
    }),
    headedList('scope-excluded', doc.WORK_NOT_INCLUDED, {
      subHeading: 'Work Not Included',
      gap: GAP.subsection,
    }),
    {
      kind: 'atom',
      id: 'exclusions-note',
      gap: GAP.note,
      node: <DocNote text={doc.EXCLUSIONS_NOTE} />,
    },
  ];

  totals.sections.forEach((entry) => {
    blocks.push({
      kind: 'split',
      id: entry.section.id,
      gap: GAP.table,
      parts: sectionRowParts(entry),
      render: (rows, meta) => (
        <SectionTable title={entry.section.title} rows={rows} isFirst={meta.isFirst} />
      ),
    });
  });

  blocks.push(
    {
      kind: 'atom',
      id: 'taxes-note',
      gap: GAP.afterTable,
      node: <DocNote text={doc.TAXES_NOTE} />,
    },
    { kind: 'atom', id: 'totals', gap: GAP.totals, node: <TotalsBlock totals={totals} /> },
    {
      kind: 'atom',
      id: 'billing-notes',
      gap: GAP.totals,
      node: (
        <div className="doc-plain-notes">
          {doc.BILLING_NOTES.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      ),
    },
    headed('cost-breakup', 'COST BREAKUP', <CostBreakup rows={doc.COST_BREAKUP} />),
    headedList('payment', doc.PAYMENT_TERMS, { heading: 'Payment Terms' }),
    headedList('timeline', doc.PROJECT_TIMELINE, { heading: 'Project Timeline' }),
    headedList('warranty', doc.WARRANTY, { heading: 'Warranty' }),
    headedList('care', doc.MATERIAL_CARE, { heading: 'Material Care & Maintenance' }),
    headedList('site', doc.SITE_REQUIREMENTS, { heading: 'Site Requirements' }),
    headedList('changes', doc.DESIGN_CHANGES, { heading: 'Design Changes / Variations' }),
    headedList('transport', doc.TRANSPORTATION, { heading: 'Transportation & Handling' }),
    headedList('terms', doc.TERMS_AND_CONDITIONS, { heading: 'Terms & Conditions' }),
    headed('approval', 'Client Approval', <ClientApproval fields={doc.CLIENT_APPROVAL_FIELDS} />),
  );

  return blocks;
}

export interface QuotationDocumentProps {
  quotation: Quotation;
  onPageCount?: (pageCount: number) => void;
}

export function QuotationDocument({ quotation, onPageCount }: QuotationDocumentProps) {
  const blocks = useMemo(() => buildBlocks(quotation), [quotation]);

  return (
    <PaginatedDocument
      blocks={blocks}
      onPageCount={onPageCount}
      renderPage={(content) => (
        <div className="page">
          <img className="page__letterhead" src={letterhead} alt="" />
          <LetterheadContact company={quotation.company} />
          <div className="page__body">{content}</div>
        </div>
      )}
    />
  );
}
