import { TrendingUp, TrendingDown, DollarSign, Users, UserPlus, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { kpiStats } from '@/lib/mock-data';

const statConfig = [
  {
    key: 'totalRevenue' as const,
    label: 'Ingresos Totales',
    icon: <DollarSign className="h-4 w-4" />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    key: 'activeUsers' as const,
    label: 'Usuarios Activos',
    icon: <Users className="h-4 w-4" />,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    key: 'newCustomers' as const,
    label: 'Nuevos Clientes',
    icon: <UserPlus className="h-4 w-4" />,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    key: 'conversionRate' as const,
    label: 'Tasa de Conversión',
    icon: <Percent className="h-4 w-4" />,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map((stat) => {
        const data = kpiStats[stat.key];
        const isPositive = data.change >= 0;
        return (
          <Card key={stat.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {isPositive
                  ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  : <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                }
                <span className={`text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isPositive ? '+' : ''}{data.change}%
                </span>
                <span className="text-xs text-muted-foreground">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
