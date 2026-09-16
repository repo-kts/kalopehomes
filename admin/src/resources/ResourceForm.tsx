import { useEffect, useRef, useState, type FormEvent } from 'react';
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
import { ApiError, uploadImages } from '@/lib/api';
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
  const wide = ['textarea', 'richtext', 'json', 'tags', 'relations'].includes(field.type);
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

      {field.type === 'richtext' && <RichTextField value={value} onChange={onChange} />}

      {field.type === 'json' && (
        <Textarea
          id={field.name}
          className="font-mono text-xs min-h-[120px]"
          value={(value as string) ?? ''}
          placeholder='{ "layout": "L-shaped" }'
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'tags' &&
        (field.preview ? (
          <ImageListField field={field} value={value} onChange={onChange} />
        ) : (
          <Textarea
            id={field.name}
            value={tagsToText(value)}
            placeholder="One value per line"
            onChange={(e) => onChange(textToTags(e.target.value))}
          />
        ))}

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

function sanitizeBlogHtml(raw: unknown): string {
  const html = typeof raw === 'string' ? raw : '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const allowedTags = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'span', 'div']);
  const allowedAttrs: Record<string, Set<string>> = {
    a: new Set(['href', 'target', 'rel']),
    img: new Set(['src', 'alt', 'title']),
  };

  const elements = Array.from(doc.body.querySelectorAll('*'));
  for (const el of elements) {
    const tag = el.tagName.toLowerCase();
    if (!allowedTags.has(tag)) {
      el.replaceWith(...Array.from(el.childNodes));
      continue;
    }

    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
        continue;
      }
      if (!allowedAttrs[tag]?.has(name)) {
        el.removeAttribute(attr.name);
      }
    }

    if (tag === 'a') {
      const href = el.getAttribute('href');
      if (!href) {
        el.removeAttribute('href');
      } else {
        try {
          const url = new URL(href, 'https://example.com');
          if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) {
            el.removeAttribute('href');
          }
        } catch {
          el.removeAttribute('href');
        }
      }
    }

    if (tag === 'img') {
      const src = el.getAttribute('src');
      if (!src) {
        el.removeAttribute('src');
      } else {
        try {
          const url = new URL(src, 'https://example.com');
          if (!['http:', 'https:', 'data:'].includes(url.protocol)) {
            el.removeAttribute('src');
          }
        } catch {
          el.removeAttribute('src');
        }
      }
    }
  }

  return doc.body.innerHTML.trim();
}

function RichTextField({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false });

  useEffect(() => {
    const sanitized = sanitizeBlogHtml(value);
    if (editorRef.current && editorRef.current.innerHTML !== sanitized) {
      editorRef.current.innerHTML = sanitized;
    }
  }, [value]);

  useEffect(() => {
    function updateActiveFormats() {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
      });
    }

    document.addEventListener('selectionchange', updateActiveFormats);
    return () => document.removeEventListener('selectionchange', updateActiveFormats);
  }, []);

  function format(command: 'bold' | 'italic' | 'underline') {
    editorRef.current?.focus();
    document.execCommand(command);
    setActiveFormats((current) => ({ ...current, [command]: document.queryCommandState(command) }));
    onChange(sanitizeBlogHtml(editorRef.current?.innerHTML ?? ''));
  }

  async function insertImage(file: File | undefined) {
    if (!file || !editorRef.current) return;
    setUploading(true);
    try {
      const [url] = await uploadImages([file]);
      editorRef.current.focus();
      document.execCommand('insertImage', false, url);
      onChange(sanitizeBlogHtml(editorRef.current.innerHTML));
      toast.success('Image inserted');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="flex items-center gap-1 border-b bg-muted/30 p-1">
        {(['bold', 'italic', 'underline'] as const).map((command) => (
          <Button
            key={command}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={command[0].toUpperCase() + command.slice(1)}
            title={command[0].toUpperCase() + command.slice(1)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => format(command)}
            className={cn(
              'font-serif text-base',
              activeFormats[command] &&
                'bg-secondary-foreground/15 text-secondary-foreground hover:bg-secondary-foreground/25',
              command === 'bold' && 'font-bold',
              command === 'italic' && 'italic',
              command === 'underline' && 'underline',
            )}
          >
            {command === 'bold' ? 'B' : command === 'italic' ? 'I' : 'U'}
          </Button>
        ))}
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
          className="hidden"
          onChange={(e) => void insertImage(e.target.files?.[0])}
        />
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileInput.current?.click()}>
          {uploading ? 'Uploading…' : 'Insert image'}
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        className="min-h-48 p-3 text-sm outline-none"
        onInput={(e) => onChange(sanitizeBlogHtml(e.currentTarget.innerHTML))}
        data-placeholder="Write your blog content..."
      />
    </div>
  );
}

/**
 * Image list: upload files or paste URLs, either way ending up as the same
 * array of URLs. Uploads are stored by the API and come back as normal links,
 * so nothing downstream needs to know how an image got here.
 */
function ImageListField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const urls = Array.isArray(value) ? (value as string[]) : [];
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(list: FileList | null) {
    const files = Array.from(list ?? []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploaded = await uploadImages(files);
      onChange([...urls, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length === 1 ? '' : 's'} uploaded`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      // Cleared so picking the same file again still fires a change event.
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
        >
          {uploading && <Spinner />}
          {uploading ? 'Uploading…' : 'Upload images'}
        </Button>
        <span className="text-xs text-muted-foreground">
          or paste URLs below — PNG, JPEG, WebP, AVIF or GIF, up to 10 MB each
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
        <Textarea
          id={field.name}
          value={tagsToText(value)}
          placeholder="One value per line"
          onChange={(e) => onChange(textToTags(e.target.value))}
        />
        <div className="grid min-h-28 grid-cols-2 gap-2 rounded-md border bg-muted/20 p-2">
          {urls.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative">
              <img
                src={url}
                alt={`Image preview ${index + 1}`}
                className="aspect-square w-full rounded object-cover"
                onError={(e) => {
                  e.currentTarget.style.visibility = 'hidden';
                }}
              />
              <button
                type="button"
                aria-label={`Remove image ${index + 1}`}
                onClick={() => onChange(urls.filter((_, i) => i !== index))}
                className="absolute right-0.5 top-0.5 hidden size-5 items-center justify-center rounded-full bg-background/90 text-xs leading-none shadow group-hover:flex hover:bg-destructive hover:text-destructive-foreground"
              >
                ×
              </button>
            </div>
          ))}
          {urls.length === 0 && (
            <span className="col-span-2 self-center text-center text-xs text-muted-foreground">
              Preview appears here
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
