import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useAuth } from '@/auth/useAuth';
import { cn } from '@/lib/utils';
import { NAV } from './nav';

export function DashboardLayout() {
  const { user, logout, can } = useAuth();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <div className="px-2">
        <div className="text-lg font-bold tracking-tight">Kalope Homes</div>
        <div className="text-xs text-muted-foreground">Admin Console</div>
      </div>

      {NAV.map((group) => {
        const items = group.items.filter((i) => !i.permission || can(i.permission));
        if (items.length === 0) return null;
        return (
          <div key={group.title} className="flex flex-col gap-1">
            <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </div>
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-accent hover:text-foreground',
                  )
                }
              >
                <Icon name={item.icon} className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 border-r bg-sidebar">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium leading-tight">{user?.name}</div>
              <div className="text-xs text-muted-foreground leading-tight">{user?.role.name}</div>
            </div>
            <Button variant="outline" size="icon" onClick={logout} title="Sign out">
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
