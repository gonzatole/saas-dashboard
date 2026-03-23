'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Input } from '@/components/ui/input';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  action?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, onMenuClick, action }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4">
      {/* Mobile menu toggle */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Optional action (e.g. primary button) */}
      {action && <div className="hidden sm:block">{action}</div>}

      {/* Search */}
      <div className="hidden sm:flex relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar..." className="pl-9 h-9" />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-1">
        {/* Notificaciones */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <ThemeToggle />

        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center ml-1">
          <span className="text-xs font-bold text-white">G</span>
        </div>
      </div>
    </header>
  );
}
