import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { ResourceConfig } from './types';

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

function statusBadge(status: unknown) {
  const s = String(status);
  const variant = s === 'PUBLISHED' ? 'success' : s === 'ARCHIVED' ? 'muted' : 'warning';
  return <Badge variant={variant}>{s}</Badge>;
}

function boolBadge(v: unknown) {
  return v ? <Badge variant="success">Yes</Badge> : <Badge variant="muted">No</Badge>;
}

export const RESOURCES: Record<string, ResourceConfig> = {
  categories: {
    key: 'categories',
    labelSingular: 'Category',
    labelPlural: 'Categories',
    icon: 'FolderTree',
    permission: 'category:read',
    writePermission: 'category:write',
    deletePermission: 'category:delete',
    searchPlaceholder: 'Search categories…',
    filters: [{ key: 'status', label: 'Status', options: STATUS_OPTIONS }],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug', render: (r) => <span className="text-muted-foreground">{String(r.slug)}</span> },
      { key: 'status', label: 'Status', render: (r) => statusBadge(r.status) },
      { key: 'isFeatured', label: 'Featured', render: (r) => boolBadge(r.isFeatured) },
      { key: 'sortOrder', label: 'Order' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, slugFrom: 'name' },
      { name: 'parentId', label: 'Parent category', type: 'relation', optionsResource: 'categories' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'imageUrl', label: 'Image URL', type: 'url' },
      { name: 'iconUrl', label: 'Icon URL', type: 'url' },
      { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, defaultValue: 'DRAFT' },
      { name: 'isFeatured', label: 'Featured on homepage', type: 'checkbox' },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
      { name: 'metaTitle', label: 'Meta title (SEO)', type: 'text' },
      { name: 'metaDescription', label: 'Meta description (SEO)', type: 'textarea' },
    ],
  },

  products: {
    key: 'products',
    labelSingular: 'Product',
    labelPlural: 'Products',
    icon: 'Package',
    permission: 'product:read',
    writePermission: 'product:write',
    deletePermission: 'product:delete',
    searchPlaceholder: 'Search products…',
    filters: [{ key: 'status', label: 'Status', options: STATUS_OPTIONS }],
    columns: [
      { key: 'name', label: 'Name' },
      {
        key: 'category',
        label: 'Category',
        render: (r) => (r.category as { name?: string } | null)?.name ?? '—',
      },
      { key: 'startingPrice', label: 'From', render: (r) => formatCurrency(r.startingPrice as string) },
      { key: 'status', label: 'Status', render: (r) => statusBadge(r.status) },
      { key: 'isFeatured', label: 'Featured', render: (r) => boolBadge(r.isFeatured) },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, slugFrom: 'name' },
      { name: 'categoryId', label: 'Category', type: 'relation', optionsResource: 'categories', required: true },
      { name: 'shortDescription', label: 'Short description', type: 'textarea' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'startingPrice', label: 'Starting price (₹)', type: 'number' },
      { name: 'priceUnit', label: 'Price unit', type: 'text', placeholder: 'onwards / per sq ft' },
      { name: 'roomIds', label: 'Rooms', type: 'relations', optionsResource: 'rooms' },
      { name: 'styleIds', label: 'Styles', type: 'relations', optionsResource: 'styles' },
      { name: 'images', label: 'Image URLs (one per line)', type: 'tags' },
      { name: 'specs', label: 'Specs (JSON)', type: 'json' },
      { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, defaultValue: 'DRAFT' },
      { name: 'isFeatured', label: 'Featured', type: 'checkbox' },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
    ],
  },

  projects: {
    key: 'projects',
    labelSingular: 'Project',
    labelPlural: 'Projects',
    icon: 'Building2',
    permission: 'content:read',
    writePermission: 'content:write',
    deletePermission: 'content:delete',
    searchPlaceholder: 'Search projects…',
    filters: [{ key: 'status', label: 'Status', options: STATUS_OPTIONS }],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'location', label: 'Location' },
      { key: 'configuration', label: 'Config' },
      { key: 'status', label: 'Status', render: (r) => statusBadge(r.status) },
      { key: 'isFeatured', label: 'Featured', render: (r) => boolBadge(r.isFeatured) },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, slugFrom: 'title' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'area', label: 'Area', type: 'text', placeholder: '1450 sq ft' },
      { name: 'configuration', label: 'Configuration', type: 'text', placeholder: '3 BHK' },
      { name: 'categoryId', label: 'Category', type: 'relation', optionsResource: 'categories' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'coverImageUrl', label: 'Cover image URL', type: 'url' },
      { name: 'images', label: 'Gallery image URLs (one per line)', type: 'tags' },
      { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, defaultValue: 'DRAFT' },
      { name: 'isFeatured', label: 'Featured', type: 'checkbox' },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
    ],
  },

  gallery: {
    key: 'gallery',
    labelSingular: 'Image',
    labelPlural: 'Images',
    icon: 'Images',
    permission: 'content:read',
    writePermission: 'content:write',
    deletePermission: 'content:delete',
    searchPlaceholder: 'Search gallery…',
    filters: [{ key: 'status', label: 'Status', options: STATUS_OPTIONS }],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'status', label: 'Status', render: (r) => statusBadge(r.status) },
      { key: 'isFeatured', label: 'Featured', render: (r) => boolBadge(r.isFeatured) },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'images', label: 'Image URLs (one per line)', type: 'tags' },
      { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, defaultValue: 'DRAFT' },
      { name: 'isFeatured', label: 'Featured', type: 'checkbox' },
    ],
  },

  rooms: {
    key: 'rooms',
    labelSingular: 'Room',
    labelPlural: 'Rooms',
    icon: 'DoorOpen',
    permission: 'taxonomy:read',
    writePermission: 'taxonomy:write',
    deletePermission: 'taxonomy:delete',
    searchPlaceholder: 'Search rooms…',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
      { key: 'isActive', label: 'Active', render: (r) => boolBadge(r.isActive) },
      { key: 'sortOrder', label: 'Order' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, slugFrom: 'name' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'imageUrl', label: 'Image URL', type: 'url' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
    ],
  },

  styles: {
    key: 'styles',
    labelSingular: 'Style',
    labelPlural: 'Styles',
    icon: 'Palette',
    permission: 'taxonomy:read',
    writePermission: 'taxonomy:write',
    deletePermission: 'taxonomy:delete',
    searchPlaceholder: 'Search styles…',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
      { key: 'isActive', label: 'Active', render: (r) => boolBadge(r.isActive) },
      { key: 'sortOrder', label: 'Order' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, slugFrom: 'name' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'imageUrl', label: 'Image URL', type: 'url' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
    ],
  },

  'hero-slides': {
    key: 'hero-slides',
    labelSingular: 'Hero slide',
    labelPlural: 'Hero slides',
    icon: 'Images',
    permission: 'content:read',
    writePermission: 'content:write',
    deletePermission: 'content:delete',
    searchPlaceholder: 'Search hero slides…',
    filters: [
      {
        key: 'placement',
        label: 'Placement',
        options: [
          { value: 'HOME_HERO', label: 'Home hero' },
          { value: 'HOME_PROMO', label: 'Home promo' },
          { value: 'CATEGORY_HEADER', label: 'Category header' },
        ],
      },
    ],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'placement', label: 'Placement', render: (r) => <Badge variant="secondary">{String(r.placement)}</Badge> },
      { key: 'isActive', label: 'Active', render: (r) => boolBadge(r.isActive) },
      { key: 'sortOrder', label: 'Order' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'imageUrl', label: 'Image URL', type: 'url', required: true },
      { name: 'mobileImageUrl', label: 'Mobile image URL', type: 'url' },
      { name: 'ctaText', label: 'Button text', type: 'text' },
      { name: 'ctaLink', label: 'Button link', type: 'text' },
      {
        name: 'placement',
        label: 'Placement',
        type: 'select',
        defaultValue: 'HOME_HERO',
        options: [
          { value: 'HOME_HERO', label: 'Home hero' },
          { value: 'HOME_PROMO', label: 'Home promo' },
          { value: 'CATEGORY_HEADER', label: 'Category header' },
        ],
      },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
    ],
  },

  testimonials: {
    key: 'testimonials',
    labelSingular: 'Testimonial',
    labelPlural: 'Testimonials',
    icon: 'Quote',
    permission: 'content:read',
    writePermission: 'content:write',
    deletePermission: 'content:delete',
    searchPlaceholder: 'Search testimonials…',
    columns: [
      { key: 'authorName', label: 'Author' },
      { key: 'authorLocation', label: 'Location' },
      { key: 'rating', label: 'Rating', render: (r) => (r.rating ? `${r.rating}★` : '—') },
      { key: 'isActive', label: 'Active', render: (r) => boolBadge(r.isActive) },
    ],
    fields: [
      { name: 'authorName', label: 'Author name', type: 'text', required: true },
      { name: 'authorLocation', label: 'Location', type: 'text' },
      { name: 'authorAvatarUrl', label: 'Avatar URL', type: 'url' },
      { name: 'rating', label: 'Rating (1-5)', type: 'number' },
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
      { name: 'imageUrl', label: 'Project image URL', type: 'url' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
    ],
  },

  faqs: {
    key: 'faqs',
    labelSingular: 'FAQ',
    labelPlural: 'FAQs',
    icon: 'HelpCircle',
    permission: 'content:read',
    writePermission: 'content:write',
    deletePermission: 'content:delete',
    searchPlaceholder: 'Search FAQs…',
    columns: [
      { key: 'question', label: 'Question' },
      { key: 'category', label: 'Group' },
      { key: 'isActive', label: 'Active', render: (r) => boolBadge(r.isActive) },
      { key: 'sortOrder', label: 'Order' },
    ],
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true },
      { name: 'category', label: 'Group', type: 'text', placeholder: 'Pricing, Process…' },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
    ],
  },

  users: {
    key: 'users',
    labelSingular: 'User',
    labelPlural: 'Users',
    icon: 'Users',
    permission: 'user:read',
    writePermission: 'user:write',
    deletePermission: 'user:delete',
    searchPlaceholder: 'Search users…',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role', render: (r) => (r.role as { name?: string } | null)?.name ?? '—' },
      { key: 'isActive', label: 'Active', render: (r) => boolBadge(r.isActive) },
      { key: 'lastLoginAt', label: 'Last login', render: (r) => formatDate(r.lastLoginAt as string) },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'password', label: 'Password', type: 'text', help: 'Min 8 chars. Leave blank when editing to keep current.' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'roleId', label: 'Role', type: 'relation', optionsResource: 'roles', required: true },
      { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
    ],
  },
};

export const RESOURCE_LIST = Object.values(RESOURCES);
