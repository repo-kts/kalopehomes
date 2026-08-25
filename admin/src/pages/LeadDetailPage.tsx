import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { PageLoader } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/auth/useAuth';
import { apiFetch, type Envelope } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useResourceOptions } from '@/resources/useResourceOptions';
import { LEAD_STATUSES, leadStatusBadge, quoteStatusBadge } from './leadStatus';
import { QuoteForm } from './QuoteForm';

interface Activity {
  id: string;
  type: string;
  note: string | null;
  createdAt: string;
  createdBy: { name: string } | null;
}
interface Quote {
  id: string;
  quoteNumber: string;
  status: string;
  total: string;
  createdAt: string;
}
interface Lead {
  id: string;
  referenceNo: string;
  type: string;
  name: string;
  email: string | null;
  phone: string;
  city: string | null;
  message: string | null;
  propertyType: string | null;
  budgetRange: string | null;
  roomsInterested: string[];
  source: string;
  status: string;
  createdAt: string;
  assignedTo: { id: string; name: string } | null;
  category: { name: string } | null;
  product: { name: string } | null;
  activities: Activity[];
  quotes: Quote[];
}

export function LeadDetailPage() {
  const { id = '' } = useParams();
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');
  const [showQuote, setShowQuote] = useState(false);

  const users = useResourceOptions('users');

  const { data: lead, isLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => apiFetch<Envelope<Lead>>(`/leads/${id}`).then((r) => r.data),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['lead', id] });

  const patchLead = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch(`/leads/${id}`, { method: 'PATCH', body }),
    onSuccess: () => {
      invalidate();
      toast.success('Lead updated');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addNote = useMutation({
    mutationFn: () =>
      apiFetch(`/leads/${id}/activities`, { method: 'POST', body: { type: 'NOTE', note } }),
    onSuccess: () => {
      setNote('');
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || !lead) return <PageLoader />;

  const canWrite = can('lead:write');
  const canQuote = can('quote:write');

  return (
    <div className="flex flex-col gap-4">
      <Link to="/leads" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to leads
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
            {leadStatusBadge(lead.status)}
          </div>
          <p className="font-mono text-xs text-muted-foreground">{lead.referenceNo}</p>
        </div>
        {canQuote && (
          <Button onClick={() => setShowQuote(true)}>
            <Plus /> New quote
          </Button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: details + pipeline controls */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Card>
            <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <Detail label="Phone" value={lead.phone} />
              <Detail label="Email" value={lead.email} />
              <Detail label="City" value={lead.city} />
              <Detail label="Property" value={lead.propertyType} />
              <Detail label="Budget" value={lead.budgetRange} />
              <Detail label="Source" value={lead.source} />
              <Detail label="Interest" value={lead.category?.name ?? lead.product?.name} />
              <Detail
                label="Rooms"
                value={lead.roomsInterested.length ? lead.roomsInterested.join(', ') : null}
              />
              {lead.message && (
                <div>
                  <div className="text-xs text-muted-foreground">Message</div>
                  <p className="mt-0.5">{lead.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Pipeline</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Status</Label>
                <Select
                  value={lead.status}
                  disabled={!canWrite}
                  onChange={(e) => patchLead.mutate({ status: e.target.value })}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Assigned to</Label>
                <Select
                  value={lead.assignedTo?.id ?? ''}
                  disabled={!canWrite}
                  onChange={(e) => patchLead.mutate({ assignedToId: e.target.value || null })}
                >
                  <option value="">Unassigned</option>
                  {users.data?.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: quotes + activity */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Quotations</CardTitle></CardHeader>
            <CardContent>
              {lead.quotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No quotes yet.</p>
              ) : (
                <div className="flex flex-col divide-y">
                  {lead.quotes.map((qt) => (
                    <div key={qt.id} className="flex items-center justify-between py-2 text-sm">
                      <span className="font-mono text-xs">{qt.quoteNumber}</span>
                      {quoteStatusBadge(qt.status)}
                      <span className="font-medium">{formatCurrency(qt.total)}</span>
                      <span className="text-muted-foreground">{formatDate(qt.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Activity timeline</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              {canWrite && (
                <div className="flex flex-col gap-2">
                  <Textarea
                    placeholder="Add a note about this lead…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <Button
                    size="sm"
                    className="self-end"
                    disabled={!note.trim() || addNote.isPending}
                    onClick={() => addNote.mutate()}
                  >
                    Add note
                  </Button>
                </div>
              )}

              <ol className="flex flex-col gap-3">
                {lead.activities.length === 0 && (
                  <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
                )}
                {lead.activities.map((act) => (
                  <li key={act.id} className="flex gap-3">
                    <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{act.type.replace(/_/g, ' ')}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(act.createdAt)}
                          {act.createdBy ? ` · ${act.createdBy.name}` : ''}
                        </span>
                      </div>
                      {act.note && <p className="text-muted-foreground">{act.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>

      {showQuote && (
        <QuoteForm leadId={lead.id} onClose={() => setShowQuote(false)} onCreated={invalidate} />
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right">{value ?? '—'}</span>
    </div>
  );
}
