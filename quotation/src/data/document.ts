/**
 * The fixed half of the quotation — every word here is transcribed from the
 * approved Kalope Homes document (KH114_Chandan.pdf) and is identical on every
 * quotation. Only the header details block and the item tables change per
 * client; those live in the Quotation model instead.
 *
 * Inline `**bold**` and `*italic*` are rendered by `lib/rich-text`.
 */

export const DOCUMENT_TITLE = 'INTERIOR DESIGN & EXECUTION QUOTATION';

export const INTRO_PARAGRAPH =
  'This quotation covers the **design, supply, fabrication, and installation of interior work ' +
  'using UPVC panels and approved branded accessories**. The scope includes consultation, ' +
  'material procurement, installation, and final handover.';

/** Rendered with the "➔" marker used on page 1 of the reference document. */
export const WHY_KALOPE_HOMES = [
  '100% Waterproof UPVC Interior',
  'Termite Proof (Lifetime Protection)',
  'Low Maintenance & Long Life',
  'Fast Installation (No Mess Work)',
  'Premium Finish with Modern Designs',
];

export const MATERIAL_SPECIFICATIONS = [
  '**UPVC Panels**',
  '**Hardware & Accessories:** Godrej brand will be used. If unavailable, equivalent reputed brands will be used.',
  '**Lighting:** Havells brand lights will be used. If unavailable, equivalent reputed brands will be used.',
  '**Lighting Scope:** The quotation includes **profile lights and console lights only**. Any additional decorative lights or fixtures are not included.',
];

export const WORK_INCLUDED = [
  'Interior Design Consultation',
  'Site Measurement & Planning',
  'Material Procurement',
  'Installation & Fitting',
  'Profile & Console Lighting Installation',
  'Final Inspection & Project Handover',
];

export const WORK_NOT_INCLUDED = [
  'Civil Work',
  'Plumbing Work',
  'POP / False Ceiling',
  'Electrical Rewiring',
  'Wall Painting / Polish',
];

export const EXCLUSIONS_NOTE =
  'Note: Excluded works can be arranged at additional cost if required.';

export const TAXES_NOTE = '(Taxes and additional work, if any, will be charged separately.)';

export const BILLING_NOTES = [
  'GST will be calculated at the billing stage.',
  'Design as per approved drawing / reference image.',
  'Note: Final billing will be based on actual site measurement.',
];

export const COST_BREAKUP: { component: string; percent: string }[] = [
  { component: 'Material Cost', percent: '65%' },
  { component: 'Labour & Fabrication', percent: '25%' },
  { component: 'Installation', percent: '10%' },
];

export const PAYMENT_TERMS = [
  '**50% Advance** – At the time of order confirmation.',
  '**40% Payment** – During fabrication or mid-stage of the project.',
  '**10% Final Payment** – Upon completion and handover of the project.',
];

export const PROJECT_TIMELINE = [
  'Estimated completion time: **15–25 working days** from the date of advance payment and design approval.',
  'The timeline may change depending on **site readiness, material availability, or design modifications**.',
];

export const WARRANTY = [
  'UPVC panels will be supplied from **Realplast**.',
  'Manufacturer warranty will be **as per the company’s policy**.',
  'We provide **1 year warranty on workmanship and installation** from the date of project handover.',
  'Warranty covers **manufacturing defects and installation issues only**.',
  'Warranty does not cover **damage caused by misuse, electrical faults, structural changes, fire, or normal wear and tear**.',
];

export const MATERIAL_CARE = [
  'Clean panels with a **soft cloth and mild detergent**.',
  'Avoid **abrasive cleaners, strong chemicals, or sharp objects**.',
  'Do not expose the panels to **excessive heat or open flames**.',
  'Regular cleaning will help maintain the **finish and durability** of the material.',
];

export const SITE_REQUIREMENTS = [
  'The site should be **ready for installation before starting work**.',
  'Basic **electricity and working space** should be available at the site.',
  'Any delay due to **site unavailability may affect the project timeline**.',
];

export const DESIGN_CHANGES = [
  'Any **changes after final design approval** may result in additional cost and timeline adjustment.',
  'Additional work will be **charged separately with prior approval from the client**.',
];

export const TRANSPORTATION = [
  'Transportation within the city is **included in the quotation**.',
  'Special lifting equipment or additional transport requirements will be **charged separately if required**.',
];

export const TERMS_AND_CONDITIONS = [
  'This quotation is **valid for 15 days** from the date of issue.',
  'Prices may change if **material costs increase or design scope changes**.',
  'Work will start only after **advance payment and final design approval**.',
];

export const CLIENT_APPROVAL_FIELDS = ['Client Name', 'Signature', 'Date'];
