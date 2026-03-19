import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { customers } from '@/lib/mock-data';

const planColors = {
  free: 'bg-muted text-muted-foreground',
  pro: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  enterprise: 'bg-violet-500/10 text-violet-600 border-violet-500/30',
};

const avatarColors = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
];

export function RecentCustomers() {
  // Mostrar sólo los últimos 5
  const recent = customers.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Clientes Recientes</CardTitle>
        <p className="text-xs text-muted-foreground">Los últimos 5 registros</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {recent.map((customer, i) => (
          <div key={customer.id} className="flex items-center gap-3">
            {/* Avatar */}
            <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center shrink-0`}>
              <span className="text-xs font-bold text-white">{customer.avatar}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{customer.name}</p>
              <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
            </div>

            {/* Plan + Revenue */}
            <div className="text-right shrink-0">
              <Badge variant="outline" className={`text-xs mb-1 ${planColors[customer.plan]}`}>
                {customer.plan}
              </Badge>
              <p className="text-xs font-medium">
                ${customer.revenue.toLocaleString('es-CL')}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
