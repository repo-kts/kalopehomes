import { Badge, type BadgeProps } from '@/components/ui/badge';

type Variant = BadgeProps['variant'];

export const LEAD_STATUSES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'WON',
  'LOST',
] as const;

const LEAD_VARIANT: Record<string, Variant> = {
  NEW: 'info',
  CONTACTED: 'secondary',
  QUALIFIED: 'secondary',
  PROPOSAL_SENT: 'warning',
  NEGOTIATION: 'warning',
  WON: 'success',
  LOST: 'destructive',
};

export function leadStatusBadge(status: string) {
  return <Badge variant={LEAD_VARIANT[status] ?? 'muted'}>{status.replace(/_/g, ' ')}</Badge>;
}

export const QUOTE_STATUSES = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'REVISED'] as const;

const QUOTE_VARIANT: Record<string, Variant> = {
  DRAFT: 'muted',
  SENT: 'info',
  ACCEPTED: 'success',
  REJECTED: 'destructive',
  EXPIRED: 'muted',
  REVISED: 'warning',
};

export function quoteStatusBadge(status: string) {
  return <Badge variant={QUOTE_VARIANT[status] ?? 'muted'}>{status}</Badge>;
}
