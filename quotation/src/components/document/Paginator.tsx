import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

export interface SliceMeta {
  isFirst: boolean;
  isLast: boolean;
}

export interface FlowPart {
  id: string;
  node: ReactNode;
}

/** Gap above a block, in millimetres — the space between two sections. */
export const DEFAULT_GAP_MM = 8.5;

/**
 * A unit of document flow.
 *  - `atom`  never breaks; moves to the next page whole.
 *  - `split` may break between its parts — the item tables, whose rows carry a
 *            `data-flow-part` attribute so they can be measured individually.
 *            `render` rebuilds the surrounding chrome (heading + table head)
 *            for every page slice.
 *  - `break` forces the next block onto a fresh page.
 *
 * Blocks must space themselves with padding rather than margin: collapsing
 * margins escape the measured wrapper and would be counted as zero.
 */
export type FlowBlock =
  | { kind: 'atom'; id: string; gap?: number; node: ReactNode }
  | { kind: 'break'; id: string }
  | {
      kind: 'split';
      id: string;
      gap?: number;
      parts: FlowPart[];
      render: (parts: ReactNode[], meta: SliceMeta) => ReactNode;
    };

/**
 * Both passes wrap blocks in this exact element, so the gap is part of the
 * measured height and the packing arithmetic stays honest. The gap travels as a
 * custom property rather than inline padding so the "first block on the page"
 * rule in the stylesheet can still zero it.
 */
function blockStyle(gap: number = DEFAULT_GAP_MM): CSSProperties {
  return { '--flow-gap': `${gap}mm` } as CSSProperties;
}

/** Guards against sub-pixel rounding pushing one row onto a page of its own. */
const ROUNDING_SLACK = 2;

interface Measurements {
  capacity: number;
  /** Outer height of each block, indexed the same as `blocks`. */
  blockHeights: number[];
  /** The gap included in each block height, dropped when it opens a page. */
  gapHeights: number[];
  /** For split blocks: the height of every part, and of the chrome around them. */
  partHeights: Record<number, number[]>;
  chromeHeights: Record<number, number>;
}

function outerHeight(element: HTMLElement): number {
  const style = window.getComputedStyle(element);
  const margins =
    (Number.parseFloat(style.marginTop) || 0) + (Number.parseFloat(style.marginBottom) || 0);
  return element.getBoundingClientRect().height + margins;
}

function measure(root: HTMLElement, body: HTMLElement, blocks: FlowBlock[]): Measurements {
  const blockHeights: number[] = [];
  const gapHeights: number[] = [];
  const partHeights: Record<number, number[]> = {};
  const chromeHeights: Record<number, number> = {};

  blocks.forEach((block, index) => {
    const element = root.querySelector<HTMLElement>(`[data-flow-index="${index}"]`);
    if (!element) {
      blockHeights[index] = 0;
      gapHeights[index] = 0;
      return;
    }
    const height = outerHeight(element);
    blockHeights[index] = height;
    gapHeights[index] = Number.parseFloat(window.getComputedStyle(element).paddingTop) || 0;

    if (block.kind === 'split') {
      const heights = Array.from(element.querySelectorAll<HTMLElement>('[data-flow-part]')).map(
        (part) => part.getBoundingClientRect().height,
      );
      partHeights[index] = heights;
      chromeHeights[index] = Math.max(0, height - heights.reduce((sum, value) => sum + value, 0));
    }
  });

  return {
    capacity: body.getBoundingClientRect().height - ROUNDING_SLACK,
    blockHeights,
    gapHeights,
    partHeights,
    chromeHeights,
  };
}

