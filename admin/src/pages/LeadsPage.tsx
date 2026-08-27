import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PageLoader } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiFetch, type Paginated } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { LEAD_STATUSES, leadStatusBadge } from './leadStatus';

interface LeadRow {
  id: string;
  referenceNo: string;
  name: string;
  phone: string;
  city: string | null;
  type: string;
  status: string;
  createdAt: string;
  assignedTo: { name: string } | null;
  _count: { quotes: number; activities: number };
}

export function LeadsPage() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['leads', page, q, status],
    queryFn: () =>
      apiFetch<Paginated<LeadRow>>('/leads', { params: { page, pageSize: 20, q, status } }),
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground">
          {data?.meta.total ?? 0} inquiries in the quotation pipeline
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search by name, phone, ref…"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
          />
        </div>
        <Select
          className="w-auto min-w-[150px]"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </Select>
      </div>

      <Card>
        {isLoading ? (
          <PageLoader />
        ) : (data?.data.length ?? 0) === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No leads found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Quotes</TableHead>
                <TableHead>Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-mono text-xs">
                    <Link className="text-primary hover:underline" to={`/leads/${lead.id}`}>
                      {lead.referenceNo}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.type.replace(/_/g, ' ')}
                  </TableCell>
                  <TableCell>{leadStatusBadge(lead.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.assignedTo?.name ?? 'Unassigned'}
                  </TableCell>
                  <TableCell>{lead._count.quotes}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(lead.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 text-sm">
          <span className="text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
