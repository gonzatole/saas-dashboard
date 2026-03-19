import { DashboardHeader } from '@/components/layout/dashboard-header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { RecentCustomers } from '@/components/dashboard/recent-customers';
import { TopProducts } from '@/components/dashboard/top-products';

// Página Overview: vista general del negocio con KPIs, gráficos y tablas
export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Overview"
        subtitle="Bienvenido de vuelta, Gonzalo"
      />

      <main className="flex-1 p-6 space-y-6">
        {/* KPI Cards */}
        <StatsCards />

        {/* Gráficos y clientes recientes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart ocupa 2/3 del ancho */}
          <RevenueChart />
          {/* Recent Customers ocupa 1/3 */}
          <RecentCustomers />
        </div>

        {/* Top productos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProducts />

          {/* Quick Actions */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-base font-semibold mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '+ Agregar Producto', href: '/dashboard/products' },
                { label: '+ Invitar Cliente', href: '/dashboard/customers' },
                { label: '📊 Ver Analytics', href: '/dashboard/analytics' },
                { label: '💳 Gestionar Plan', href: '/dashboard/billing' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-center rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors text-center"
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
