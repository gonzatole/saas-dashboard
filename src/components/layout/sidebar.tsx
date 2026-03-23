'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BarChart3, Users, Settings, CreditCard,
  ShieldCheck, ChevronRight, ClipboardList, AlertTriangle,
  FileText, Bot, HardHat, LogOut, MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navSections = [
  {
    title: 'Principal',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Gestión de Riesgos',
    items: [
      { label: 'Trabajadores', href: '/dashboard/trabajadores', icon: <HardHat className="h-4 w-4" /> },
      { label: 'Áreas', href: '/dashboard/areas', icon: <MapPin className="h-4 w-4" /> },
      { label: 'Inspecciones', href: '/dashboard/inspecciones', icon: <ClipboardList className="h-4 w-4" /> },
      { label: 'Incidentes', href: '/dashboard/incidentes', icon: <AlertTriangle className="h-4 w-4" /> },
      { label: 'Documentos', href: '/dashboard/documentos', icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Inteligencia Artificial',
    items: [
      { label: 'Asistente IA', href: '/dashboard/ai', icon: <Bot className="h-4 w-4" />, badge: 'Pro' },
      { label: 'Reportes IA', href: '/dashboard/ai/reportes', icon: <FileText className="h-4 w-4" />, badge: 'Pro' },
    ],
  },
  {
    title: 'Cuenta',
    items: [
      { label: 'Usuarios', href: '/dashboard/usuarios', icon: <Users className="h-4 w-4" /> },
      { label: 'Configuración', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
      { label: 'Facturación', href: '/dashboard/facturacion', icon: <CreditCard className="h-4 w-4" /> },
    ],
  },
];

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      )}
    >
      {item.icon}
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <Badge className="h-5 px-1.5 text-xs bg-blue-500 text-white border-0">
          {item.badge}
        </Badge>
      )}
    </Link>
  );
}

export function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-base font-bold leading-tight block">RiskGuard</span>
            <span className="text-[10px] font-medium text-primary leading-tight block -mt-0.5">AI</span>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade banner */}
      <div className="p-3 border-t border-border">
        <div className="rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 p-3 border border-primary/20">
          <p className="text-xs font-semibold mb-1">Upgrade a Pro</p>
          <p className="text-xs text-muted-foreground mb-2">IA ilimitada, reportes PDF y trabajadores sin límite.</p>
          <Link
            href="/dashboard/facturacion"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Ver planes <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-3 mt-3 px-1">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">R</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Mi Empresa</p>
            <p className="text-xs text-muted-foreground truncate">Plan Gratuito</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
