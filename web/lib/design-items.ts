/**
 * Individual designs inside each category — the browse-and-enquire layer.
 *
 * Every entry gets its own page at `/design/[slug]/[design]`, listing the spec
 * a client actually asks about before booking. The spec labels differ by
 * category (a kitchen has a countertop, a wardrobe has an internal layout), so
 * each category declares its own labels once and every design supplies values
 * in that order.
 *
 * Titles, specs and copy are realistic placeholders. Photography is stock.
 * Replace both with real Kalope projects — the shape of the data is what
 * matters here, and nothing in the UI needs touching when you do.
 */

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1400&auto=format&fit=crop`;

export type DesignSpec = { label: string; value: string };

export type DesignItem = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  src: string;
  alt: string;
  specs: DesignSpec[];
};

/** [slug, title, unsplash id, summary, spec values in label order] */
type Row = [string, string, string, string, string[]];

function cat(category: string, labels: string[], rows: Row[]): DesignItem[] {
  return rows.map(([slug, title, id, summary, values]) => ({
    slug,
    category,
    title,
    summary,
    src: u(id),
    alt: title,
    specs: labels.map((label, i) => ({ label, value: values[i] ?? '—' })),
  }));
}

const KITCHEN_LABELS = ['Layout', 'Room size', 'Style', 'Colour', 'Shutter finish', 'Countertop'];
const ROOM_LABELS = ['Layout', 'Room size', 'Style', 'Colour palette', 'Wall finish', 'Flooring'];
const STORAGE_LABELS = ['Type', 'Size', 'Style', 'Colour', 'Shutter finish', 'Internal layout'];
const BED_LABELS = ['Layout', 'Room size', 'Style', 'Colour palette', 'Headboard', 'Storage'];
const BATH_LABELS = ['Layout', 'Room size', 'Style', 'Wall tile', 'Vanity', 'Fittings'];
const CEILING_LABELS = ['Type', 'Room size', 'Style', 'Colour', 'Lighting', 'Material'];
const POOJA_LABELS = ['Type', 'Size', 'Style', 'Colour', 'Jali detail', 'Storage'];
const OFFICE_LABELS = ['Layout', 'Room size', 'Style', 'Colour', 'Worktop', 'Storage'];

export const designItems: DesignItem[] = [
  ...cat('modular-kitchen', KITCHEN_LABELS, [
    [
      'parallel-walnut-corian',
      'Modern parallel kitchen with walnut storage and Corian countertop',
      '1631679706909-1844bbd07221',
      'A parallel run keeps the work triangle tight in a narrow room, with tall storage along one wall.',
      ['Parallel', '15 × 7 ft', 'Modern', 'Vertical walnut', 'Matte laminate', 'Corian'],
    ],
    [
      'l-shaped-ivory-quartz',
      'L-shaped kitchen with ivory shutters and quartz countertop',
      '1556909212-d5b604d0c90d',
      'An L-shape frees the opposite wall for a breakfast counter or tall unit.',
      ['L-shaped', '10 × 10 ft', 'Contemporary', 'Ivory', 'Glossy acrylic', 'Engineered quartz'],
    ],
    [
      'island-stone-open',
      'Open kitchen with a stone-topped island and concealed appliances',
      '1581783458534-001a466b5487',
      'The island doubles as prep space and informal seating for an open plan.',
      ['Island', '14 × 12 ft', 'Minimal', 'Off white', 'Matte laminate', 'Engineered stone'],
    ],
    [
      'u-shaped-graphite',
      'U-shaped kitchen with graphite cabinets and profile lighting',
      '1600489000022-c2086d79f9d4',
      'Three working walls give maximum counter run in a compact footprint.',
      ['U-shaped', '12 × 9 ft', 'Modern', 'Graphite', 'Matte laminate', 'Granite'],
    ],
    [
      'straight-compact-laminate',
      'Straight-line kitchen with tall units and a compact work zone',
      '1618221195710-dd6b41faaea6',
      'A single wall handles everything in an apartment kitchen, with storage carried to the ceiling.',
      ['Straight', '9 × 6 ft', 'Contemporary', 'Warm grey', 'Matte laminate', 'Granite'],
    ],
    [
      'dining-open-pastel',
      'Kitchen opening to dining with pastel shutters and open shelving',
      '1599696848652-f0ff23bc911f',
      'A low counter separates cooking from dining without closing the room off.',
      ['Open', '16 × 10 ft', 'Transitional', 'Pastel sage', 'Membrane', 'Corian'],
    ],
  ]),

  ...cat('wardrobes', STORAGE_LABELS, [
    [
      'sliding-two-door-mirror',
      'Two-door sliding wardrobe with a full-height mirror panel',
      '1558997519-83ea9252edf8',
      'Sliding shutters need no swing clearance, which matters in a tight bedroom.',
      ['Sliding', '7 × 8 ft', 'Modern', 'Warm white', 'Laminate with mirror', 'Hanging + shelves'],
    ],
    [
      'hinged-panelled-loft',
      'Hinged wardrobe with panelled shutters and loft storage above',
      '1595428774223-ef52624120d2',
      'Panelling gives the wall texture; the loft takes luggage and off-season bedding.',
      ['Hinged', '8 × 9 ft', 'Classic', 'Ivory', 'PU panelled', 'Hanging + loft'],
    ],
    [
      'walk-in-open',
      'Walk-in wardrobe with open shelving and a dressing bench',
      '1583847268964-b28dc8f51f92',
      'An open dressing room where the plan allows a separate space.',
      ['Walk-in', '8 × 6 ft', 'Contemporary', 'Oak', 'Open + drawers', 'Hanging + island'],
    ],
    [
      'corner-unit-drawers',
      'Corner wardrobe with deep drawers and a pull-out rail',
      '1522708323590-d24dbb6b0267',
      'Pull-outs make the corner reachable instead of dead.',
      ['Hinged corner', '6 × 8 ft', 'Modern', 'Graphite', 'Matte laminate', 'Drawers + rail'],
    ],
    [
      'sliding-glass-loft',
      'Sliding wardrobe with tinted glass shutters and integrated lighting',
      '1600566752355-35792bedcfea',
      'Tinted glass keeps the wall light while hiding what is inside.',
      ['Sliding', '9 × 9 ft', 'Minimal', 'Smoked glass', 'Glass + aluminium', 'Hanging + shelves'],
    ],
    [
      'kids-low-reach',
      'Low-reach wardrobe with colour-blocked shutters',
      '1578683010236-d716f9a3f461',
      'Rails and shelves set at a height a child can use without help.',
      ['Hinged', '6 × 7 ft', 'Playful', 'Sage + white', 'Matte laminate', 'Low rail + bins'],
    ],
  ]),

  ...cat('living-room', ROOM_LABELS, [
    [
      'l-seating-panelled',
      'Living room with L-shaped seating and a panelled feature wall',
      '1600210491892-03d54c0aaf87',
      'The panelling anchors the seating and hides the wiring behind it.',
      [
        'L-shaped seating',
        '16 × 12 ft',
        'Contemporary',
        'Warm neutral',
        'Fluted panelling',
        'Vitrified tile',
      ],
    ],
    [
      'open-plan-textured',
      'Open-plan living with a textured accent wall and cove lighting',
      '1564078516393-cf04bd966897',
      'One textured wall does the work of several decorative objects.',
      [
        'Open plan',
        '18 × 14 ft',
        'Modern',
        'Beige + walnut',
        'Textured plaster',
        'Wooden laminate',
      ],
    ],
    [
      'compact-apartment',
      'Compact living room with wall-mounted storage and a slim console',
      '1616486338812-3dadae4b4ace',
      'Everything lifts off the floor so the room reads larger than it is.',
      ['Straight', '12 × 10 ft', 'Minimal', 'Off white', 'Paint + panelling', 'Vitrified tile'],
    ],
    [
      'dual-tone-arch',
      'Dual-tone living room with an arched niche and warm lighting',
      '1586023492125-27b2c045efd7',
      'The arch softens an otherwise rectangular room.',
      [
        'L-shaped seating',
        '15 × 13 ft',
        'Transitional',
        'Cream + teal',
        'Paint + arch niche',
        'Marble',
      ],
    ],
    [
      'media-wall-focus',
      'Living room built around a full-height media wall',
      '1615529182904-14819c35db37',
      'Seating, lighting and storage all resolve around the screen wall.',
      ['Straight', '16 × 11 ft', 'Modern', 'Grey + oak', 'Laminate cladding', 'Wooden laminate'],
    ],
    [
      'balcony-extension',
      'Living room extended into a balcony seating nook',
      '1556228453-efd6c1ff04f6',
      'The balcony becomes part of the room rather than storage.',
      [
        'Open plan',
        '14 × 12 ft',
        'Contemporary',
        'Sand + green',
        'Paint + louvres',
        'Vitrified tile',
      ],
    ],
  ]),

  ...cat('master-bedroom', BED_LABELS, [
    [
      'panelled-headboard-suite',
      'Master bedroom with a panelled headboard and integrated lighting',
      '1590381105924-c72589b9ef3f',
      'Headboard, side tables and reading lights are drawn as one piece.',
      [
        'Straight',
        '14 × 12 ft',
        'Contemporary',
        'Warm neutral',
        'Fluted panelling',
        'Wardrobe + loft',
      ],
    ],
    [
      'soft-palette-fabric',
      'Bedroom with an upholstered headboard and a soft neutral palette',
      '1578683010236-d716f9a3f461',
      'Fabric absorbs sound as well as softening the room.',
      ['Straight', '13 × 11 ft', 'Modern', 'Sand + ivory', 'Upholstered', 'Wardrobe + drawers'],
    ],
    [
      'dual-tone-storage',
      'Master bedroom with dual-tone storage and a dresser wall',
      '1522708323590-d24dbb6b0267',
      'Wardrobe and dresser share one wall so the rest of the room stays clear.',
      ['L-shaped', '15 × 12 ft', 'Transitional', 'Grey + oak', 'Panelled', 'Wardrobe + dresser'],
    ],
    [
      'compact-loft-bed',
      'Compact master bedroom with loft storage over the wardrobe',
      '1600566752355-35792bedcfea',
      'Storage climbs the wall where floor space runs out.',
      ['Straight', '11 × 10 ft', 'Minimal', 'Off white', 'Paint', 'Wardrobe + loft'],
    ],
    [
      'warm-wood-calm',
      'Bedroom in warm wood with concealed cove lighting',
      '1595428774223-ef52624120d2',
      'Cove light instead of a ceiling fixture keeps the room restful.',
      [
        'Straight',
        '14 × 13 ft',
        'Contemporary',
        'Walnut + cream',
        'Wood cladding',
        'Wardrobe + side units',
      ],
    ],
    [
      'bay-window-seat',
      'Master bedroom with a bay window seat and hidden storage',
      '1576941089067-2de3c901e126',
      'The window seat lifts to become the storage nobody sees.',
      ['L-shaped', '15 × 13 ft', 'Classic', 'Ivory + olive', 'Panelled', 'Window seat + wardrobe'],
    ],
  ]),

  ...cat('bathroom', BATH_LABELS, [
    [
      'walk-in-shower-stone',
      'Bathroom with a walk-in shower and stone-look tiling',
      '1584622650111-993a426fbf0a',
      'A glass screen instead of a curtain keeps the room feeling open.',
      [
        'Walk-in',
        '8 × 5 ft',
        'Modern',
        'Stone-look vitrified',
        'Wall-hung, mirror cabinet',
        'Chrome',
      ],
    ],
    [
      'compact-dry-wet',
      'Compact bathroom with a dry-wet separation and niche storage',
      '1552321554-5fefe8c9ef14',
      'Splitting wet and dry keeps the rest of the room usable.',
      [
        'Dry-wet split',
        '7 × 4 ft',
        'Contemporary',
        'Matte ceramic',
        'Wall-hung with drawer',
        'Chrome',
      ],
    ],
    [
      'double-vanity-marble',
      'Bathroom with a double vanity and marble-look counter',
      '1620626011761-996317b8d101',
      'Two basins for a shared bathroom, on one continuous counter.',
      [
        'Straight',
        '10 × 6 ft',
        'Transitional',
        'Marble-look',
        'Double, counter-top basins',
        'Brushed brass',
      ],
    ],
    [
      'powder-room-dark',
      'Powder room with dark tiling and a back-lit mirror',
      '1616594039964-ae9021a400a0',
      'A small room can take a darker finish than a main bathroom.',
      ['Straight', '5 × 4 ft', 'Modern', 'Dark matte', 'Wall-hung, compact', 'Matte black'],
    ],
    [
      'tub-and-shower',
      'Master bathroom with a tub and a separate shower enclosure',
      '1571508601891-ca5e7a713859',
      'Where the plan allows, tub and shower are kept apart.',
      ['Split', '12 × 7 ft', 'Classic', 'Large-format ceramic', 'Counter-top on stone', 'Chrome'],
    ],
    [
      'minimal-white',
      'Minimal white bathroom with concealed cistern and niche shelving',
      '1618221195710-dd6b41faaea6',
      'Recessed niches remove the need for anything to stand on the floor.',
      ['Walk-in', '8 × 5 ft', 'Minimal', 'Gloss white', 'Wall-hung', 'Chrome'],
    ],
  ]),

  ...cat('tv-units', ROOM_LABELS, [
    [
      'full-height-backlit',
      'Full-height media wall with back-lit niches',
      '1598928506311-c55ded91a20c',
      'Back-lighting keeps the screen from floating in a dark wall.',
      [
        'Full-height wall',
        '12 ft run',
        'Modern',
        'Grey + oak',
        'Laminate cladding',
        'Vitrified tile',
      ],
    ],
    [
      'floating-console-slim',
      'Floating console unit with a slim fluted back panel',
      '1615529182904-14819c35db37',
      'Lifting the unit off the floor makes the room easier to clean and read.',
      ['Floating', '8 ft run', 'Minimal', 'Walnut', 'Fluted panelling', 'Wooden laminate'],
    ],
    [
      'storage-wall-drawers',
      'Media wall with closed drawer storage and display shelving',
      '1586023492125-27b2c045efd7',
      'Half closed, half open — the clutter goes behind doors.',
      ['Full wall', '14 ft run', 'Contemporary', 'Ivory + walnut', 'Laminate', 'Vitrified tile'],
    ],
    [
      'stone-clad-feature',
      'Stone-clad media wall with a recessed screen',
      '1600210491892-03d54c0aaf87',
      'Recessing the screen makes the wall the feature, not the television.',
      ['Full-height wall', '12 ft run', 'Modern', 'Stone grey', 'Stone cladding', 'Marble'],
    ],
    [
      'compact-apartment-unit',
      'Compact TV unit with a bookshelf return',
      '1564078516393-cf04bd966897',
      'The return wraps the corner and adds shelving without a separate piece.',
      ['L-shaped', '7 ft run', 'Minimal', 'Off white', 'Paint + laminate', 'Wooden laminate'],
    ],
    [
      'dual-tone-slats',
      'Dual-tone media wall with vertical slats and concealed wiring',
      '1583845112203-29329902332e',
      'Slats hide the cable route and break up a long wall.',
      [
        'Full wall',
        '13 ft run',
        'Contemporary',
        'Charcoal + oak',
        'Slatted panelling',
        'Vitrified tile',
      ],
    ],
  ]),

  ...cat('false-ceiling', CEILING_LABELS, [
    [
      'peripheral-cove',
      'Peripheral cove ceiling with concealed strip lighting',
      '1567016432779-094069958ea5',
      'A border drop keeps the centre height intact in a low room.',
      ['Peripheral', '14 × 12 ft', 'Contemporary', 'Off white', 'Concealed cove', 'Gypsum board'],
    ],
    [
      'layered-drop-spots',
      'Layered ceiling with a stepped drop and recessed spots',
      '1616627561950-9f746e330187',
      'Two steps give the lighting somewhere to sit without a pendant.',
      ['Layered', '16 × 14 ft', 'Modern', 'White', 'Cove + spots', 'Gypsum board'],
    ],
    [
      'wooden-rafter-accent',
      'Ceiling with wooden rafter detailing over the seating',
      '1586023492125-27b2c045efd7',
      'Timber warms a ceiling that would otherwise read flat.',
      [
        'Partial',
        '15 × 13 ft',
        'Transitional',
        'Walnut + white',
        'Cove + pendants',
        'Gypsum + laminate',
      ],
    ],
    [
      'minimal-flat-profile',
      'Flat ceiling with profile lighting and no visible fixtures',
      '1615529182904-14819c35db37',
      'Profile light sits flush, so nothing hangs below the plane.',
      ['Flat', '12 × 10 ft', 'Minimal', 'White', 'Profile light', 'Gypsum board'],
    ],
    [
      'grid-office-acoustic',
      'Grid ceiling with acoustic panels and linear lighting',
      '1594026112284-02bb6f3352fe',
      'Acoustic tiles bring an open office down to a workable noise level.',
      ['Grid', '30 × 20 ft', 'Commercial', 'Light grey', 'Linear LED', 'Mineral fibre'],
    ],
    [
      'entrance-drop-detail',
      'Entrance ceiling drop with a highlighted approach',
      '1600607687939-ce8a6c25118c',
      'A lower ceiling at the door makes the room beyond feel taller.',
      ['Partial drop', '8 × 5 ft', 'Contemporary', 'Ivory', 'Spots + cove', 'Gypsum board'],
    ],
  ]),

  ...cat('pooja-room', POOJA_LABELS, [
    [
      'niche-jali-marble',
      'Wall niche mandir with jali panels and a marble base',
      '1600607687939-ce8a6c25118c',
      'A recessed niche where a standalone unit would crowd the room.',
      ['Wall niche', '3 × 2 ft', 'Traditional', 'Ivory + gold', 'CNC-cut jali', 'Base drawers'],
    ],
    [
      'standalone-wooden-unit',
      'Standalone wooden mandir with doors and drawer storage',
      '1618221195710-dd6b41faaea6',
      'Doors close the space when it is not in use.',
      ['Standalone', '4 × 2 ft', 'Traditional', 'Teak', 'Carved panel', 'Doors + drawers'],
    ],
    [
      'corner-unit-compact',
      'Corner pooja unit with a back-lit jali screen',
      '1560185007-cde436f6a4d0',
      'The corner is usually the quietest part of an apartment.',
      [
        'Corner',
        '3 × 3 ft',
        'Contemporary',
        'White + brass',
        'Back-lit jali',
        'Open shelf + drawer',
      ],
    ],
    [
      'glass-partition-room',
      'Separate pooja room with a glass and jali partition',
      '1502005229762-cf1b2da7c5d6',
      'A partition gives the space its own room without blocking light.',
      [
        'Separate room',
        '6 × 5 ft',
        'Traditional',
        'Ivory + wood',
        'Etched glass + jali',
        'Full storage wall',
      ],
    ],
    [
      'minimal-ledge-shelf',
      'Minimal ledge mandir with concealed warm lighting',
      '1616627561950-9f746e330187',
      'A single ledge, lit from above, for a small apartment.',
      ['Ledge', '2.5 × 1 ft', 'Minimal', 'Off white', 'None', 'Concealed drawer'],
    ],
    [
      'arched-alcove-stone',
      'Arched alcove mandir in stone with a brass bell detail',
      '1567016432779-094069958ea5',
      'The arch and stone give the alcove weight in a plain wall.',
      ['Wall niche', '4 × 2.5 ft', 'Traditional', 'Stone + brass', 'Carved arch', 'Base cabinet'],
    ],
  ]),

  ...cat('dining-room', ROOM_LABELS, [
    [
      'six-seater-pendant',
      'Six-seater dining with a statement pendant and crockery unit',
      '1617806118233-18e1de247200',
      'Pendant height set from the tabletop so it lights the food, not the room.',
      [
        'Rectangular',
        '12 × 10 ft',
        'Contemporary',
        'Warm neutral',
        'Paint + panelling',
        'Vitrified tile',
      ],
    ],
    [
      'four-seater-compact',
      'Four-seater dining nook with a built-in bench',
      '1540518614846-7eded433c457',
      'A bench seats more than chairs in the same footprint.',
      ['Nook', '8 × 7 ft', 'Minimal', 'Off white', 'Panelled', 'Wooden laminate'],
    ],
    [
      'open-kitchen-counter',
      'Dining set against an open kitchen counter',
      '1599696848652-f0ff23bc911f',
      'The counter does double duty as serving and separation.',
      ['Open plan', '14 × 11 ft', 'Modern', 'Grey + oak', 'Paint', 'Vitrified tile'],
    ],
    [
      'mirror-wall-narrow',
      'Narrow dining room widened with a full mirror wall',
      '1586023492125-27b2c045efd7',
      'A mirrored wall is the cheapest way to widen a corridor-shaped room.',
      ['Rectangular', '14 × 8 ft', 'Transitional', 'Cream + gold', 'Mirror + panelling', 'Marble'],
    ],
    [
      'eight-seater-formal',
      'Eight-seater formal dining with a sideboard and art wall',
      '1556909114-f6e7ad7d3136',
      'A longer table needs a sideboard rather than a crockery unit.',
      ['Rectangular', '18 × 12 ft', 'Classic', 'Ivory + walnut', 'Panelled', 'Marble'],
    ],
    [
      'round-table-informal',
      'Round dining table with a low pendant and open shelving',
      '1567016432779-094069958ea5',
      'A round top seats an odd number comfortably and eases circulation.',
      ['Round', '10 × 10 ft', 'Contemporary', 'Sand + green', 'Paint', 'Vitrified tile'],
    ],
  ]),

  ...cat('kids-bedroom', BED_LABELS, [
    [
      'bunk-storage-stair',
      'Kids bedroom with a bunk bed and storage stairs',
      '1558211583-d26f610c1eb1',
      'Each stair tread is a drawer, so the climb is also the storage.',
      ['Bunk', '12 × 10 ft', 'Playful', 'Sage + white', 'Panelled', 'Stair drawers + wardrobe'],
    ],
    [
      'study-desk-window',
      'Kids room with a study desk built along the window',
      '1522708323590-d24dbb6b0267',
      'The desk takes daylight from the side rather than behind the screen.',
      ['Straight', '11 × 10 ft', 'Modern', 'Blue + white', 'Paint', 'Desk + overhead units'],
    ],
    [
      'low-storage-toddler',
      'Toddler room with low-reach storage and rounded edges',
      '1600566752355-35792bedcfea',
      'Everything a child uses sits below their shoulder height.',
      ['Straight', '10 × 9 ft', 'Playful', 'Butter + white', 'Paint', 'Low open bins'],
    ],
    [
      'shared-twin-beds',
      'Shared kids room with twin beds and a divider shelf',
      '1595428774223-ef52624120d2',
      'An open shelf divides the room without darkening either half.',
      ['Twin', '14 × 11 ft', 'Contemporary', 'Mint + oak', 'Panelled', 'Divider shelf + wardrobes'],
    ],
    [
      'teen-room-desk-wall',
      'Teen bedroom with a full desk wall and pinboard',
      '1567767292278-a4f21aa2d36e',
      'The room that has to work for homework as much as sleep.',
      [
        'L-shaped',
        '12 × 11 ft',
        'Modern',
        'Charcoal + oak',
        'Pinboard + paint',
        'Desk wall + wardrobe',
      ],
    ],
    [
      'loft-bed-play',
      'Loft bed with a play area underneath',
      '1578683010236-d716f9a3f461',
      'Lifting the bed frees the entire floor below it.',
      ['Loft', '11 × 10 ft', 'Playful', 'White + coral', 'Paint', 'Under-bed storage'],
    ],
  ]),

  ...cat('home-office', OFFICE_LABELS, [
    [
      'built-in-desk-shelving',
      'Home office with a built-in desk and full-height shelving',
      '1593062096033-9a26b09da705',
      'Desk and shelving as one piece, so no furniture is added later.',
      ['Straight', '10 × 8 ft', 'Contemporary', 'Oak + white', 'Laminate', 'Open + closed units'],
    ],
    [
      'corner-workstation',
      'Corner workstation with cable management and a pinboard',
      '1585128792020-803d29415281',
      'The corner gives two working surfaces from one footprint.',
      ['L-shaped', '9 × 8 ft', 'Modern', 'Grey + oak', 'Laminate', 'Drawer unit + overhead'],
    ],
    [
      'guest-room-fold-away',
      'Guest room with a fold-away desk and wall bed',
      '1618221195710-dd6b41faaea6',
      'The room is an office on weekdays and a guest room at the weekend.',
      ['Convertible', '11 × 9 ft', 'Minimal', 'Off white', 'Laminate', 'Wall bed + desk'],
    ],
    [
      'study-two-person',
      'Two-person study with a shared worktop',
      '1524758631624-e2822e304c36',
      'One continuous top rather than two desks pushed together.',
      ['Straight', '12 × 9 ft', 'Contemporary', 'Walnut', 'Solid wood veneer', 'Shared drawers'],
    ],
    [
      'reading-corner-library',
      'Reading corner with a library wall and an armchair',
      '1505691938895-1758d7feb511',
      'Not every home office needs to be a desk.',
      ['Corner', '8 × 7 ft', 'Classic', 'Ivory + walnut', 'Veneer', 'Library shelving'],
    ],
    [
      'compact-nook-alcove',
      'Compact work nook fitted into a hallway alcove',
      '1497366216548-37526070297c',
      'An alcove that was doing nothing becomes the workspace.',
      ['Alcove', '5 × 3 ft', 'Minimal', 'White', 'Laminate', 'Overhead shelf'],
    ],
  ]),

  ...cat('office-cabin', OFFICE_LABELS, [
    [
      'manager-cabin-glass',
      'Manager cabin with a glass partition and credenza',
      '1604709177225-055f99402ea3',
      'Glass keeps the floor visually open while holding the sound down.',
      ['Single cabin', '12 × 10 ft', 'Corporate', 'Grey + oak', 'Laminate', 'Credenza + overhead'],
    ],
    [
      'meeting-room-eight',
      'Eight-seat meeting room with acoustic panelling',
      '1497215842964-222b430dc094',
      'Panelling on two walls is usually enough to stop a room echoing.',
      [
        'Meeting room',
        '18 × 12 ft',
        'Corporate',
        'Charcoal + walnut',
        'Solid surface',
        'AV credenza',
      ],
    ],
    [
      'open-workstations-six',
      'Six-desk open workstation cluster with screens',
      '1497366216548-37526070297c',
      'Low screens give separation without closing the floor in.',
      ['Open plan', '20 × 14 ft', 'Modern', 'White + beech', 'Laminate', 'Pedestals + lockers'],
    ],
    [
      'reception-waiting',
      'Reception desk with a waiting area and brand wall',
      '1585128792020-803d29415281',
      'The first room a client sees, detailed to match the cabins.',
      [
        'Reception',
        '14 × 10 ft',
        'Corporate',
        'Walnut + white',
        'Solid surface',
        'Under-counter storage',
      ],
    ],
    [
      'director-cabin-formal',
      'Director cabin with a discussion table and storage wall',
      '1524758631624-e2822e304c36',
      'A separate discussion table so the desk stays a desk.',
      ['Single cabin', '16 × 14 ft', 'Classic', 'Walnut', 'Veneer', 'Full storage wall'],
    ],
    [
      'phone-booth-focus',
      'Focus booth for calls with full acoustic treatment',
      '1600489000022-c2086d79f9d4',
      'One sealed room stops an entire open floor being disturbed.',
      ['Booth', '5 × 4 ft', 'Modern', 'Charcoal', 'Laminate', 'Shelf + seat'],
    ],
  ]),
];

export function designsForCategory(category: string): DesignItem[] {
  return designItems.filter((item) => item.category === category);
}

export function findDesign(category: string, slug: string): DesignItem | undefined {
  return designItems.find((item) => item.category === category && item.slug === slug);
}
