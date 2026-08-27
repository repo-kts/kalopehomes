import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { BuilderPanel } from '@/components/builder/BuilderPanel';
import { QuotationDocument } from '@/components/document/QuotationDocument';
import { SAMPLE_QUOTATION } from '@/data/sample';
import { useQuotation } from '@/lib/use-quotation';
import './App.css';

/** A4 width in CSS pixels at the 96 dpi reference resolution. */
const PAGE_WIDTH_PX = (210 / 25.4) * 96;
const GUTTER_PX = 48;

const ZOOM_STEPS = [0.4, 0.5, 0.6, 0.75, 0.9, 1, 1.25];

export default function App() {
  const { quotation, totals, actions } = useQuotation();
  const [pageCount, setPageCount] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(0.6);
  // `null` keeps the preview fitted to the viewport; a number pins the zoom.
  const [pinnedScale, setPinnedScale] = useState<number | null>(null);
  const scale = pinnedScale ?? fitScale;

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width - GUTTER_PX;
      setFitScale(Math.min(1, Math.max(0.25, width / PAGE_WIDTH_PX)));
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const zoom = (direction: -1 | 1) => {
    const current = ZOOM_STEPS.reduce((best, step) =>
      Math.abs(step - scale) < Math.abs(best - scale) ? step : best,
    );
    const next = ZOOM_STEPS[ZOOM_STEPS.indexOf(current) + direction];
    if (next) setPinnedScale(next);
  };

  const reset = () => {
    if (window.confirm('Clear this quotation and start a new one?')) actions.reset();
  };

  const handlePageCount = useCallback((count: number) => setPageCount(count), []);

  useEffect(() => {
    const title = quotation.details.quotationNo.trim() || 'Quotation';
    const client = quotation.details.clientName.trim();
    // The browser's print dialog seeds the PDF filename from document.title.
    document.title = client ? `${title}_${client.replace(/\s+/g, '_')}` : title;
  }, [quotation.details.clientName, quotation.details.quotationNo]);

  return (
    <div className="app">
      <header className="app__bar">
        <div className="brand">
          <span className="brand__mark">K</span>
          <div>
            <strong>Kalope Homes</strong>
            <span className="brand__sub">Quotation Builder</span>
          </div>
        </div>

        <div className="app__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => actions.replace(SAMPLE_QUOTATION)}
          >
            Load KH114 sample
          </button>
          <button type="button" className="btn btn--ghost" onClick={reset}>
            New quotation
          </button>
          <button type="button" className="btn btn--primary" onClick={() => window.print()}>
            Print / Save as PDF
          </button>
        </div>
      </header>

      <main className="app__main">
        <BuilderPanel quotation={quotation} totals={totals} actions={actions} />

        <section className="preview">
          <div className="preview__toolbar">
            <span className="preview__label">
              A4 preview · {pageCount} {pageCount === 1 ? 'page' : 'pages'}
            </span>
            <div className="preview__zoom">
              <button type="button" className="icon-btn" title="Zoom out" onClick={() => zoom(-1)}>
                −
              </button>
              <span className="preview__scale-label">{Math.round(scale * 100)}%</span>
              <button type="button" className="icon-btn" title="Zoom in" onClick={() => zoom(1)}>
                +
              </button>
              <button type="button" className="btn btn--small" onClick={() => setPinnedScale(null)}>
                Fit
              </button>
            </div>
          </div>

          <div
            className="preview__viewport"
            ref={viewportRef}
            style={{ '--preview-scale': scale } as CSSProperties}
          >
            <QuotationDocument quotation={quotation} onPageCount={handlePageCount} />
          </div>
        </section>
      </main>
    </div>
  );
}
