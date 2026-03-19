import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, CreditCard, Download } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mes',
    features: ['5 productos', '100 clientes', '1 usuario', 'Analytics básico'],
    current: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mes',
    features: ['50 productos', '1,000 clientes', '5 usuarios', 'Analytics avanzado', 'Soporte prioritario'],
    current: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/mes',
    features: ['Productos ilimitados', 'Clientes ilimitados', 'Usuarios ilimitados', 'Analytics avanzado', 'Soporte dedicado', 'SLA garantizado'],
    current: false,
  },
];

const invoices = [
  { date: '19 Feb 2026', amount: '$49.00', status: 'Pagado', id: 'INV-2026-011' },
  { date: '19 Ene 2026', amount: '$49.00', status: 'Pagado', id: 'INV-2026-010' },
  { date: '19 Dic 2025', amount: '$49.00', status: 'Pagado', id: 'INV-2025-012' },
  { date: '19 Nov 2025', amount: '$49.00', status: 'Pagado', id: 'INV-2025-011' },
  { date: '19 Oct 2025', amount: '$49.00', status: 'Pagado', id: 'INV-2025-010' },
];

const usageMetrics = [
  { label: 'Productos', used: 32, total: 50 },
  { label: 'Clientes', used: 847, total: 1000 },
  { label: 'Usuarios del equipo', used: 3, total: 5 },
  { label: 'Almacenamiento (GB)', used: 8.4, total: 20 },
];

export default function BillingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Facturación" subtitle="Gestiona tu plan y métodos de pago" />

      <main className="flex-1 p-6 space-y-6">
        {/* Plan actual */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Plan Actual</CardTitle>
              <Badge className="bg-blue-500 text-white border-0">Pro</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black">$49</span>
              <span className="text-muted-foreground mb-1">/mes · próximo cobro: 19 Abr 2026</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Cancelar suscripción</Button>
              <Button>Upgrade a Enterprise</Button>
            </div>
          </CardContent>
        </Card>

        {/* Uso actual */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Uso del Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {usageMetrics.map((metric) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>{metric.label}</span>
                  <span className="text-muted-foreground">
                    {metric.used} / {metric.total}
                  </span>
                </div>
                <Progress value={(metric.used / metric.total) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Comparativa de planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.current ? 'border-primary ring-1 ring-primary' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  {plan.current && <Badge variant="outline" className="border-primary text-primary text-xs">Actual</Badge>}
                </div>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-2xl font-black">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.current ? 'outline' : 'default'} className="w-full" disabled={plan.current}>
                  {plan.current ? 'Plan actual' : `Cambiar a ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Método de pago */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Método de Pago</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Visa · Vence 12/28</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Actualizar</Button>
          </CardContent>
        </Card>

        {/* Historial de facturas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial de Facturas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Fecha</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">ID</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Monto</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Estado</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-3">{invoice.date}</td>
                    <td className="px-6 py-3 text-muted-foreground font-mono text-xs">{invoice.id}</td>
                    <td className="px-6 py-3 text-right font-medium">{invoice.amount}</td>
                    <td className="px-6 py-3 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 border text-xs">
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
