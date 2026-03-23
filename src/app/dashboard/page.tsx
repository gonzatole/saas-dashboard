import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentIncidents } from '@/components/dashboard/recent-incidents';
import { UpcomingActions } from '@/components/dashboard/upcoming-actions';
import { getDashboardStats } from '@/actions/dashboard';
import { ClipboardList, AlertTriangle, HardHat, Bot } from 'lucide-react';

const quickActions = [
  { label: 'Nueva Inspección', href: '/dashboard/inspecciones/nueva', icon: <ClipboardList className="h-4 w-4" />, color: 'text-emerald-500' },
  { label: 'Reportar Incidente', href: '/dashboard/incidentes/nuevo', icon: <AlertTriangle className="h-4 w-4" />, color: 'text-red-500' },
  { label: 'Agregar Trabajador', href: '/dashboard/trabajadores', icon: <HardHat className="h-4 w-4" />, color: 'text-blue-500' },
  { label: 'Asistente IA', href: '/dashboard/ai', icon: <Bot className="h-4 w-4" />, color: 'text-violet-500' },
];

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const hasData =
    stats.workersActive > 0 ||
    stats.inspectionsThisMonth > 0 ||
    stats.incidentsThisMonth > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Dashboard"
        subtitle="Panel de Prevención de Riesgos"
      />

      <main className="flex-1 p-6 space-y-6">
        {/* KPI Cards */}
        <StatsCards
          workersActive={stats.workersActive}
          inspectionsThisMonth={stats.inspectionsThisMonth}
          incidentsThisMonth={stats.incidentsThisMonth}
          pendingActions={stats.pendingActions}
        />

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-base font-semibold mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span className={action.color}>{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {hasData ? (
          /* Real data widgets */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentIncidents incidents={stats.recentIncidents} />
            <UpcomingActions actions={stats.upcomingActions} />
          </div>
        ) : (
          /* Welcome card — shown until first data is entered */
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Bienvenido a RiskGuard AI</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Comienza configurando tu empresa: agrega trabajadores, define áreas de trabajo
              y realiza tu primera inspección de seguridad.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard/trabajadores"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <HardHat className="h-4 w-4" />
                Agregar primer trabajador
              </Link>
              <Link
                href="/dashboard/inspecciones/nueva"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                <ClipboardList className="h-4 w-4" />
                Primera inspección
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
