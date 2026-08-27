import { Fragment, type ReactNode } from 'react';

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

/**
 * Minimal inline markup for the fixed document copy — `**bold**` and
 * `*italic*` only. The source text is ours (see `data/document.ts`), so a full
 * markdown parser would be dead weight.
 */
export function richText(text: string): ReactNode {
  const parts = text.split(TOKEN).filter((part) => part !== '');

  return parts.map((part, index) => {
    const key = `${index}-${part}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}
