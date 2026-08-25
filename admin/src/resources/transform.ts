import type { FieldConfig, ResourceConfig } from './types';

type Rec = Record<string, unknown>;

/** Build initial form values from an existing record (or empty for create). */
export function deserialize(config: ResourceConfig, record: Rec | null): Rec {
  const values: Rec = {};
  for (const field of config.fields) {
    const raw = record?.[field.name];
    switch (field.type) {
      case 'checkbox':
        values[field.name] = record ? Boolean(raw) : Boolean(field.defaultValue ?? false);
        break;
      case 'number':
        values[field.name] = raw ?? (record ? '' : (field.defaultValue ?? ''));
        break;
      case 'relation': {
        const base = field.name.replace(/Id$/, '');
        const derived = (record?.[base] as Rec | undefined)?.id;
        values[field.name] = (typeof raw === 'string' ? raw : derived) ?? '';
        break;
      }
      case 'relations': {
        const base = field.name.replace(/Ids$/, 's'); // roomIds -> rooms
        const arr = (record?.[base] as Rec[] | undefined) ?? [];
        values[field.name] = arr.map(
          (x) =>
            ((x.room as Rec)?.id ?? (x.style as Rec)?.id ?? x.id) as string,
        );
        break;
      }
      case 'tags': {
        const arr = (raw as unknown[] | undefined) ?? [];
        values[field.name] = arr.map((x) =>
          typeof x === 'string' ? x : ((x as Rec).url as string),
        );
        break;
      }
      case 'json':
        values[field.name] = raw ? JSON.stringify(raw, null, 2) : '';
        break;
      default:
        values[field.name] = raw ?? (record ? '' : (field.defaultValue ?? ''));
    }
  }
  return values;
}

/** Convert form values into an API payload. Throws on invalid JSON. */
export function serialize(config: ResourceConfig, values: Rec, isEdit: boolean): Rec {
  const payload: Rec = {};
  for (const field of config.fields) {
    const value = values[field.name];

    // Skip blank password on edit (keeps the existing one).
    if (field.name === 'password' && isEdit && !value) continue;
    if (field.name === 'password' && !value) continue;

    switch (field.type) {
      case 'checkbox':
        payload[field.name] = Boolean(value);
        break;
      case 'number':
        if (value === '' || value === null || value === undefined) {
          payload[field.name] = null;
        } else {
          payload[field.name] = Number(value);
        }
        break;
      case 'relation':
        payload[field.name] = value === '' ? null : value;
        break;
      case 'relations':
        payload[field.name] = Array.isArray(value) ? value : [];
        break;
      case 'tags': {
        const arr = Array.isArray(value) ? (value as string[]) : [];
        // The product image gallery expects objects.
        payload[field.name] =
          field.name === 'images' ? arr.map((url) => ({ url })) : arr;
        break;
      }
      case 'json':
        payload[field.name] =
          typeof value === 'string' && value.trim() ? JSON.parse(value) : null;
        break;
      default:
        payload[field.name] = value;
    }
  }
  return payload;
}

/** For textarea-based tags/images fields: newline-joined string <-> array. */
export function tagsToText(value: unknown): string {
  return Array.isArray(value) ? (value as string[]).join('\n') : '';
}
export function textToTags(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isRequired(field: FieldConfig): boolean {
  return Boolean(field.required);
}
