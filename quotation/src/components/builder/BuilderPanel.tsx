import { formatArea, formatCurrency } from '@/lib/format';
import type { QuotationActions } from '@/lib/use-quotation';
import type { ClientDetails, CompanyContact, Quotation, QuotationTotals } from '@/types/quotation';
import { SectionEditor } from './SectionEditor';

const DETAIL_FIELDS: {
  key: keyof ClientDetails;
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  { key: 'quotationNo', label: 'Quotation No.', placeholder: 'KH114' },
  { key: 'date', label: 'Date', placeholder: '', type: 'date' },
  { key: 'clientName', label: 'Client Name', placeholder: 'Chandan' },
  { key: 'projectLocation', label: 'Project Location', placeholder: 'Pulpar, Biharsharif' },
  { key: 'contactNumber', label: 'Contact Number', placeholder: '8800680879' },
  { key: 'preparedBy', label: 'Prepared By', placeholder: 'Kalope Homes' },
];

const CONTACT_FIELDS: { key: keyof CompanyContact; label: string; placeholder: string }[] = [
  { key: 'phone', label: 'Phone', placeholder: '+91 90974 59541' },
  { key: 'email', label: 'Email', placeholder: 'info@kalopehomes.com' },
  { key: 'website', label: 'Website', placeholder: 'www.kalopehomes.com' },
];

export interface BuilderPanelProps {
  quotation: Quotation;
  totals: QuotationTotals;
  actions: QuotationActions;
}

export function BuilderPanel({ quotation, totals, actions }: BuilderPanelProps) {
  return (
    <aside className="editor">
      <section className="card">
        <header className="card__head">
          <h2>Quotation details</h2>
        </header>
        <div className="fields">
          {DETAIL_FIELDS.map((field) => (
            <label className="field" key={field.key}>
              <span>{field.label}</span>
              <input
                className="input"
                type={field.type ?? 'text'}
                value={quotation.details[field.key]}
                placeholder={field.placeholder}
                onChange={(event) => actions.setDetail(field.key, event.target.value)}
              />
            </label>
          ))}
        </div>
      </section>

      {totals.sections.map((entry, index) => (
        <SectionEditor
          key={entry.section.id}
          entry={entry}
          index={index}
          canRemove={quotation.sections.length > 1}
          actions={actions}
        />
      ))}

      <button type="button" className="btn btn--wide" onClick={() => actions.addSection()}>
        Add another table
      </button>

      <section className="card">
        <header className="card__head">
          <h2>Letterhead contact</h2>
        </header>
        <div className="fields">
          {CONTACT_FIELDS.map((field) => (
            <label className="field" key={field.key}>
              <span>{field.label}</span>
              <input
                className="input"
                value={quotation.company[field.key]}
                placeholder={field.placeholder}
                onChange={(event) => actions.setCompany(field.key, event.target.value)}
              />
            </label>
          ))}
        </div>
        <p className="hint">
          Printed in the footer of every page. Clearing a field removes that line and its icon.
        </p>
      </section>

      <section className="card">
        <header className="card__head">
          <h2>Totals</h2>
        </header>
        <dl className="summary">
          <div>
            <dt>Total Area</dt>
            <dd>{formatArea(totals.totalArea)}</dd>
          </div>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatCurrency(totals.subtotal)}</dd>
          </div>
        </dl>
        <label className="field field--inline">
          <span>Discount (₹)</span>
          <input
            className="input input--num"
            value={quotation.discount}
            inputMode="decimal"
            placeholder="0"
            onChange={(event) => actions.setDiscount(event.target.value)}
          />
        </label>
        <p className="summary__final">
          Final Amount <strong>{formatCurrency(totals.finalAmount)}</strong>
        </p>
        <p className="hint">
          Only <strong>Sq.ft</strong> rows are counted towards Total Area, matching the approved
          quotation. Leave the discount blank to print Subtotal and Final Amount identically.
        </p>
      </section>
    </aside>
  );
}
