/**
 * The twelve category pages behind the Design menu, served by the single
 * dynamic route at `app/design/[slug]`.
 *
 * Photography is placeholder stock, matched to each category as closely as the
 * pool allows — the pooja room in particular is a stand-in, since there is no
 * suitable stock for it. Swap `src` values for real Kalope photographs before
 * launch; nothing else needs touching.
 */

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1400&auto=format&fit=crop`;

export type DesignShot = {
  src: string;
  alt: string;
  shape: 'tall' | 'square' | 'wide';
};

export type DesignCategory = {
  slug: string;
  /** Label in the Design menu. */
  label: string;
  /** Page heading. */
  title: string;
  /** Small uppercase line above the heading. */
  kicker: string;
  intro: string;
  hero: { src: string; alt: string };
  /** What the scope covers. Rendered as a drawn-rule list. */
  points: string[];
  gallery: DesignShot[];
};

export const designCategories: DesignCategory[] = [
  {
    slug: 'modular-kitchen',
    label: 'Modular kitchen designs',
    title: 'Modular kitchens',
    kicker: 'Home',
    intro:
      'A kitchen is drawn around how you cook, not around a catalogue. We plan the work triangle, the storage and the services first, then build the cabinetry to the millimetre in our own workshop.',
    hero: { src: u('1556909212-d5b604d0c90d'), alt: 'A modular kitchen with pale cabinetry' },
    points: [
      'Layout planning around the sink, hob and fridge triangle',
      'Soft-close hardware and full-extension drawer runners',
      'Engineered stone or laminate counters, edged and sealed',
      'Appliance cut-outs, plumbing and electrical points coordinated',
    ],
    gallery: [
      {
        src: u('1581783458534-001a466b5487'),
        alt: 'Minimal kitchen with stone surfaces',
        shape: 'tall',
      },
      { src: u('1631679706909-1844bbd07221'), alt: 'Kitchen cabinetry detail', shape: 'square' },
      {
        src: u('1599696848652-f0ff23bc911f'),
        alt: 'Kitchen opening onto a dining area',
        shape: 'wide',
      },
      {
        src: u('1618221195710-dd6b41faaea6'),
        alt: 'Flush cabinetry in a bright kitchen',
        shape: 'square',
      },
    ],
  },
  {
    slug: 'wardrobes',
    label: 'Wardrobe designs',
    title: 'Wardrobes & storage',
    kicker: 'Home',
    intro:
      'Floor-to-ceiling storage that uses the whole wall, including the awkward corner and the space above the door. Interiors are configured around what you actually own.',
    hero: { src: u('1558997519-83ea9252edf8'), alt: 'A fitted wardrobe with open shelving' },
    points: [
      'Hinged, sliding or walk-in, sized to the opening',
      'Internal layout planned around hanging, folding and luggage',
      'Loft storage above, with the same finish carried through',
      'Soft-close hinges, mirror panels and integrated lighting',
    ],
    gallery: [
      {
        src: u('1595428774223-ef52624120d2'),
        alt: 'Fitted storage with panelled doors',
        shape: 'tall',
      },
      { src: u('1522708323590-d24dbb6b0267'), alt: 'Bedroom storage wall', shape: 'square' },
      { src: u('1600566752355-35792bedcfea'), alt: 'Wardrobe alongside a bed', shape: 'wide' },
      {
        src: u('1578683010236-d716f9a3f461'),
        alt: 'Storage in a soft neutral palette',
        shape: 'square',
      },
    ],
  },
  {
    slug: 'living-room',
    label: 'Living room designs',
    title: 'Living rooms',
    kicker: 'Home',
    intro:
      'The room the house opens into. We work from the seating plan outward — how people sit, where the light falls, and what the room has to hold when everyone visits at once.',
    hero: { src: u('1600210491892-03d54c0aaf87'), alt: 'A calm living room in warm neutrals' },
    points: [
      'Seating and circulation planned before anything is specified',
      'Feature wall, panelling or textured finish as the anchor',
      'Layered lighting: cove, task and accent on separate circuits',
      'Storage built in rather than added on',
    ],
    gallery: [
      {
        src: u('1564078516393-cf04bd966897'),
        alt: 'Living space with layered textures',
        shape: 'wide',
      },
      {
        src: u('1616486338812-3dadae4b4ace'),
        alt: 'Sunlit living room with joinery',
        shape: 'tall',
      },
      {
        src: u('1586023492125-27b2c045efd7'),
        alt: 'Seating arranged around a low table',
        shape: 'square',
      },
      {
        src: u('1615529182904-14819c35db37'),
        alt: 'Living room with a media wall',
        shape: 'square',
      },
    ],
  },
  {
    slug: 'master-bedroom',
    label: 'Master bedroom designs',
    title: 'Master bedrooms',
    kicker: 'Home',
    intro:
      'A quieter palette and warmer light, with every fixture placed for the way you actually rest. Headboard, storage and lighting are drawn as one piece rather than bought separately.',
    hero: { src: u('1590381105924-c72589b9ef3f'), alt: 'A primary bedroom suite in soft neutrals' },
    points: [
      'Headboard panelling with integrated reading light',
      'Wardrobe and dresser designed into the same wall',
      'Two-way switching so nobody crosses the room in the dark',
      'Blackout and sheer layers on a concealed track',
    ],
    gallery: [
      {
        src: u('1578683010236-d716f9a3f461'),
        alt: 'Bedroom in a soft neutral palette',
        shape: 'tall',
      },
      {
        src: u('1522708323590-d24dbb6b0267'),
        alt: 'Panelled headboard and side tables',
        shape: 'wide',
      },
      { src: u('1600566752355-35792bedcfea'), alt: 'Bedroom with fitted storage', shape: 'square' },
      { src: u('1595428774223-ef52624120d2'), alt: 'Wardrobe doors in a bedroom', shape: 'square' },
    ],
  },
  {
    slug: 'bathroom',
    label: 'Bathroom designs',
    title: 'Bathrooms',
    kicker: 'Home',
    intro:
      'Wet areas are where interiors fail first, so these are detailed for water before they are detailed for looks — falls, waterproofing and moisture-stable materials throughout.',
    hero: { src: u('1584622650111-993a426fbf0a'), alt: 'A bathroom vanity with mirror cabinet' },
    points: [
      'Waterproofing and floor falls set out before tiling',
      'Vanity and mirror cabinet in moisture-stable materials',
      'Concealed cisterns and diverters, serviceable from the front',
      'Anti-skid floor finish with a dry-zone separation',
    ],
    gallery: [
      { src: u('1552321554-5fefe8c9ef14'), alt: 'Bathroom with a walk-in shower', shape: 'tall' },
      { src: u('1620626011761-996317b8d101'), alt: 'Vanity with stone counter', shape: 'square' },
      {
        src: u('1616594039964-ae9021a400a0'),
        alt: 'Tiled bathroom in neutral tones',
        shape: 'wide',
      },
      { src: u('1618221195710-dd6b41faaea6'), alt: 'Minimal bathroom detail', shape: 'square' },
    ],
  },
  {
    slug: 'tv-units',
    label: 'TV unit designs',
    title: 'TV & media units',
    kicker: 'Home',
    intro:
      'A media wall does more than hold a screen. Cable runs, ventilation and the boxes nobody wants to look at are all planned in before the finish is chosen.',
    hero: { src: u('1598928506311-c55ded91a20c'), alt: 'A living room with a built-in media wall' },
    points: [
      'Concealed cable routing and power behind the panel',
      'Ventilated compartments for set-top boxes and consoles',
      'Back-lit niches and display shelving',
      'Screen height set from your seating, not from the wall',
    ],
    gallery: [
      {
        src: u('1615529182904-14819c35db37'),
        alt: 'Media wall with display niches',
        shape: 'wide',
      },
      {
        src: u('1586023492125-27b2c045efd7'),
        alt: 'Living room with a low media unit',
        shape: 'square',
      },
      { src: u('1600210491892-03d54c0aaf87'), alt: 'Seating facing a media wall', shape: 'tall' },
      {
        src: u('1564078516393-cf04bd966897'),
        alt: 'Living space with built-in storage',
        shape: 'square',
      },
    ],
  },
  {
    slug: 'false-ceiling',
    label: 'False ceiling designs',
    title: 'False ceilings',
    kicker: 'Home & office',
    intro:
      'Ceilings carry the lighting, the air conditioning and most of the mess. A good one hides all of it and still leaves the room feeling taller than it is.',
    hero: { src: u('1567016432779-094069958ea5'), alt: 'A layered ceiling with cove lighting' },
    points: [
      'Cove, peripheral or full drop, chosen for the room height',
      'AC ducting, grilles and diffusers coordinated into the design',
      'Profile and spot lighting on separate circuits',
      'Access panels planned where services need reaching',
    ],
    gallery: [
      {
        src: u('1616627561950-9f746e330187'),
        alt: 'Recessed ceiling with concealed lighting',
        shape: 'wide',
      },
      {
        src: u('1586023492125-27b2c045efd7'),
        alt: 'Living room with a stepped ceiling',
        shape: 'square',
      },
      {
        src: u('1615529182904-14819c35db37'),
        alt: 'Ceiling detail above a media wall',
        shape: 'tall',
      },
      {
        src: u('1600607687939-ce8a6c25118c'),
        alt: 'Entrance with a dropped ceiling',
        shape: 'square',
      },
    ],
  },
  {
    slug: 'pooja-room',
    label: 'Pooja room designs',
    title: 'Pooja rooms',
    kicker: 'Home',
    intro:
      'A prayer space wants stillness, the right light and somewhere to put everything away. We design the niche, the jali and the storage as a single quiet composition.',
    hero: { src: u('1600607687939-ce8a6c25118c'), alt: 'An entrance niche with a console' },
    points: [
      'Niche or standalone unit, sized to the space you have',
      'Jali panels, arches and carved detail to your preference',
      'Warm concealed lighting rather than a bare fixture',
      'Drawers and shelving for lamps, oils and everyday items',
    ],
    gallery: [
      {
        src: u('1618221195710-dd6b41faaea6'),
        alt: 'A quiet corner in warm neutrals',
        shape: 'tall',
      },
      { src: u('1502005229762-cf1b2da7c5d6'), alt: 'A light well above a stair', shape: 'square' },
      { src: u('1616627561950-9f746e330187'), alt: 'Concealed lighting detail', shape: 'wide' },
      {
        src: u('1567016432779-094069958ea5'),
        alt: 'Cove lighting in a living space',
        shape: 'square',
      },
    ],
  },
  {
    slug: 'dining-room',
    label: 'Dining room designs',
    title: 'Dining rooms',
    kicker: 'Home',
    intro:
      'Usually the smallest room asked to do the most. The table size, the pendant height and the crockery storage are settled together, so the room works when it is full.',
    hero: { src: u('1617806118233-18e1de247200'), alt: 'A dining table beneath a pendant light' },
    points: [
      'Table sized to the room, with clearance to pull chairs out',
      'Pendant height set from the tabletop, not the ceiling',
      'Crockery unit or sideboard built into the wall',
      'Mirror or panelling to widen a narrow room',
    ],
    gallery: [
      {
        src: u('1540518614846-7eded433c457'),
        alt: 'Dining setting with upholstered chairs',
        shape: 'wide',
      },
      {
        src: u('1599696848652-f0ff23bc911f'),
        alt: 'Kitchen and dining in one space',
        shape: 'tall',
      },
      {
        src: u('1586023492125-27b2c045efd7'),
        alt: 'Dining area beside a living room',
        shape: 'square',
      },
      {
        src: u('1567016432779-094069958ea5'),
        alt: 'Pendant lighting over a table',
        shape: 'square',
      },
    ],
  },
  {
    slug: 'kids-bedroom',
    label: 'Kids bedroom designs',
    title: 'Kids bedrooms',
    kicker: 'Home',
    intro:
      'Built to outlast the phase it was designed for. Sturdy finishes, storage a child can actually reach, and a layout that still works when the toys become books.',
    hero: { src: u('1558211583-d26f610c1eb1'), alt: 'A child’s bedroom with built-in storage' },
    points: [
      'Rounded edges and hard-wearing, wipeable finishes',
      'Storage at a height a child can use unaided',
      'Study desk designed in rather than added later',
      'A layout that adapts as they grow',
    ],
    gallery: [
      { src: u('1522708323590-d24dbb6b0267'), alt: 'Bedroom with fitted furniture', shape: 'tall' },
      { src: u('1600566752355-35792bedcfea'), alt: 'Bed with storage alongside', shape: 'square' },
      { src: u('1595428774223-ef52624120d2'), alt: 'Panelled storage doors', shape: 'wide' },
      { src: u('1578683010236-d716f9a3f461'), alt: 'Bedroom in a soft palette', shape: 'square' },
    ],
  },
  {
    slug: 'home-office',
    label: 'Home office designs',
    title: 'Home offices',
    kicker: 'Office & home',
    intro:
      'A desk in a corner is not a home office. Light direction, camera background, cable management and somewhere to shut the work away all get designed in.',
    hero: { src: u('1593062096033-9a26b09da705'), alt: 'A home office with a built-in desk' },
    points: [
      'Desk placed for daylight without glare on the screen',
      'A considered background for calls',
      'Cable trays, power and data routed out of sight',
      'Closed storage so the room stops being an office in the evening',
    ],
    gallery: [
      {
        src: u('1585128792020-803d29415281'),
        alt: 'Study desk with shelving above',
        shape: 'wide',
      },
      {
        src: u('1524758631624-e2822e304c36'),
        alt: 'Work table with soft lighting',
        shape: 'square',
      },
      { src: u('1497366216548-37526070297c'), alt: 'Workspace with open shelving', shape: 'tall' },
      { src: u('1618221195710-dd6b41faaea6'), alt: 'Minimal workspace detail', shape: 'square' },
    ],
  },
  {
    slug: 'office-cabin',
    label: 'Office cabin designs',
    title: 'Office cabins',
    kicker: 'Office',
    intro:
      'Cabins, meeting rooms and reception areas planned around how the team actually works — including the acoustic separation that open plans give up.',
    hero: { src: u('1604709177225-055f99402ea3'), alt: 'An office cabin with a glass partition' },
    points: [
      'Glazed or solid partitions, with acoustic detailing',
      'Storage, credenza and display built into the cabin',
      'Cable management to every desk position',
      'Reception and waiting area finished to match',
    ],
    gallery: [
      {
        src: u('1497215842964-222b430dc094'),
        alt: 'Meeting room with a long table',
        shape: 'wide',
      },
      {
        src: u('1497366216548-37526070297c'),
        alt: 'Open-plan office with workstations',
        shape: 'tall',
      },
      {
        src: u('1524758631624-e2822e304c36'),
        alt: 'Cabin interior with soft lighting',
        shape: 'square',
      },
      { src: u('1585128792020-803d29415281'), alt: 'Desk with overhead storage', shape: 'square' },
    ],
  },
];

export const designCategoryBySlug = new Map(designCategories.map((c) => [c.slug, c]));
