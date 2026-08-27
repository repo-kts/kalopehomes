import { QUOTATION_VERSION } from '@/lib/quotation';
import type { Quotation } from '@/types/quotation';

/**
 * KH114 — the approved reference quotation, kept as a fixture so the rendered
 * page can be compared against `KH114_Chandan.pdf` at any time.
 */
export const SAMPLE_QUOTATION: Quotation = {
  version: QUOTATION_VERSION,
  details: {
    quotationNo: 'KH114',
    date: '2026-04-03',
    clientName: 'Chandan',
    projectLocation: 'Pulpar, Biharsharif',
    contactNumber: '8800680879',
    preparedBy: 'Kalope Homes',
  },
  sections: [
    {
      id: 'sample-kitchen',
      title: 'Modular Kitchen',
      blankRows: 2,
      items: [
        {
          id: 'sample-item-1',
          category: 'Modular Kitchen',
          description: 'L-Shape Cabinet',
          unit: 'Sq.ft',
          quantity: '104',
          rate: '1850',
        },
        {
          id: 'sample-item-2',
          category: 'False Ceiling',
          description: 'Plane',
          unit: 'Sq.ft',
          quantity: '75',
          rate: '400',
        },
        {
          id: 'sample-item-3',
          category: 'Wall Louvers',
          description: '1 Layer',
          unit: 'Sq.ft',
          quantity: '39',
          rate: '350',
        },
      ],
    },
  ],
  discount: '',
};
