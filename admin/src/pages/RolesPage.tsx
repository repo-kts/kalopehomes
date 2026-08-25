import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageLoader, Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/auth/useAuth';
import { ApiError, apiFetch, type Envelope } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  permissions: string[];
  isSystem: boolean;
  _count?: { users: number };
}

export function RolesPage() {
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Role | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => apiFetch<{ data: Role[] }>('/roles').then((r) => r.data),
  });

  const { data: catalog } = useQuery({
    queryKey: ['role-permissions'],
    queryFn: () =>
      apiFetch<Envelope<{ wildcard: string; permissions: string[] }>>('/roles/permissions').then(
        (r) => r.data,
      ),
  });

  const canWrite = can('role:write');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">Control what each team member can access.</p>
        </div>
        {canWrite && (
          <Button onClick={() => setCreating(true)}>
            <Plus /> New role
          </Button>
        )}
      </div>

      <Card>
        {isLoading ? (
          <PageLoader />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles?.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="font-medium">{role.name}</div>
                    <div className="text-xs text-muted-foreground">{role.description}</div>
                  </TableCell>
                  <TableCell>
                    {role.permissions.includes('*') ? (
                      <Badge variant="default">All access</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {role.permissions.length} permissions
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{role._count?.users ?? 0}</TableCell>
                  <TableCell className="text-right">
                    {canWrite && (
                      <Button variant="ghost" size="icon" onClick={() => setEditing(role)}>
                        <Pencil className="size-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {(editing || creating) && (
        <RoleDialog
          role={editing}
          allPermissions={catalog?.permissions ?? []}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={() => queryClient.invalidateQueries({ queryKey: ['roles'] })}
        />
      )}
    </div>
  );
}

function RoleDialog({
  role,
  allPermissions,
  onClose,
  onSaved,
}: {
  role: Role | null;
  allPermissions: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(role);
  const [name, setName] = useState(role?.name ?? '');
  const [slug, setSlug] = useState(role?.slug ?? '');
  const [description, setDescription] = useState(role?.description ?? '');
  const [perms, setPerms] = useState<string[]>(role?.permissions ?? []);
  const [saving, setSaving] = useState(false);
  const wildcard = perms.includes('*');

  function toggle(p: string) {
    setPerms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = isEdit
        ? { name, description, permissions: perms }
        : {
            name,
            slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
            description,
            permissions: perms,
          };
      await apiFetch(`/roles${isEdit ? `/${role!.id}` : ''}`, {
        method: isEdit ? 'PATCH' : 'POST',
        body,
      });
      toast.success(`Role ${isEdit ? 'updated' : 'created'}`);
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save role');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit role' : 'New role'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {!isEdit && (
              <div className="flex flex-col gap-1.5">
                <Label>Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="flex items-center justify-between rounded-md border p-2">
            <span className="text-sm font-medium">Full access (wildcard)</span>
            <Button
              type="button"
              size="sm"
              variant={wildcard ? 'default' : 'outline'}
              onClick={() => setPerms(wildcard ? [] : ['*'])}
            >
              {wildcard ? 'Enabled' : 'Disabled'}
            </Button>
          </div>

          {!wildcard && (
            <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto rounded-md border p-2">
              {allPermissions.map((p) => {
                const on = perms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggle(p)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-mono transition-colors',
                      on
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-accent',
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !name}>
            {saving && <Spinner />}
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
