# Quotation

Builds the Kalope Homes **Interior Design & Execution Quotation** — the client
fills the form on the left, and the right-hand pane renders the finished A4
document, ready to print or save as PDF.

```bash
npm install
npm run dev      # http://localhost:5175
```

## What is dynamic, and what is not

The approved document (`KH114_Chandan.pdf`) is fixed copy wrapped around a small
amount of per-client data. Only the latter is editable:

| Editable                                                                        | Fixed                                                                            |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Quotation No., Date, Client Name, Project Location, Contact Number, Prepared By | Title, intro, Why Kalope Homes, Material Specifications, Scope of Work           |
| Section tables — Category, Description, Unit, Qty, Rate                         | Cost Breakup, Payment Terms, Project Timeline, Warranty, Care, Site Requirements |
| Discount                                                                        | Design Changes, Transportation, Terms & Conditions, Client Approval              |

The fixed copy lives in [`src/data/document.ts`](src/data/document.ts) — edit it
there and every future quotation picks up the change. Amounts, per-section Grand
Totals, Total Area, Subtotal and Final Amount are all derived; nothing that can be
computed is typed twice.

Total Area counts **`Sq.ft` rows only**, matching the reference document, where
104 + 75 + 39 = 218 sq. ft.

## The catalog

`Add from catalog` drills through the kitchen selection tree in
[`src/data/catalog.ts`](src/data/catalog.ts), transcribed from the Kalope Homes
[kitchen mind map](https://mindmapai.app/mind-map/kitchen-2d9760b2): material
grades, cabinet types, hardware fittings and accessories by brand, electricals,
appliances and consumables. Picking a node fills Category, Description and Unit;
every field stays editable afterwards, and rows can also be typed from scratch.

To add another room, append a `CatalogSection` to `catalogSections`. The picker,
its tabs, and the unit/category resolution all follow from the data.

## How the page is produced

- **Letterhead** — `src/assets/letterhead.png` is the Kalope Homes letterhead
  — header band, watermark and footer — lifted verbatim from
  `KH114_Chandan.pdf`, which carries it as one 1448 × 2048 background image
  repeated on all five pages (~175 dpi over A4). Taking the embedded image
  rather than re-rendering the page keeps the branding pixel-identical to the
  approved document. To restore it if it ever goes missing:

  ```python
  import pymupdf
  doc = pymupdf.open("KH114_Chandan.pdf")
  pymupdf.Pixmap(doc, doc[0].get_images(full=True)[0][0]).save("src/assets/letterhead.png")
  ```

  It is placed as an `<img>` behind every page rather than a CSS background,
  because browsers drop background images unless the reader ticks "Background
  graphics" in the print dialog.

- **Geometry** — [`src/styles/document.css`](src/styles/document.css) carries the
  measurements traced from the approved PDF: 25.4 mm side margins, a 48.5 mm top,
  a 168.6 mm table, and the type scale (18 pt headings, 13 pt sub-headings, 11 pt
  body, 9 pt table).
- **Pagination** — [`Paginator.tsx`](src/components/document/Paginator.tsx)
  measures every block off-screen, then packs them into fixed A4 pages. Item
  tables split between rows and repeat their heading as "… (contd.)", so a
  quotation with forty line items paginates correctly. CSS `break-inside` cannot
  do this, because each page needs its own letterhead layer.
- **Print** — `Print / Save as PDF` uses the browser's own print path with
  `@page { size: A4; margin: 0 }`. No PDF library, no server.

Output was verified against `KH114_Chandan.pdf` by printing headlessly and
comparing text positions: pages 1, 2 and 4 land within ~0.5 mm of the original.

## State

The working quotation is kept in `localStorage` (`kalope.quotation.draft`) and
restored on load. `Load KH114 sample` fills the form with the reference
quotation; `New quotation` clears it. There is no API call — this app is
self-contained.
