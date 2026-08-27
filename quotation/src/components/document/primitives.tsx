import type { ReactNode } from 'react';
import { richText } from '@/lib/rich-text';

/**
 * The building blocks of the printed page. Every one of them spaces itself with
 * `padding-top` (see `styles/document.css`) rather than margin, because the
 * paginator measures wrappers and collapsing margins would escape them.
 */

export function DocTitle({ children }: { children: ReactNode }) {
  return <h1 className="doc-title">{children}</h1>;
}

export function DocHeading({ children }: { children: ReactNode }) {
  return <h2 className="doc-heading">{children}</h2>;
}

export function DocSubHeading({ children }: { children: ReactNode }) {
  return <h3 className="doc-subheading">{children}</h3>;
}

export function DocParagraph({ text }: { text: string }) {
  return <p className="doc-paragraph">{richText(text)}</p>;
}

export function DocNote({ text }: { text: string }) {
  return <p className="doc-note">{richText(text)}</p>;
}

/** The "➔" list used for "Why Kalope Homes" on page one. */
export function ArrowList({ items }: { items: string[] }) {
  return (
    <ul className="doc-list doc-list--arrow">
      {items.map((item) => (
        <li key={item}>{richText(item)}</li>
      ))}
    </ul>
  );
}

export function BulletList({ items, spaced = false }: { items: string[]; spaced?: boolean }) {
  return (
    <ul className={`doc-list doc-list--bullet${spaced ? ' doc-list--spaced' : ''}`}>
      {items.map((item) => (
        <li key={item}>{richText(item)}</li>
      ))}
    </ul>
  );
}
