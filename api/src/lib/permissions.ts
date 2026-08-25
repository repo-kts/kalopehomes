/**
 * RBAC permission catalog.
 *
 * Permissions are `resource:action` strings. A role holding the wildcard `*`
 * is granted everything. Content entities (hero slides, testimonials,
 * projects, faqs, settings) share the coarse `content:*` bucket since they are
 * all edited by the same people.
 */
export const PERMISSIONS = {
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',

  ROLE_READ: 'role:read',
  ROLE_WRITE: 'role:write',

  CATEGORY_READ: 'category:read',
  CATEGORY_WRITE: 'category:write',
  CATEGORY_DELETE: 'category:delete',

  PRODUCT_READ: 'product:read',
  PRODUCT_WRITE: 'product:write',
  PRODUCT_DELETE: 'product:delete',

  TAXONOMY_READ: 'taxonomy:read', // rooms & styles
  TAXONOMY_WRITE: 'taxonomy:write',
  TAXONOMY_DELETE: 'taxonomy:delete',

  CONTENT_READ: 'content:read', // hero/testimonial/project/faq/setting
  CONTENT_WRITE: 'content:write',
  CONTENT_DELETE: 'content:delete',

  LEAD_READ: 'lead:read',
  LEAD_WRITE: 'lead:write',
  LEAD_DELETE: 'lead:delete',
  LEAD_ASSIGN: 'lead:assign',

  QUOTE_READ: 'quote:read',
  QUOTE_WRITE: 'quote:write',
  QUOTE_DELETE: 'quote:delete',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

export const WILDCARD = '*';

/** True if the granted list satisfies the required permission. */
export function hasPermission(granted: string[], required: string): boolean {
  return granted.includes(WILDCARD) || granted.includes(required);
}

/**
 * Seeded system roles and the permissions they carry.
 * `slug` is the stable identifier used in JWTs and code.
 */
export const SYSTEM_ROLES: Array<{
  name: string;
  slug: string;
  description: string;
  permissions: string[];
}> = [
  {
    name: 'Super Admin',
    slug: 'super-admin',
    description: 'Full, unrestricted access to everything.',
    permissions: [WILDCARD],
  },
  {
    name: 'Admin',
    slug: 'admin',
    description: 'Manages catalog, CMS content, leads and users.',
    permissions: ALL_PERMISSIONS.filter((p) => p !== PERMISSIONS.ROLE_WRITE),
  },
  {
    name: 'Content Editor',
    slug: 'content-editor',
    description: 'Manages the catalog and website content.',
    permissions: [
      PERMISSIONS.CATEGORY_READ,
      PERMISSIONS.CATEGORY_WRITE,
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.PRODUCT_WRITE,
      PERMISSIONS.TAXONOMY_READ,
      PERMISSIONS.TAXONOMY_WRITE,
      PERMISSIONS.CONTENT_READ,
      PERMISSIONS.CONTENT_WRITE,
      PERMISSIONS.LEAD_READ,
    ],
  },
  {
    name: 'Sales Agent',
    slug: 'sales-agent',
    description: 'Handles leads and quotations (CRM).',
    permissions: [
      PERMISSIONS.LEAD_READ,
      PERMISSIONS.LEAD_WRITE,
      PERMISSIONS.QUOTE_READ,
      PERMISSIONS.QUOTE_WRITE,
      PERMISSIONS.CATEGORY_READ,
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.USER_READ,
    ],
  },
  {
    name: 'Viewer',
    slug: 'viewer',
    description: 'Read-only access across the platform.',
    permissions: ALL_PERMISSIONS.filter((p) => p.endsWith(':read')),
  },
];
