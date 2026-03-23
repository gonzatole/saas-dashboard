import { HardHat, ClipboardList, AlertTriangle, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardsProps {
  workersActive: number;
  inspectionsThisMonth: number;
  incidentsThisMonth: number;
  pendingActions: number;
}

export function StatsCards({
  workersActive,
  inspectionsThisMonth,
  incidentsThisMonth,
  pendingActions,
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Trabajadores Activos',
      value: workersActive,
      icon: <HardHat className="h-4 w-4" />,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      description: 'Registrados en el sistema',
    },
    {
      label: 'Inspecciones (mes)',
      value: inspectionsThisMonth,
      icon: <ClipboardList className="h-4 w-4" />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      description: 'Realizadas este mes',
    },
    {
      label: 'Incidentes (mes)',
      value: incidentsThisMonth,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      description: 'Reportados este mes',
    },
    {
      label: 'Acciones Pendientes',
      value: pendingActions,
      icon: <CheckSquare className="h-4 w-4" />,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      description: 'Acciones correctivas abiertas',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
