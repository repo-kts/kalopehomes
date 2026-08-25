/**
 * All copy and imagery for the marketing site lives here so the page
 * components stay purely presentational.
 *
 * The `src` values are Unsplash placeholders — swap each one for a real
 * Kalope photograph (drop the file in `public/` and use `/name.jpg`).
 */

export type NavLink = { label: string; href: string; children?: NavLink[] };

/**
 * Design-idea categories shown in the header dropdown.
 *
 * They all point at the Best selling section for now — there are no
 * per-category pages yet. Give each one a real `href` once those exist.
 */
export const designCategories: NavLink[] = [
  { label: 'Modular kitchen designs', href: '#best-selling' },
  { label: 'Wardrobe designs', href: '#best-selling' },
  { label: 'Living room designs', href: '#best-selling' },
  { label: 'Master bedroom designs', href: '#best-selling' },
  { label: 'Bathroom designs', href: '#best-selling' },
  { label: 'TV unit designs', href: '#best-selling' },
  { label: 'False ceiling designs', href: '#best-selling' },
  { label: 'Pooja room designs', href: '#best-selling' },
  { label: 'Dining room designs', href: '#best-selling' },
  { label: 'Kids bedroom designs', href: '#best-selling' },
  { label: 'Home office designs', href: '#best-selling' },
  { label: 'Office cabin designs', href: '#best-selling' },
];

export const nav: NavLink[] = [
  { label: 'Design', href: '#projects', children: designCategories },
  { label: 'Best selling', href: '#best-selling' },
  { label: 'Services', href: '#services' },
  { label: 'Studio', href: '#studio' },
  { label: 'Reviews', href: '#reviews' },
];

export const site = {
  name: 'Kalope Homes',
  tagline: 'All-In-One Office & Home Solution',
  email: 'hello@kalopehomes.com',
  footerLine: 'Interior architecture & build',
} as const;

/** A headline line; `accent` is the trailing run set in brand orange. */
export type HeadlineLine = { text: string; accent?: string };

/**
 * Two lines rather than three — each one is its own block so the rise
 * animation can stagger them, so the breaks are deliberate, not reflow.
 */
export const heroHeadline: HeadlineLine[] = [
  { text: 'Interiors that unfold' },
  { text: 'like ', accent: 'architecture.' },
];

export const hero = {
  body: 'Office and home interiors, designed and built by one team.',
  image: {
    src: '/hero-poster.jpg',
    alt: 'The entrance and living room of a completed Kalope Homes interior',
  },
  video: '/hero.mp4',
} as const;

export type Room = {
  num: string;
  name: string;
  desc: string;
  src: string;
  alt: string;
  credit: string;
  creditHref: string;
};

export const rooms: Room[] = [
  {
    num: 'Room 01 / 04',
    name: 'The Living Room',
    desc: 'Where the house opens up. Layered light, honest materials, and seating built to the room, not bought to fill it.',
    src: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1600&auto=format&fit=crop',
    alt: 'A calm living room with warm neutral furnishings',
    credit: 'Photo by Collov Home Design on Unsplash',
    creditHref: 'https://unsplash.com/@collovhome',
  },
  {
    num: 'Room 02 / 04',
    name: 'The Kitchen',
    desc: 'Stone counters and quiet cabinetry, drawn to the millimetre in our own workshop.',
    src: 'https://images.unsplash.com/photo-1581783458534-001a466b5487?q=80&w=1600&auto=format&fit=crop',
    alt: 'A minimal kitchen with stone surfaces and flush cabinetry',
    credit: 'Photo by Jean-Philippe Delberghe on Unsplash',
    creditHref: 'https://unsplash.com/@jipy32',
  },
  {
    num: 'Room 03 / 04',
    name: 'The Bedroom',
    desc: 'A softer palette and warmer light, with every fixture placed for the way you actually rest.',
    src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1600&auto=format&fit=crop',
    alt: 'A bedroom in a soft neutral palette with low warm lighting',
    credit: 'Photo by Roberto Nickson on Unsplash',
    creditHref: 'https://unsplash.com/@rpnickson',
  },
  {
    num: 'Room 04 / 04',
    name: 'The Stair',
    desc: 'The transitions between rooms matter as much as the rooms. Landings, thresholds and light wells, resolved.',
    src: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1600&auto=format&fit=crop',
    alt: 'A sculptural staircase lit from a skylight above',
    credit: 'Photo by Jason Briscoe on Unsplash',
    creditHref: 'https://unsplash.com/@jsnbrsc',
  },
];

