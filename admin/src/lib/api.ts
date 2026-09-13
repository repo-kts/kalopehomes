const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
const BASE = `${API_URL}/api/v1`;
const TOKEN_KEY = 'kalope_admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** Extra query params appended to the URL. */
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
    // Bounce to login on auth failure.
    if (!location.pathname.startsWith('/login')) location.assign('/login');
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as { message?: string }).message ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, message, (data as { details?: unknown }).details);
  }
  return data as T;
}

/**
 * Uploads image files and returns their public URLs.
 *
 * Deliberately not routed through `apiFetch`: that always sets a JSON
 * content-type, whereas multipart needs the browser to set the header itself
 * so it can include the boundary.
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  const form = new FormData();
  for (const file of files) form.append('files', file);

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}/uploads`, { method: 'POST', headers, body: form });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data as { message?: string }).message ?? `Upload failed (${res.status})`;
    throw new ApiError(res.status, message, (data as { details?: unknown }).details);
  }
  return (data as { data: { urls: string[] } }).data.urls;
}

/** Common envelope shapes returned by the API. */
export interface Paginated<T> {
  data: T[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}
export interface Envelope<T> {
  data: T;
}
