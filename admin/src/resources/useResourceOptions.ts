import { useQuery } from '@tanstack/react-query';

import { apiFetch } from '@/lib/api';

interface Option {
  value: string;
  label: string;
}

/**
 * Loads select options for a relation field from a list endpoint.
 * Handles both paginated (`{data,meta}`) and plain (`{data}`) responses.
 */
export function useResourceOptions(resource: string | undefined) {
  return useQuery({
    queryKey: ['options', resource],
    enabled: Boolean(resource),
    queryFn: async (): Promise<Option[]> => {
      const res = await apiFetch<{ data: Array<Record<string, unknown>> }>(`/${resource}`, {
        params: { pageSize: 100 },
      });
      return res.data.map((row) => ({
        value: String(row.id),
        label: String(row.name ?? row.title ?? row.email ?? row.id),
      }));
    },
    staleTime: 60_000,
  });
}
