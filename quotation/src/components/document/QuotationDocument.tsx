import { useMemo, type ReactNode } from 'react';
import letterhead from '@/assets/letterhead.png';
import * as doc from '@/data/document';
import { computeTotals } from '@/lib/quotation';
import type { Quotation } from '@/types/quotation';
import { ClientApproval, CostBreakup, DetailsBlock, TotalsBlock } from './DetailsBlock';
import { SectionTable } from './ItemsTable';
import { sectionRowParts } from './SectionRows';
import { PaginatedDocument, type FlowBlock } from './Paginator';
import {
  ArrowList,
  BulletList,
  DocHeading,
  DocNote,
  DocParagraph,
  DocSubHeading,
  DocTitle,
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

/** A heading plus its list, kept together so a heading never ends a page alone. */
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
    headed('why', 'Why Kalope Homes', <ArrowList items={doc.WHY_KALOPE_HOMES} />),
    headed(
      'materials',
      'Material Specifications',
      <BulletList items={doc.MATERIAL_SPECIFICATIONS} spaced />,
    ),

    // Page one ends here on the approved document; keep that break deliberate.
    { kind: 'break', id: 'break-cover' },

    {
      kind: 'atom',
      id: 'scope',
      node: (
        <>
          <DocHeading>Scope of Work</DocHeading>
          <DocSubHeading>Work Included</DocSubHeading>
          <BulletList items={doc.WORK_INCLUDED} />
        </>
      ),
    },
    {
      kind: 'atom',
      id: 'scope-excluded',
      gap: GAP.subsection,
      node: (
        <>
          <DocSubHeading>Work Not Included</DocSubHeading>
          <BulletList items={doc.WORK_NOT_INCLUDED} />
        </>
      ),
    },
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
    headed('payment', 'Payment Terms', <BulletList items={doc.PAYMENT_TERMS} />),
    headed('timeline', 'Project Timeline', <BulletList items={doc.PROJECT_TIMELINE} />),
    // The approved document opens its terms half on a fresh page; keep that.
    { kind: 'break', id: 'break-terms' },
    headed('warranty', 'Warranty', <BulletList items={doc.WARRANTY} />),
    headed('care', 'Material Care & Maintenance', <BulletList items={doc.MATERIAL_CARE} />),
    headed('site', 'Site Requirements', <BulletList items={doc.SITE_REQUIREMENTS} />),
    headed('changes', 'Design Changes / Variations', <BulletList items={doc.DESIGN_CHANGES} />),
    headed('transport', 'Transportation & Handling', <BulletList items={doc.TRANSPORTATION} />),
    headed('terms', 'Terms & Conditions', <BulletList items={doc.TERMS_AND_CONDITIONS} />),
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
          <div className="page__body">{content}</div>
        </div>
      )}
    />
  );
}
