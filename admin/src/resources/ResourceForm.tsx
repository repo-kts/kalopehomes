import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
import { deserialize, serialize, tagsToText, textToTags } from './transform';
import type { FieldConfig, ResourceConfig } from './types';
import { useResourceOptions } from './useResourceOptions';

type Rec = Record<string, unknown>;

interface Props {
  config: ResourceConfig;
  record: Rec | null;
  onClose: () => void;
  onSubmit: (payload: Rec) => Promise<void>;
}

export function ResourceForm({ config, record, onClose, onSubmit }: Props) {
  const isEdit = Boolean(record);
  const [values, setValues] = useState<Rec>(() => deserialize(config, record));
  const [saving, setSaving] = useState(false);

  const setField = (name: string, value: unknown) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let payload: Rec;
    try {
      payload = serialize(config, values, isEdit);
    } catch {
      toast.error('Specs must be valid JSON');
      return;
    }
    // Auto-slug from source field if slug left blank.
    for (const field of config.fields) {
      if (field.slugFrom && !payload[field.name] && payload[field.slugFrom]) {
        payload[field.name] = String(payload[field.slugFrom])
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    }

    setSaving(true);
    try {
      await onSubmit(payload);
      toast.success(`${config.labelSingular} ${isEdit ? 'updated' : 'created'}`);
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Something went wrong';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit' : 'New'} {config.labelSingular.toLowerCase()}
          </DialogTitle>
          <DialogDescription>
            {isEdit && record?.updatedAt
              ? `Last updated ${formatDate(record.updatedAt as string)}`
              : `Add a new ${config.labelSingular.toLowerCase()} to the catalog.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          {config.fields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={values[field.name]}
              onChange={(v) => setField(field.name, v)}
            />
          ))}

          <DialogFooter className="sm:col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner />}
              {isEdit ? 'Save changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const wide = ['textarea', 'json', 'tags', 'relations'].includes(field.type);
  const options = useResourceOptions(
    field.type === 'relation' || field.type === 'relations' ? field.optionsResource : undefined,
  );

  return (
    <div className={cn('flex flex-col gap-1.5', wide && 'sm:col-span-2')}>
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </Label>

      {field.type === 'textarea' && (
        <Textarea
          id={field.name}
          value={(value as string) ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'json' && (
        <Textarea
          id={field.name}
          className="font-mono text-xs min-h-[120px]"
          value={(value as string) ?? ''}
          placeholder='{ "layout": "L-shaped" }'
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'tags' && (
        <Textarea
          id={field.name}
          value={tagsToText(value)}
          placeholder="One value per line"
          onChange={(e) => onChange(textToTags(e.target.value))}
        />
      )}

      {field.type === 'checkbox' && (
        <div className="flex h-9 items-center">
          <Checkbox
            id={field.name}
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
        </div>
      )}

      {field.type === 'select' && (
        <Select
          id={field.name}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      )}

      {field.type === 'relation' && (
        <Select
          id={field.name}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">— None —</option>
          {options.data?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      )}

      {field.type === 'relations' && (
        <div className="flex flex-wrap gap-2 rounded-md border p-2">
          {options.isLoading && <Spinner />}
          {options.data?.map((o) => {
            const selected = Array.isArray(value) && (value as string[]).includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  const current = Array.isArray(value) ? (value as string[]) : [];
                  onChange(
                    selected ? current.filter((v) => v !== o.value) : [...current, o.value],
                  );
                }}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors',
                  selected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-accent',
                )}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      {['text', 'url', 'number'].includes(field.type) && (
        <Input
          id={field.name}
          type={field.type === 'number' ? 'number' : 'text'}
          value={(value as string) ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
    </div>
  );
}
