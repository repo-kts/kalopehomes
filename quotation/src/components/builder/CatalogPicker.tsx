import { useEffect, useState } from 'react';
import { catalogSections } from '@/data/catalog';
import { resolveSelection } from '@/lib/quotation';
import type { CatalogNode, LineItem } from '@/types/quotation';

export interface CatalogPickerProps {
  onPick: (item: Pick<LineItem, 'category' | 'description' | 'unit'>) => void;
  onClose: () => void;
}

/**
 * Drill-down over the kitchen mind map. A row can be opened (it has children)
 * and/or added — anything below the node that names the category resolves to a
 * usable Category / Description / Unit triple.
 */
export function CatalogPicker({ onPick, onClose }: CatalogPickerProps) {
  const [sectionId, setSectionId] = useState(catalogSections[0].id);
  const [trail, setTrail] = useState<CatalogNode[]>([]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const section = catalogSections.find((entry) => entry.id === sectionId) ?? catalogSections[0];
  const options = trail.length > 0 ? (trail[trail.length - 1].children ?? []) : section.groups;

  const add = (node: CatalogNode) => {
    const selection = resolveSelection([...trail, node]);
    if (!selection.description && !selection.category) return;
    onPick(selection);
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Add item from catalog">
      <button type="button" className="modal__scrim" aria-label="Close" onClick={onClose} />
      <div className="modal__panel">
        <header className="modal__head">
          <h2>Add item from catalog</h2>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
        </header>

        {catalogSections.length > 1 && (
          <div className="picker__tabs">
            {catalogSections.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={`chip${entry.id === sectionId ? ' is-active' : ''}`}
                onClick={() => {
                  setSectionId(entry.id);
                  setTrail([]);
                }}
              >
                {entry.label}
              </button>
            ))}
          </div>
        )}

        <nav className="picker__crumbs">
          <button type="button" className="link" onClick={() => setTrail([])}>
            {section.label}
          </button>
          {trail.map((node, index) => (
            <span key={node.id}>
              <span className="picker__sep">›</span>
              <button
                type="button"
                className="link"
                onClick={() => setTrail(trail.slice(0, index + 1))}
              >
                {node.label}
              </button>
            </span>
          ))}
        </nav>

        <ul className="picker__list">
          {options.map((node) => {
            const hasChildren = Boolean(node.children?.length);
            const preview = resolveSelection([...trail, node]);
            return (
              <li key={node.id} className="picker__row">
                <button
                  type="button"
                  className="picker__open"
                  disabled={!hasChildren}
                  onClick={() => setTrail([...trail, node])}
                >
                  <span className="picker__label">{node.label}</span>
                  {hasChildren && <span className="picker__chevron">›</span>}
                </button>
                <button
                  type="button"
                  className="btn btn--small"
                  disabled={!preview.description && !preview.category}
                  title={
                    preview.description
                      ? `${preview.category} — ${preview.description} (${preview.unit})`
                      : 'Pick a more specific option'
                  }
                  onClick={() => add(node)}
                >
                  Add
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
