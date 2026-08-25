import type { ReactNode } from 'react';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'url'
  | 'checkbox'
  | 'select'
  | 'date'
  | 'tags'
  | 'json'
  | 'relation'
  | 'relations';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  /** Static options for `select`. */
  options?: Array<{ value: string; label: string }>;
  /** For `relation`/`relations`: which resource to load options from. */
  optionsResource?: string;
  /** Default value applied on the create form. */
  defaultValue?: unknown;
  /** Auto-generate this slug field from another field on create. */
  slugFrom?: string;
}

export interface ColumnConfig<T = Record<string, unknown>> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

export interface ResourceConfig {
  /** URL path segment + API path segment, e.g. "categories". */
  key: string;
  /** API path if different from key, e.g. "hero-slides". */
  apiPath?: string;
  labelSingular: string;
  labelPlural: string;
  icon?: string;
  permission: string; // read permission; write assumed by convention
  writePermission: string;
  deletePermission: string;
  columns: ColumnConfig[];
  fields: FieldConfig[];
  filters?: FilterConfig[];
  searchPlaceholder?: string;
  /** Optional client-side default for new records. */
  defaults?: Record<string, unknown>;
}
