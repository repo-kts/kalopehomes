import type { CatalogNode, CatalogSection } from '@/types/quotation';

/**
 * Kitchen selection tree, transcribed from the Kalope Homes kitchen mind map
 * (https://mindmapai.app/mind-map/kitchen-2d9760b2). Labels are title-cased and
 * a handful of obvious spellings are corrected ("GODERJ" -> "Godrej",
 * "CUP & SOCCER" -> "Cup & Saucer") because they end up on a client-facing page.
 *
 * How a picked path becomes a quotation row:
 *   - `category`            the deepest node on the path that sets one fills the
 *                           "Category" column.
 *   - `omitFromDescription` grouping-only nodes that never reach the paper.
 *   - `unit`                inherited downwards; the mind map states it in the
 *                           node label, e.g. "CABINET TYPE ( SQ . FT)".
 * Everything else on the path is joined to build the "Description" column.
 */
const kitchenGroups: CatalogNode[] = [
  {
    id: '1-1',
    label: 'Material Type',
    category: 'Modular Kitchen',
    omitFromDescription: true,
    children: [
      {
        id: '1-1-1',
        label: 'Plast',
        children: [
          {
            id: '1-1-1-1',
            label: 'Cabinet Type',
            unit: 'Sq.ft',
            omitFromDescription: true,
            children: [
              {
                id: '1-1-1-1-1',
                label: 'Full',
                children: [
                  { id: '1-1-1-1-1-1', label: 'Sheet' },
                  { id: '1-1-1-1-1-2', label: 'Profile' },
                ],
              },
              {
                id: '1-1-1-1-2',
                label: 'Loft',
                children: [
                  { id: '1-1-1-1-2-1', label: 'Sheet' },
                  { id: '1-1-1-1-2-2', label: 'Profile' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: '1-1-2',
        label: 'Gold',
        children: [
          {
            id: '1-1-2-1',
            label: 'Cabinet Type',
            unit: 'Sq.ft',
            omitFromDescription: true,
            children: [
              {
                id: '1-1-2-1-1',
                label: 'Full',
                children: [
                  { id: '1-1-2-1-1-1', label: 'Sheet' },
                  { id: '1-1-2-1-1-2', label: 'Profile' },
                ],
              },
              {
                id: '1-1-2-1-2',
                label: 'Loft',
                children: [
                  { id: '1-1-2-1-2-1', label: 'Sheet' },
                  { id: '1-1-2-1-2-2', label: 'Profile' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: '1-1-3',
        label: 'Diamond',
        children: [
          {
            id: '1-1-3-1',
            label: 'Cabinet Type',
            unit: 'Sq.ft',
            omitFromDescription: true,
            children: [
              {
                id: '1-1-3-1-1',
                label: 'Full',
                children: [
                  { id: '1-1-3-1-1-1', label: 'Sheet' },
                  { id: '1-1-3-1-1-2', label: 'Profile' },
                ],
              },
              {
                id: '1-1-3-1-2',
                label: 'Loft',
                children: [
                  { id: '1-1-3-1-2-1', label: 'Sheet' },
                  { id: '1-1-3-1-2-2', label: 'Profile' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '1-3',
    label: 'Hardware',
    unit: 'Nos',
    category: 'Hardware',
    omitFromDescription: true,
    children: [
      {
        id: '1-3-1',
        label: 'Hardware Fittings',
        category: 'Hardware Fittings',
        omitFromDescription: true,
        children: [
          {
            id: '1-3-1-5',
            label: 'Godrej',
            children: [
              {
                id: '1-3-1-5-1',
                label: 'Hinges',
                unit: 'Nos',
                children: [
                  { id: '1-3-1-5-1-1', label: '0 Degree' },
                  { id: '1-3-1-5-1-2', label: '8 Degree' },
                ],
              },
              {
                id: '1-3-1-5-2',
                label: 'Handle',
                children: [
                  { id: '1-3-1-5-2-1', label: 'SS Handle', unit: 'Nos' },
                  { id: '1-3-1-5-2-2', label: 'Profile Handle', unit: 'Sq.ft' },
                ],
              },
              {
                id: '1-3-1-5-3',
                label: 'Channel',
                unit: 'Nos',
                children: [
                  { id: '1-3-1-5-3-1', label: '16 Inch' },
                  { id: '1-3-1-5-3-2', label: '18 Inch' },
                  { id: '1-3-1-5-3-3', label: '20 Inch' },
                ],
              },
              {
                id: '1-3-1-5-4',
                label: 'Screw',
                unit: 'Nos',
                children: [
                  { id: '1-3-1-5-4-1', label: '1 Inch' },
                  { id: '1-3-1-5-4-2', label: '2 Inch' },
                  { id: '1-3-1-5-4-3', label: '3 Inch' },
                ],
              },
            ],
          },
          {
            id: '1-3-1-2',
            label: 'Hettich',
            children: [
              {
                id: '1-3-1-2-1',
                label: 'Hinges',
                unit: 'Nos',
                children: [
                  { id: '1-3-1-2-1-1', label: '0 Degree' },
                  { id: '1-3-1-2-1-2', label: '8 Degree' },
                ],
              },
              {
                id: '1-3-1-2-2',
                label: 'Handle',
                children: [
                  { id: '1-3-1-2-2-1', label: 'SS Handle', unit: 'Nos' },
                  { id: '1-3-1-2-2-2', label: 'Profile Handle', unit: 'Sq.ft' },
                ],
              },
              {
                id: '1-3-1-2-3',
                label: 'Channel',
                unit: 'Nos',
                children: [
                  { id: '1-3-1-2-3-1', label: '16 Inch' },
                  { id: '1-3-1-2-3-2', label: '18 Inch' },
                  { id: '1-3-1-2-3-3', label: '20 Inch' },
                ],
              },
              {
                id: '1-3-1-2-4',
                label: 'Screw',
                unit: 'Nos',
                children: [
                  { id: '1-3-1-2-4-1', label: '1 Inch' },
                  { id: '1-3-1-2-4-2', label: '2 Inch' },
                  { id: '1-3-1-2-4-3', label: '3 Inch' },
                ],
              },
            ],
          },
          {
            id: '1-3-1-3',
            label: 'Local',
            children: [
              {
                id: '1-3-1-3-1',
                label: 'Hinges',
                unit: 'Nos',
                children: [
                  { id: '1-3-1-3-1-1', label: '0 Degree' },
                  { id: '1-3-1-3-1-2', label: '8 Degree' },
                ],
              },
              {
                id: '1-3-1-3-2',
                label: 'Handle',
                children: [
                  { id: '1-3-1-3-2-1', label: 'SS Handle', unit: 'Nos' },
                  { id: '1-3-1-3-2-2', label: 'Profile Handle', unit: 'Sq.ft' },
                ],
              },
              {
                id: '1-3-1-3-3',
                label: 'Channel',
                unit: 'Nos',
                children: [
                  { id: '1-3-1-3-3-1', label: '16 Inch' },
                  { id: '1-3-1-3-3-2', label: '18 Inch' },
                  { id: '1-3-1-3-3-3', label: '20 Inch' },
                ],
              },
              {
                id: '1-3-1-3-4',
                label: 'Screw',
                unit: 'Nos',
                children: [
                  { id: '1-3-1-3-4-1', label: '1 Inch' },
                  { id: '1-3-1-3-4-2', label: '2 Inch' },
                  { id: '1-3-1-3-4-3', label: '3 Inch' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: '1-3-2',
        label: 'Hardware Accessories',
        category: 'Hardware Accessories',
        omitFromDescription: true,
        children: [
          {
            id: '1-3-2-3',
            label: 'Godrej',
            children: [
              {
                id: '1-3-2-3-1',
                label: 'Basket',
                unit: 'Nos',
                children: [
                  { id: '1-3-2-3-1-1', label: 'Thali' },
                  { id: '1-3-2-3-1-2', label: 'Bottle Pull Out' },
                  { id: '1-3-2-3-1-3', label: 'Cup & Saucer' },
                  { id: '1-3-2-3-1-4', label: 'Wicker Basket' },
                  { id: '1-3-2-3-1-5', label: 'Cutlery' },
                  { id: '1-3-2-3-1-6', label: 'Plane Basket' },
                  { id: '1-3-2-3-1-7', label: 'Pantry Unit' },
                ],
              },
              {
                id: '1-3-2-3-2',
                label: 'Tandem',
                unit: 'Nos',
                children: [
                  {
                    id: '1-3-2-3-2-1',
                    label: 'Thali',
                    children: [
                      { id: '1-3-2-3-2-1-1', label: 'Thali Holder (With)' },
                      { id: '1-3-2-3-2-1-2', label: 'Thali Holder (Without)' },
                    ],
                  },
                  { id: '1-3-2-3-2-2', label: 'Bottle Pull Out' },
                  { id: '1-3-2-3-2-3', label: 'Cup & Saucer' },
                  { id: '1-3-2-3-2-4', label: 'Wicker Basket' },
                  {
                    id: '1-3-2-3-2-5',
                    label: 'Cutlery',
                    children: [
                      { id: '1-3-2-3-2-5-1', label: 'PVC Cutlery (With)' },
                      { id: '1-3-2-3-2-5-2', label: 'PVC Cutlery (Without)' },
                    ],
                  },
                  {
                    id: '1-3-2-3-2-6',
                    label: 'Plane Tandem',
                    children: [{ id: '1-3-2-3-2-6-1', label: 'Plate Holder' }],
                  },
                  { id: '1-3-2-3-2-7', label: 'Pantry Unit' },
                ],
              },
            ],
          },
          {
            id: '1-3-2-2',
            label: 'Hettich',
            children: [
              {
                id: '1-3-2-2-1',
                label: 'Basket',
                unit: 'Nos',
                children: [
                  { id: '1-3-2-2-1-1', label: 'Thali' },
                  { id: '1-3-2-2-1-2', label: 'Bottle Pull Out' },
                  { id: '1-3-2-2-1-3', label: 'Cup & Saucer' },
                  { id: '1-3-2-2-1-4', label: 'Wicker Basket' },
                  { id: '1-3-2-2-1-5', label: 'Cutlery' },
                  { id: '1-3-2-2-1-6', label: 'Plane Basket' },
                  { id: '1-3-2-2-1-7', label: 'Pantry Unit' },
                ],
              },
              {
                id: '1-3-2-2-2',
                label: 'Tandem',
                unit: 'Nos',
                children: [
                  {
                    id: '1-3-2-2-2-1',
                    label: 'Thali',
                    children: [
                      { id: '1-3-2-2-2-1-1', label: 'Thali Holder (With)' },
                      { id: '1-3-2-2-2-1-2', label: 'Thali Holder (Without)' },
                    ],
                  },
                  { id: '1-3-2-2-2-2', label: 'Bottle Pull Out' },
                  { id: '1-3-2-2-2-3', label: 'Cup & Saucer' },
                  { id: '1-3-2-2-2-4', label: 'Wicker Basket' },
                  {
                    id: '1-3-2-2-2-5',
                    label: 'Cutlery',
                    children: [
                      { id: '1-3-2-2-2-5-1', label: 'PVC Cutlery (With)' },
                      { id: '1-3-2-2-2-5-2', label: 'PVC Cutlery (Without)' },
                    ],
                  },
                  {
                    id: '1-3-2-2-2-6',
                    label: 'Plane Tandem',
                    children: [{ id: '1-3-2-2-2-6-1', label: 'Plate Holder' }],
                  },
                  { id: '1-3-2-2-2-7', label: 'Pantry Unit' },
                ],
              },
            ],
          },
          {
            id: '1-3-2-4',
            label: 'Local',
            children: [
              {
                id: '1-3-2-4-1',
                label: 'Basket',
                unit: 'Nos',
                children: [
                  { id: '1-3-2-4-1-1', label: 'Thali' },
                  { id: '1-3-2-4-1-2', label: 'Bottle Pull Out' },
                  { id: '1-3-2-4-1-3', label: 'Cup & Saucer' },
                  { id: '1-3-2-4-1-4', label: 'Wicker Basket' },
                  { id: '1-3-2-4-1-5', label: 'Cutlery' },
                  { id: '1-3-2-4-1-6', label: 'Plane Basket' },
                  { id: '1-3-2-4-1-7', label: 'Pantry Unit' },
                ],
              },
              {
                id: '1-3-2-4-2',
                label: 'Tandem',
                unit: 'Nos',
                children: [
                  {
                    id: '1-3-2-4-2-1',
                    label: 'Thali',
                    children: [
                      { id: '1-3-2-4-2-1-1', label: 'Thali Holder (With)' },
                      { id: '1-3-2-4-2-1-2', label: 'Thali Holder (Without)' },
                    ],
                  },
                  { id: '1-3-2-4-2-2', label: 'Bottle Pull Out' },
                  { id: '1-3-2-4-2-3', label: 'Cup & Saucer' },
                  { id: '1-3-2-4-2-4', label: 'Wicker Basket' },
                  {
                    id: '1-3-2-4-2-5',
                    label: 'Cutlery',
                    children: [
                      { id: '1-3-2-4-2-5-1', label: 'PVC Cutlery (With)' },
                      { id: '1-3-2-4-2-5-2', label: 'PVC Cutlery (Without)' },
                    ],
                  },
                  {
                    id: '1-3-2-4-2-6',
                    label: 'Plane Tandem',
                    children: [{ id: '1-3-2-4-2-6-1', label: 'Plate Holder' }],
                  },
                  { id: '1-3-2-4-2-7', label: 'Pantry Unit' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '1-4',
    label: 'Electrical',
    category: 'Electrical',
    omitFromDescription: true,
    children: [
      {
        id: '1-4-1',
        label: 'Light',
        children: [
          { id: '1-4-1-1', label: 'Profile Light', unit: 'Sq.ft' },
          { id: '1-4-1-2', label: 'Concealed Light', unit: 'Nos' },
          { id: '1-4-1-3', label: 'Rope Light', unit: 'Sq.ft' },
        ],
      },
      { id: '1-4-2', label: 'Wire' },
      {
        id: '1-4-3',
        label: 'Others',
        children: [
          { id: '1-4-3-1', label: 'Tape', unit: 'Nos' },
          { id: '1-4-3-2', label: 'Profile', unit: 'Sq.ft' },
          { id: '1-4-3-3', label: 'Adapter', unit: 'Nos' },
        ],
      },
    ],
  },
  {
    id: '1-5',
    label: 'Electrical Appliances',
    unit: 'Nos',
    category: 'Electrical Appliances',
    omitFromDescription: true,
    children: [
      { id: '1-5-1', label: 'Chimney' },
      { id: '1-5-2', label: 'Oven' },
    ],
  },
  {
    id: '1-6',
    label: 'Other Items',
    unit: 'Nos',
    category: 'Other Items',
    omitFromDescription: true,
    children: [
      { id: '1-6-1', label: 'EVA Bond' },
      { id: '1-6-2', label: 'White Tube' },
      { id: '1-6-3', label: 'Furniture Stick' },
    ],
  },
];

export const catalogSections: CatalogSection[] = [
  { id: 'kitchen', label: 'Modular Kitchen', groups: kitchenGroups },
];

/** Walks the tree so a picker can resolve a node id back to its ancestry. */
export function findCatalogPath(nodeId: string): CatalogNode[] | null {
  const visit = (nodes: CatalogNode[], trail: CatalogNode[]): CatalogNode[] | null => {
    for (const node of nodes) {
      const next = [...trail, node];
      if (node.id === nodeId) return next;
      const found = node.children ? visit(node.children, next) : null;
      if (found) return found;
    }
    return null;
  };
  for (const section of catalogSections) {
    const found = visit(section.groups, []);
    if (found) return found;
  }
  return null;
}
