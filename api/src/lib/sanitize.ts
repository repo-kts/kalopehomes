const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'ul',
  'ol',
  'li',
  'blockquote',
  'a',
  'img',
  'span',
  'div',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title']),
};

function isAllowedUrl(value: string): boolean {
  if (!value) return false;

  try {
    const href = new URL(value, 'https://example.com');
    return ['http:', 'https:', 'mailto:'].includes(href.protocol) || value.startsWith('data:image/');
  } catch {
    return false;
  }
}

function safeAttr(tag: string, name: string, value: string): string | null {
  const lowerName = name.toLowerCase();
  if (lowerName.startsWith('on')) return null;
  if (!ALLOWED_ATTRS[tag]?.has(lowerName)) return null;

  if (lowerName === 'href' || lowerName === 'src') {
    return isAllowedUrl(value) ? value : null;
  }

  return value.replace(/[<>"']/g, '').trim();
}

export function sanitizeBlogHtml(raw: string): string {
  const html = typeof raw === 'string' ? raw : '';
  const tagPattern = /<\/?([a-z0-9-]+)([^>]*)>/gi;
  let lastIndex = 0;
  let result = '';

  for (const match of html.matchAll(tagPattern)) {
    const full = match[0];
    const start = match.index ?? 0;
    const tagName = (match[1] ?? '').toLowerCase();
    const attrText = match[2] ?? '';

    result += html.slice(lastIndex, start);
    lastIndex = start + full.length;

    if (!(tagName && ALLOWED_TAGS.has(tagName))) {
      continue;
    }

    if (full.startsWith('</')) {
      result += `</${tagName}>`;
      continue;
    }

    const attrs: string[] = [];
    const attrPattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    for (const attrMatch of attrText.matchAll(attrPattern)) {
      const attrName = attrMatch[1];
      const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
      const normalized = safeAttr(tagName, attrName, attrValue);
      if (normalized === null) continue;
      attrs.push(`${attrName}="${normalized.replace(/"/g, '&quot;')}"`);
    }

    const renderedAttrs = attrs.length ? ` ${attrs.join(' ')}` : '';
    result += `<${tagName}${renderedAttrs}>`;
  }

  result += html.slice(lastIndex);

  return result
    .replace(/<\s*script[^>]*>.*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*style[^>]*>.*?<\s*\/\s*style\s*>/gi, '')
    .replace(/on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim();
}
