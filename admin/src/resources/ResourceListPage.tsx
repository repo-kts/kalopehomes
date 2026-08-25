import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PageLoader } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/auth/useAuth';
import { apiFetch, type Paginated } from '@/lib/api';
import { ResourceForm } from './ResourceForm';
import { RESOURCES } from './registry';

type Rec = Record<string, unknown>;

export function ResourceListPage({ resourceKey }: { resourceKey: string }) {
  const resource = resourceKey;
  const config = RESOURCES[resource];
  const { can } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Rec | null>(null);
  const [creating, setCreating] = useState(false);

  const apiPath = config?.apiPath ?? config?.key ?? resource;

  const queryKey = useMemo(
    () => ['resource', apiPath, page, q, filters],
    [apiPath, page, q, filters],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    enabled: Boolean(config),
    queryFn: () =>
      apiFetch<Paginated<Rec>>(`/${apiPath}`, {
        params: { page, pageSize: 20, q, ...filters },
      }),
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, payload }: { id?: string; payload: Rec }) =>
      apiFetch(`/${apiPath}${id ? `/${id}` : ''}`, {
        method: id ? 'PATCH' : 'POST',
        body: payload,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resource', apiPath] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/${apiPath}/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource', apiPath] });
      toast.success(`${config?.labelSingular} deleted`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!config) {
    return <div className="p-6 text-muted-foreground">Unknown resource: {resource}</div>;
  }

  const canWrite = can(config.writePermission);
  const canDelete = can(config.deletePermission);
  const rows = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{config.labelPlural}</h1>
          <p className="text-sm text-muted-foreground">
            {data?.meta.total ?? 0} total {config.labelPlural.toLowerCase()}
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setCreating(true)}>
            <Plus /> New {config.labelSingular.toLowerCase()}
          </Button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder={config.searchPlaceholder ?? 'Search…'}
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
          />
        </div>
        {config.filters?.map((filter) => (
          <Select
            key={filter.key}
            className="w-auto min-w-[150px]"
            value={filters[filter.key] ?? ''}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }));
            }}
          >
            <option value="">All {filter.label.toLowerCase()}</option>
            {filter.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <div className="p-6 text-sm text-destructive">
            {(error as Error)?.message ?? 'Failed to load'}
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No {config.labelPlural.toLowerCase()} yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {config.columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={String(row.id)}>
                  {config.columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {canWrite && (
                        <Button variant="ghost" size="icon" onClick={() => setEditing(row)}>
                          <Pencil className="size-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm(`Delete this ${config.labelSingular.toLowerCase()}?`)) {
                              deleteMutation.mutate(String(row.id));
                            }
                          }}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {(creating || editing) && (
        <ResourceForm
          config={config}
          record={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSubmit={async (payload) => {
            await saveMutation.mutateAsync({
              id: editing ? String(editing.id) : undefined,
              payload,
            });
          }}
        />
      )}
    </div>
  );
}