/** Packs measured blocks into fixed-height pages, splitting tables where needed. */
function paginate(blocks: FlowBlock[], m: Measurements): ReactNode[][] {
  const pages: ReactNode[][] = [];
  let page: ReactNode[] = [];
  let used = 0;

  const flush = () => {
    if (page.length > 0) pages.push(page);
    page = [];
    used = 0;
  };
  const remaining = () => m.capacity - used;

  blocks.forEach((block, index) => {
    if (block.kind === 'break') {
      flush();
      return;
    }

    if (block.kind === 'atom') {
      const full = m.blockHeights[index] ?? 0;
      if (page.length > 0 && full > remaining()) flush();
      // The stylesheet zeroes the gap on the first block of a page.
      const height = page.length === 0 ? full - (m.gapHeights[index] ?? 0) : full;
      page.push(
        <div key={block.id} className="flow-block" style={blockStyle(block.gap)}>
          {block.node}
        </div>,
      );
      used += height;
      return;
    }

    const heights = m.partHeights[index] ?? [];
    const fullChrome = m.chromeHeights[index] ?? 0;
    const gap = m.gapHeights[index] ?? 0;
    let cursor = 0;
    let sliceIndex = 0;
    let isFirst = true;

    while (cursor < block.parts.length) {
      // The heading and table head must be able to carry at least one row with them.
      if (page.length > 0 && fullChrome + (heights[cursor] ?? 0) > remaining()) flush();

      const chrome = page.length === 0 ? fullChrome - gap : fullChrome;
      const available = remaining() - chrome;
      const slice: ReactNode[] = [];
      let sliceHeight = 0;

      while (cursor < block.parts.length) {
        const height = heights[cursor] ?? 0;
        // Always take one part, otherwise an oversized row would loop forever.
        if (slice.length > 0 && sliceHeight + height > available) break;
        slice.push(block.parts[cursor].node);
        sliceHeight += height;
        cursor += 1;
      }

      const isLast = cursor >= block.parts.length;
      page.push(
        <div key={`${block.id}-${sliceIndex}`} className="flow-block" style={blockStyle(block.gap)}>
          {block.render(slice, { isFirst, isLast })}
        </div>,
      );
      used += chrome + sliceHeight;
      sliceIndex += 1;
      isFirst = false;

      if (!isLast) flush();
    }
  });

  flush();
  return pages.length > 0 ? pages : [[]];
}

export interface PaginatedDocumentProps {
  blocks: FlowBlock[];
  /** Wraps each finished page — supplies the letterhead background and body box. */
  renderPage: (content: ReactNode, pageNumber: number, pageCount: number) => ReactNode;
  onPageCount?: (pageCount: number) => void;
}

/**
 * Lays a linear list of blocks out onto A4 pages by measuring them off-screen
 * first. Measuring beats CSS `break-inside` here because every page needs the
 * letterhead painted behind it, which a single flowing column cannot produce.
 */
export function PaginatedDocument({ blocks, renderPage, onPageCount }: PaginatedDocumentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<ReactNode[][]>([]);
  const [fontEpoch, setFontEpoch] = useState(0);

  /*
   * Re-measure and re-paginate on every edit. `blocks` is rebuilt only when the
   * quotation changes, so `setPages` cannot feed back into this effect — and it
   * must run even when nothing moves, because the pages hold rendered nodes:
   * typing a client name changes the text without changing a single height.
   */
  useLayoutEffect(() => {
    const root = rootRef.current;
    const body = bodyRef.current;
    if (!root || !body) return;

    const measurements = measure(root, body, blocks);
    if (measurements.capacity <= 0) return;

    setPages(paginate(blocks, measurements));
  }, [blocks, fontEpoch]);

  useEffect(() => {
    onPageCount?.(pages.length);
  }, [onPageCount, pages.length]);

  // A web-font swap changes every height; re-measure once the real faces land.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready?.then(() => {
      if (!cancelled) setFontEpoch((epoch) => epoch + 1);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div ref={rootRef} className="flow-measurer" aria-hidden="true">
        <div className="page">
          <div className="page__body" ref={bodyRef}>
            {blocks.map((block, index) => {
              if (block.kind === 'break') return null;
              return (
                <div
                  key={block.id}
                  className="flow-block"
                  style={blockStyle(block.gap)}
                  data-flow-index={index}
                >
                  {block.kind === 'atom'
                    ? block.node
                    : block.render(
                        block.parts.map((part) => part.node),
                        { isFirst: true, isLast: true },
                      )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {pages.map((content, index) => (
        <div key={`page-${index}`} className="page-slot">
          {renderPage(content, index + 1, pages.length)}
        </div>
      ))}
    </>
  );
}
