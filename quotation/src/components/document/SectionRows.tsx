// oxlint-disable react/only-export-components -- this module's only export is
// the row builder; the <tr> components are private helpers, so a full reload on
// edit is the correct fast-refresh behaviour.
import { formatPlain, toNumber } from '@/lib/format';
import { isFilled, lineAmount } from '@/lib/quotation';
import type { SectionTotals } from '@/types/quotation';
import { COLUMNS } from './columns';
import type { FlowPart } from './Paginator';

/**
 * Every part is a <tbody> rather than a bare <tr>: an item and its note are two
 * rows that must never be parted by a page break, and a tbody is the only
 * grouping a table allows. A table may hold any number of them.
 */
function DataRow({ item }: { item: SectionTotals['section']['items'][number] }) {
  const amount = lineAmount(item);
  const note = item.note?.trim();
  return (
    <tbody data-flow-part={item.id}>
      <tr>
        <td>{item.category}</td>
        <td>{item.description}</td>
        <td>{item.unit}</td>
        <td>{item.quantity ? formatPlain(toNumber(item.quantity)) : ''}</td>
        <td>{item.rate ? formatPlain(toNumber(item.rate)) : ''}</td>
        <td>{amount > 0 ? formatPlain(amount) : ''}</td>
      </tr>
      {note && (
        <tr>
          <td className="items-table__note" colSpan={COLUMNS.length}>
            Note: {note}
          </td>
        </tr>
      )}
    </tbody>
  );
}

function BlankRow({ id }: { id: string }) {
  return (
    <tbody data-flow-part={id}>
      <tr>
        {COLUMNS.map((column) => (
          <td key={column}>&nbsp;</td>
        ))}
      </tr>
    </tbody>
  );
}

function GrandTotalRow({ id, total }: { id: string; total: number }) {
  return (
    <tbody data-flow-part={id}>
      <tr className="items-table__total">
        <td />
        <td />
        <td />
        <td />
        <td className="is-label">Grand Total</td>
        <td className="is-label">{formatPlain(total)}</td>
      </tr>
    </tbody>
  );
}

/**
 * Builds the rows of one section table as individually measurable parts, so a
 * long section can spill onto the next page without losing its header.
 */
export function sectionRowParts({ section, grandTotal }: SectionTotals): FlowPart[] {
  const parts: FlowPart[] = section.items
    .filter(isFilled)
    .map((item) => ({ id: item.id, node: <DataRow key={item.id} item={item} /> }));

  for (let index = 0; index < section.blankRows; index += 1) {
    const id = `${section.id}-blank-${index}`;
    parts.push({ id, node: <BlankRow key={id} id={id} /> });
  }

  const totalId = `${section.id}-total`;
  parts.push({
    id: totalId,
    node: <GrandTotalRow key={totalId} id={totalId} total={grandTotal} />,
  });

  return parts;
}
