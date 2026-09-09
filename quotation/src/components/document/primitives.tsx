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

/** "●" throughout; "➔" for "Why Kalope Homes" on page one. */
export type ListMarker = 'bullet' | 'arrow';

/**
 * The <ul> shell. It takes rendered entries rather than the strings, because
 * the paginator hands it one page's worth at a time — see `headedList` in
 * `QuotationDocument`.
 */
export function DocList({
  marker = 'bullet',
  spaced = false,
  children,
}: {
  marker?: ListMarker;
  spaced?: boolean;
  children: ReactNode;
}) {
  return (
    <ul className={`doc-list doc-list--${marker}${spaced ? ' doc-list--spaced' : ''}`}>
      {children}
    </ul>
  );
}

/**
 * One entry. `data-flow-part` is what lets the paginator measure entries singly
 * and break the list between them.
 */
export function DocListItem({ id, text }: { id: string; text: string }) {
  return <li data-flow-part={id}>{richText(text)}</li>;
}
