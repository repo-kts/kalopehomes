import type { ReactNode } from 'react';
import { COL_WIDTHS, COLUMNS } from './columns';

export interface SectionTableProps {
  title: string;
  /** One <tbody> per item — see `sectionRowParts`. */
  rows: ReactNode[];
  /** False on continuation pages, where the heading gains "(contd.)". */
  isFirst: boolean;
}

export function SectionTable({ title, rows, isFirst }: SectionTableProps) {
  return (
    <div className="section-table">
      <h3 className="section-table__title">{isFirst ? title : `${title} (contd.)`}</h3>
      <table className="items-table">
        <colgroup>
          {COL_WIDTHS.map((width, index) => (
            <col key={COLUMNS[index]} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        {rows}
      </table>
    </div>
  );
}
