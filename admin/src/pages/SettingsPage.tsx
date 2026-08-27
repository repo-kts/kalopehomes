import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageLoader, Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/auth/useAuth';
import { ApiError, apiFetch } from '@/lib/api';

interface Setting {
  key: string;
  value: unknown;
  group: string | null;
}

export function SettingsPage() {
  const { can } = useAuth();
  const canWrite = can('content:write');
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiFetch<{ data: Setting[] }>('/settings').then((r) => r.data),
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Site Settings</h1>
        <p className="text-sm text-muted-foreground">
          Global configuration consumed by the public website (contact info, stats, SEO…).
        </p>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data?.map((s) => (
            <SettingCard key={s.key} setting={s} canWrite={canWrite} />
          ))}
          <NewSettingCard canWrite={canWrite} />
        </div>
      )}
    </div>
  );
}

function SettingCard({ setting, canWrite }: { setting: Setting; canWrite: boolean }) {
  const queryClient = useQueryClient();
  const [text, setText] = useState('');

  useEffect(() => {
    setText(JSON.stringify(setting.value, null, 2));
  }, [setting.value]);

  const save = useMutation({
    mutationFn: () => {
      let value: unknown;
      try {
        value = JSON.parse(text);
      } catch {
        throw new ApiError(400, 'Value must be valid JSON');
      }
      return apiFetch(`/settings/${setting.key}`, {
        method: 'PUT',
        body: { value, group: setting.group },
      });
    },
    onSuccess: () => {
      toast.success(`Saved "${setting.key}"`);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{setting.key}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Textarea
          className="font-mono text-xs min-h-[120px]"
          value={text}
          disabled={!canWrite}
          onChange={(e) => setText(e.target.value)}
        />
        {canWrite && (
          <Button size="sm" className="self-end" onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Spinner />}
            Save
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function NewSettingCard({ canWrite }: { canWrite: boolean }) {
  const queryClient = useQueryClient();
  const [key, setKey] = useState('');
  const [text, setText] = useState('{\n  \n}');

  const save = useMutation({
    mutationFn: () => {
      let value: unknown;
      try {
        value = JSON.parse(text);
      } catch {
        throw new ApiError(400, 'Value must be valid JSON');
      }
      return apiFetch(`/settings/${key}`, { method: 'PUT', body: { value } });
    },
    onSuccess: () => {
      toast.success('Setting created');
      setKey('');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!canWrite) return null;

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base">Add setting</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Label>Key</Label>
        <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="e.g. social" />
        <Label>Value (JSON)</Label>
        <Textarea
          className="font-mono text-xs min-h-[100px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button size="sm" className="self-end" onClick={() => save.mutate()} disabled={!key || save.isPending}>
          {save.isPending && <Spinner />}
          Create
        </Button>
      </CardContent>
    </Card>
  );
}
