import { useState } from 'react';
import { formatCurrency } from '@/lib/format';
import { lineAmount } from '@/lib/quotation';
import type { QuotationActions } from '@/lib/use-quotation';
import { UNITS, type SectionTotals, type Unit } from '@/types/quotation';
import { CatalogPicker } from './CatalogPicker';

export interface SectionEditorProps {
  entry: SectionTotals;
  index: number;
  canRemove: boolean;
  actions: QuotationActions;
}

export function SectionEditor({ entry, index, canRemove, actions }: SectionEditorProps) {
  const { section } = entry;
  const [pickerOpen, setPickerOpen] = useState(false);
  /*
   * Rows whose note field is open but still empty. A row with text in its note
   * shows the field regardless, so this only has to remember the empty ones.
   */
  const [openNotes, setOpenNotes] = useState<ReadonlySet<string>>(new Set());

  const setNoteOpen = (itemId: string, open: boolean) => {
    setOpenNotes((current) => {
      const next = new Set(current);
      if (open) next.add(itemId);
      else next.delete(itemId);
      return next;
    });
  };

  return (
    <section className="card">
      <header className="card__head">
        <input
          className="input input--title"
          value={section.title}
          aria-label={`Table ${index + 1} heading`}
          placeholder="Table heading, e.g. Modular Kitchen"
          onChange={(event) => actions.updateSection(section.id, { title: event.target.value })}
        />
        {canRemove && (
          <button
            type="button"
            className="btn btn--ghost btn--danger"
            onClick={() => actions.removeSection(section.id)}
          >
            Remove
          </button>
        )}
      </header>

      <div className="rows">
        <div className="rows__head">
          <span>Category</span>
          <span>Description</span>
          <span>Unit</span>
          <span>Qty</span>
          <span>Rate</span>
          <span>Amount</span>
          <span />
        </div>

        {section.items.map((item, itemIndex) => (
          <div className="rows__item" key={item.id}>
            <div className="rows__row">
              <input
                className="input"
                value={item.category}
                aria-label="Category"
                placeholder="Modular Kitchen"
                onChange={(event) =>
                  actions.updateItem(section.id, item.id, { category: event.target.value })
                }
              />
              <input
                className="input"
                value={item.description}
                aria-label="Description"
                placeholder="L-Shape Cabinet"
                onChange={(event) =>
                  actions.updateItem(section.id, item.id, { description: event.target.value })
                }
              />
              <select
                className="input"
                value={item.unit}
                aria-label="Unit"
                onChange={(event) =>
                  actions.updateItem(section.id, item.id, { unit: event.target.value as Unit })
                }
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <input
                className="input input--num"
                value={item.quantity}
                aria-label="Quantity"
                inputMode="decimal"
                placeholder="0"
                onChange={(event) =>
                  actions.updateItem(section.id, item.id, { quantity: event.target.value })
                }
              />
              <input
                className="input input--num"
                value={item.rate}
                aria-label="Rate"
                inputMode="decimal"
                placeholder="0"
                onChange={(event) =>
                  actions.updateItem(section.id, item.id, { rate: event.target.value })
                }
              />
              <output className="rows__amount">{formatCurrency(lineAmount(item))}</output>
              <div className="rows__tools">
                <button
                  type="button"
                  className="icon-btn"
                  title="Move up"
                  disabled={itemIndex === 0}
                  onClick={() => actions.moveItem(section.id, item.id, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  title="Move down"
                  disabled={itemIndex === section.items.length - 1}
                  onClick={() => actions.moveItem(section.id, item.id, 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="icon-btn icon-btn--danger"
                  title="Delete row"
                  onClick={() => actions.removeItem(section.id, item.id)}
                >
                  ✕
                </button>
              </div>
            </div>

            {openNotes.has(item.id) || item.note ? (
              <div className="rows__note">
                <input
                  className="input"
                  value={item.note ?? ''}
                  aria-label="Note"
                  placeholder="Note printed under this row, e.g. soft-close hinges included"
                  onChange={(event) =>
                    actions.updateItem(section.id, item.id, { note: event.target.value })
                  }
                />
                <button
                  type="button"
                  className="icon-btn icon-btn--danger"
                  title="Remove note"
                  onClick={() => {
                    actions.updateItem(section.id, item.id, { note: '' });
                    setNoteOpen(item.id, false);
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="rows__note-add"
                onClick={() => setNoteOpen(item.id, true)}
              >
                + Add note
              </button>
            )}
          </div>
        ))}
      </div>

      <footer className="card__foot">
        <div className="card__actions">
          <button type="button" className="btn" onClick={() => setPickerOpen(true)}>
            Add from catalog
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => actions.addItem(section.id)}
          >
            Add blank row
          </button>
        </div>

        <label className="field field--inline">
          <span>Empty rows on the printed table</span>
          <input
            className="input input--num"
            type="number"
            min={0}
            max={10}
            value={section.blankRows}
            onChange={(event) =>
              actions.updateSection(section.id, {
                blankRows: Math.max(0, Math.min(10, Number(event.target.value) || 0)),
              })
            }
          />
        </label>

        <p className="card__total">
          Grand Total <strong>{formatCurrency(entry.grandTotal)}</strong>
        </p>
      </footer>

      {pickerOpen && (
        <CatalogPicker
          onClose={() => setPickerOpen(false)}
          onPick={(picked) => {
            actions.addItem(section.id, picked);
            setPickerOpen(false);
          }}
        />
      )}
    </section>
  );
}
