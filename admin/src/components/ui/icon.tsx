import {
  Building2,
  DoorOpen,
  FileText,
  FolderTree,
  HelpCircle,
  Images,
  Inbox,
  LayoutDashboard,
  type LucideIcon,
  Package,
  Palette,
  Quote,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Package,
  FolderTree,
  DoorOpen,
  Palette,
  Images,
  Building2,
  Quote,
  HelpCircle,
  Settings,
  Inbox,
  FileText,
  Users,
  ShieldCheck,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? Package;
  return <Cmp className={className} />;
}
