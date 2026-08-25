import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { PageLoader } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiFetch, type Paginated } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { QUOTE_STATUSES, quoteStatusBadge } from './leadStatus';

interface QuoteRow {
  id: string;
  quoteNumber: string;
  status: string;
  total: string;
  createdAt: string;
  lead: { id: string; referenceNo: string; name: string } | null;
}

export function QuotesPage() {
  const [status, setStatus] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['quotes', status],
    queryFn: () => apiFetch<Paginated<QuoteRow>>('/quotes', { params: { pageSize: 50, status } }),
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Quotes</h1>
        <p className="text-sm text-muted-foreground">{data?.meta.total ?? 0} quotations</p>
      </div>

      <Select className="w-auto min-w-[150px]" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All statuses</option>
        {QUOTE_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>

      <Card>
        {isLoading ? (
          <PageLoader />
        ) : (data?.data.length ?? 0) === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No quotes yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((qt) => (
                <TableRow key={qt.id}>
                  <TableCell className="font-mono text-xs">{qt.quoteNumber}</TableCell>
                  <TableCell>
                    {qt.lead ? (
                      <Link className="text-primary hover:underline" to={`/leads/${qt.lead.id}`}>
                        {qt.lead.name}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>{quoteStatusBadge(qt.status)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(qt.total)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(qt.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
