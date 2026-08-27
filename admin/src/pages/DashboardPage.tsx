import { useQuery } from '@tanstack/react-query';
import { Building2, Inbox, Package, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoader } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/auth/useAuth';
import { apiFetch, type Envelope } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { leadStatusBadge } from '@/pages/leadStatus';

interface Stats {
  catalog: {
    totalProducts: number;
    publishedProducts: number;
    totalCategories: number;
    totalProjects: number;
  };
  leads: { total: number; new: number; byStatus: Array<{ status: string; count: number }> };
  recentLeads: Array<{
    id: string;
    referenceNo: string;
    name: string;
    phone: string;
    status: string;
    type: string;
    createdAt: string;
  }>;
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiFetch<Envelope<Stats>>('/dashboard/stats').then((r) => r.data),
  });

  if (isLoading || !data) return <PageLoader />;

  const cards = [
    { label: 'Products', value: data.catalog.totalProducts, sub: `${data.catalog.publishedProducts} published`, icon: Package, to: '/products' },
    { label: 'Categories', value: data.catalog.totalCategories, sub: 'Catalog taxonomy', icon: Sparkles, to: '/categories' },
    { label: 'Projects', value: data.catalog.totalProjects, sub: 'Portfolio', icon: Building2, to: '/projects' },
    { label: 'New Leads', value: data.leads.new, sub: `${data.leads.total} total`, icon: Inbox, to: '/leads' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening across Kalope Homes.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to}>
            <Card className="transition-colors hover:border-primary/50">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <div className="text-3xl font-bold">{c.value}</div>
                  <div className="text-sm font-medium">{c.label}</div>
                  <div className="text-xs text-muted-foreground">{c.sub}</div>
                </div>
                <c.icon className="size-8 text-primary/70" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Lead pipeline</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {data.leads.byStatus.length === 0 && (
              <p className="text-sm text-muted-foreground">No leads yet.</p>
            )}
            {data.leads.byStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between">
                {leadStatusBadge(s.status)}
                <span className="text-sm font-medium">{s.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent leads</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentLeads.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No leads yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-mono text-xs">
                        <Link className="hover:underline" to={`/leads/${lead.id}`}>
                          {lead.referenceNo}
                        </Link>
                      </TableCell>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{leadStatusBadge(lead.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(lead.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {data.leads.byStatus.length > 0 && (
        <div className="flex gap-2">
          <Badge variant="muted">Tip</Badge>
          <span className="text-sm text-muted-foreground">
            Manage inquiries in the Leads section and convert them into quotes.
          </span>
        </div>
      )}
    </div>
  );
}