export type Project = {
  num: string;
  name: string;
  meta: string;
  src: string;
  alt: string;
  credit: string;
  creditHref: string;
};

export const projects: Project[] = [
  {
    num: '01',
    name: 'Aster Residence',
    meta: 'Full home · Athens · 2025',
    src: 'https://images.unsplash.com/photo-1564078516393-cf04bd966897?q=80&w=1200&auto=format&fit=crop',
    alt: 'Living space of the Aster Residence',
    credit: 'Photo by Roberto Nickson on Unsplash',
    creditHref: 'https://unsplash.com/@rpnickson',
  },
  {
    num: '02',
    name: 'Villa Limen',
    meta: 'Kitchen & dining · Glyfada · 2025',
    src: 'https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?q=80&w=1200&auto=format&fit=crop',
    alt: 'Kitchen and dining area of Villa Limen',
    credit: 'Photo by aranprime on Unsplash',
    creditHref: 'https://unsplash.com/@aranprime',
  },
  {
    num: '03',
    name: 'Casa Petra',
    meta: 'Primary suite · Kifisia · 2024',
    src: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1200&auto=format&fit=crop',
    alt: 'Primary bedroom suite of Casa Petra',
    credit: 'Photo by Rod Long on Unsplash',
    creditHref: 'https://unsplash.com/@rodlong',
  },
];

export type Service = { num: string; name: string; desc: string };

export const services: Service[] = [
  {
    num: '01',
    name: 'Full interior fit-out',
    desc: 'Complete design and construction of interiors, covering walls, ceilings, flooring, lighting and finishes on one contract.',
  },
  {
    num: '02',
    name: 'Office interiors & workstations',
    desc: 'Workstations, cabins, meeting rooms and reception areas planned around how your team actually works.',
  },
  {
    num: '03',
    name: 'Modular kitchens & joinery',
    desc: 'Custom cabinetry, wardrobes and millwork made in our own workshop and fitted by the people who drew them.',
  },
  {
    num: '04',
    name: 'Renovation & restructure',
    desc: 'Opening plans, moving services and re-sequencing rooms in existing apartments, houses and offices.',
  },
  {
    num: '05',
    name: 'Furniture & styling',
    desc: 'Sourcing and placement of furniture, textiles and art to complete the space after handover.',
  },
  {
    num: '06',
    name: 'Turnkey project management',
    desc: 'One lead, one schedule and one point of contact from first survey through to final snag list.',
  },
];

export type Step = { num: string; name: string; desc: string };

export const steps: Step[] = [
  {
    num: '01',
    name: 'Survey & brief',
    desc: 'We measure the space, listen to how you live, and agree scope and budget in writing.',
  },
  {
    num: '02',
    name: 'Design set',
    desc: 'Plans, elevations and material boards, revised with you until every detail is resolved.',
  },
  {
    num: '03',
    name: 'Build',
    desc: 'Our own crews on site with a fixed schedule and a single lead who answers your calls.',
  },
  {
    num: '04',
    name: 'Handover',
    desc: 'Snag-free delivery, care guide, and a two-year warranty on everything we built.',
  },
];

export const studio = {
  heading: "A small studio with a builder's hands.",
  body: [
    'Kalope Homes is a team of twelve architects, joiners and site leads under one roof. We design the interior and build it ourselves, so nothing is lost between the drawing and the room.',
    'Every project keeps one lead from first sketch to handover.',
  ],
  stats: [
    { value: '140+', label: 'Homes delivered' },
    { value: '12', label: 'Years in practice' },
    { value: '1', label: 'Lead per project' },
  ],
  image: {
    src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1400&auto=format&fit=crop',
    alt: 'The Kalope Homes studio',
    credit: 'Photo on Unsplash',
    creditHref: 'https://unsplash.com',
  },
} as const;

/* ------------------------------------------------------------------ *
 * Best sellers
 * ------------------------------------------------------------------ */
