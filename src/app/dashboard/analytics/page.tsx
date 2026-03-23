import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnalyticsData } from '@/actions/dashboard';
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts';
import { INCIDENT_SEVERITY_LABELS } from '@/lib/constants';

const SEVERITY_COLORS: Record<string, string> = {
  NEAR_MISS: 'bg-zinc-200 text-zinc-700',
  MINOR: 'bg-yellow-100 text-yellow-800',
  MODERATE: 'bg-orange-100 text-orange-800',
  SERIOUS: 'bg-red-100 text-red-800',
  FATAL: 'bg-red-200 text-red-900',
};

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  const complianceRate =
    data.totalActions > 0
      ? Math.round((data.closedActions / data.totalActions) * 100)
      : null;

  const metricStats = [
    {
      label: 'Inspecciones totales',
      value: data.totalInspections.toString(),
      description: 'Acumuladas',
    },
    {
      label: 'Incidentes totales',
      value: data.totalIncidents.toString(),
      description: 'Acumulados',
    },
    {
      label: 'Acciones cerradas',
      value: data.totalActions > 0
        ? `${data.closedActions}/${data.totalActions}`
        : '—',
      description: complianceRate !== null ? `${complianceRate}% completadas` : 'Sin acciones',
    },
    {
      label: 'Pendientes',
      value: (data.totalActions - data.closedActions).toString(),
      description: 'Acciones correctivas abiertas',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Analytics"
        subtitle="Análisis de riesgos laborales y cumplimiento normativo"
      />

      <main className="flex-1 p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metricStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts — client component */}
        <AnalyticsCharts trend={data.trend} />

        {/* Severity breakdown */}
        {data.severityBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Incidentes por Gravedad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {data.severityBreakdown
                  .sort((a, b) => b._count.severity - a._count.severity)
                  .map((s) => (
                    <div
                      key={s.severity}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${SEVERITY_COLORS[s.severity] ?? 'bg-muted text-foreground'}`}
                    >
                      <span>{INCIDENT_SEVERITY_LABELS[s.severity] ?? s.severity}</span>
                      <span className="font-bold">{s._count.severity}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
