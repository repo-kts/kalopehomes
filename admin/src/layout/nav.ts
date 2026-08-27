export interface NavItem {
  label: string;
  to: string;
  icon: string; // lucide icon name
  permission?: string; // hide if the user lacks it
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', to: '/', icon: 'LayoutDashboard' }],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Products', to: '/products', icon: 'Package', permission: 'product:read' },
      { label: 'Categories', to: '/categories', icon: 'FolderTree', permission: 'category:read' },
      { label: 'Rooms', to: '/rooms', icon: 'DoorOpen', permission: 'taxonomy:read' },
      { label: 'Styles', to: '/styles', icon: 'Palette', permission: 'taxonomy:read' },
    ],
  },
  {
    title: 'Website',
    items: [
      { label: 'Hero Slides', to: '/hero-slides', icon: 'Images', permission: 'content:read' },
      { label: 'Projects', to: '/projects', icon: 'Building2', permission: 'content:read' },
      { label: 'Testimonials', to: '/testimonials', icon: 'Quote', permission: 'content:read' },
      { label: 'FAQs', to: '/faqs', icon: 'HelpCircle', permission: 'content:read' },
      { label: 'Settings', to: '/settings', icon: 'Settings', permission: 'content:read' },
    ],
  },
  {
    title: 'CRM',
    items: [
      { label: 'Leads', to: '/leads', icon: 'Inbox', permission: 'lead:read' },
      { label: 'Quotes', to: '/quotes', icon: 'FileText', permission: 'quote:read' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Users', to: '/users', icon: 'Users', permission: 'user:read' },
      { label: 'Roles', to: '/roles', icon: 'ShieldCheck', permission: 'role:read' },
    ],
  },
];
