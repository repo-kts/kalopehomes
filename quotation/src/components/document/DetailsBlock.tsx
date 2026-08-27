import { formatArea, formatCurrency, formatDocumentDate } from '@/lib/format';
import type { ClientDetails, QuotationTotals } from '@/types/quotation';

/** The six-line header block — the part of page one that changes per client. */
export function DetailsBlock({ details }: { details: ClientDetails }) {
  const rows: { label: string; value: string; className?: string }[] = [
    { label: 'Quotation No.', value: details.quotationNo },
    { label: 'Date', value: formatDocumentDate(details.date) },
    { label: 'Client Name', value: details.clientName, className: 'is-bold' },
    { label: 'Project Location', value: details.projectLocation },
    { label: 'Contact Number', value: details.contactNumber },
    { label: 'Prepared By', value: details.preparedBy, className: 'is-italic' },
  ];

  return (
    <div className="details-block">
      {rows.map((row) => (
        <div className="details-block__row" key={row.label}>
          <span className="details-block__label">{row.label}:</span>
          <span className={`details-block__value ${row.className ?? ''}`}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Total Area / Subtotal / Final Amount, printed under the last section table. */
export function TotalsBlock({ totals }: { totals: QuotationTotals }) {
  return (
    <div className="totals-block">
      <div className="totals-block__row">
        <span className="totals-block__label">Total Area</span>
        <span className="totals-block__colon">:</span>
        <span className="totals-block__value">{formatArea(totals.totalArea)}</span>
      </div>
      <div className="totals-block__row">
        <span className="totals-block__label">Subtotal</span>
        <span className="totals-block__colon">:</span>
        <span className="totals-block__value">{formatCurrency(totals.subtotal)}</span>
      </div>
      {totals.discount > 0 && (
        <div className="totals-block__row">
          <span className="totals-block__label">Discount</span>
          <span className="totals-block__colon">:</span>
          <span className="totals-block__value">– {formatCurrency(totals.discount)}</span>
        </div>
      )}
      <div className="totals-block__row totals-block__row--final">
        <span className="totals-block__label">Final Amount</span>
        <span className="totals-block__colon">:</span>
        <span className="totals-block__value">{formatCurrency(totals.finalAmount)}</span>
      </div>
    </div>
  );
}

/** Signature lines at the end of the document. */
export function ClientApproval({ fields }: { fields: string[] }) {
  return (
    <div className="approval-block">
      {fields.map((field) => (
        <div className="approval-block__row" key={field}>
          <span className="approval-block__label">{field}</span>
          <span>: __________________________</span>
        </div>
      ))}
    </div>
  );
}

/** The two-column Component / Approx % list under "COST BREAKUP". */
export function CostBreakup({ rows }: { rows: { component: string; percent: string }[] }) {
  return (
    <div className="breakup-block">
      <div className="breakup-block__row breakup-block__row--head">
        <span className="breakup-block__component">Component</span>
        <span className="breakup-block__percent">Approx %</span>
      </div>
      <ul className="doc-list doc-list--bullet">
        {rows.map((row) => (
          <li key={row.component}>
            <span className="breakup-block__component">{row.component}</span>
            <span className="breakup-block__percent">{row.percent}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