export type BestSeller = {
  num: string;
  name: string;
  category: 'Home' | 'Office';
  desc: string;
  src: string;
  alt: string;
};

export const bestSellers: BestSeller[] = [
  {
    num: '01',
    name: 'Modular kitchens',
    category: 'Home',
    desc: 'Soft-close cabinetry, engineered stone counters and appliance integration, built to your plan.',
    src: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=1200&auto=format&fit=crop',
    alt: 'A modular kitchen with pale cabinetry and stone counters',
  },
  {
    num: '02',
    name: 'Wardrobes & storage',
    category: 'Home',
    desc: 'Floor-to-ceiling wardrobes, walk-ins and loft storage that use every millimetre of the room.',
    src: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=1200&auto=format&fit=crop',
    alt: 'A fitted wardrobe with open shelving',
  },
  {
    num: '03',
    name: 'Office workstations',
    category: 'Office',
    desc: 'Desking, storage and acoustic screens configured for teams of six to sixty.',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    alt: 'An open-plan office with workstations',
  },
  {
    num: '04',
    name: 'TV & media units',
    category: 'Home',
    desc: 'Wall-length media walls with concealed cable runs, lighting and display niches.',
    src: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop',
    alt: 'A living room with a built-in media wall',
  },
  {
    num: '05',
    name: 'Bedroom sets',
    category: 'Home',
    desc: 'Beds, side tables, headboard panelling and reading light designed as one piece.',
    src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
    alt: 'A bedroom with panelled headboard and side tables',
  },
  {
    num: '06',
    name: 'Bath & vanity',
    category: 'Home',
    desc: 'Vanity units, mirror cabinets and waterproof storage in moisture-stable materials.',
    src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop',
    alt: 'A bathroom vanity with a mirror cabinet',
  },
];

/* ------------------------------------------------------------------ *
 * Customer reviews
 *
 * !! PLACEHOLDER COPY — THESE ARE NOT REAL CUSTOMERS !!
 * The names and quotes below exist only to lay the section out. Replace
 * every entry with a genuine, attributable review before this site goes
 * live. Publishing invented testimonials as if they were real is
 * misleading, and in many places unlawful.
 * ------------------------------------------------------------------ */
export type Review = {
  quote: string;
  name: string;
  meta: string;
  initials: string;
  rating: number;
};

export const reviews: Review[] = [
  {
    quote:
      'They handled the drawings and the site work, so there was never a gap between what we approved and what got built. The kitchen landed exactly as it looked on paper.',
    name: 'Placeholder Name',
    meta: 'Full home · replace with a real customer',
    initials: 'PN',
    rating: 5,
  },
  {
    quote:
      'We moved forty people onto the new floor without losing a working day. The schedule they gave us at the start is the one they finished on.',
    name: 'Placeholder Name',
    meta: 'Office fit-out · replace with a real customer',
    initials: 'PN',
    rating: 5,
  },
  {
    quote:
      'One person answered the phone for the whole project. After dealing with three separate contractors last time, that alone was worth it.',
    name: 'Placeholder Name',
    meta: 'Renovation · replace with a real customer',
    initials: 'PN',
    rating: 5,
  },
  {
    quote:
      'The storage they drew for the bedroom uses space I had written off entirely. Two years on, nothing has warped or dropped.',
    name: 'Placeholder Name',
    meta: 'Wardrobes · replace with a real customer',
    initials: 'PN',
    rating: 5,
  },
];

/* ------------------------------------------------------------------ *
 * Book a consultancy
 * ------------------------------------------------------------------ */
export const consultation = {
  heading: 'Book a consultancy',
  body: 'Tell us about the space and we will come and measure it. The first visit, the survey and the estimate cost nothing. You only commit once the drawings and the number are in front of you.',
  points: [
    'Free site survey and measurement',
    'Written estimate before any commitment',
    'One lead from first sketch to handover',
  ],
  projectTypes: [
    'Full home interior',
    'Office interior',
    'Modular kitchen',
    'Wardrobes & storage',
    'Renovation',
    'Something else',
  ],
  /** !! PLACEHOLDER — replace both with your real details. */
  phone: '+91 00000 00000',
  address: 'Add your studio address here',
} as const;
