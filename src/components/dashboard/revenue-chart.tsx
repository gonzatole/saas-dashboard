'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { revenueData } from '@/lib/mock-data';

// Formateador de moneda para el tooltip — acepta ValueType de Recharts
const formatCurrency = (value: number | string | undefined) =>
  typeof value === 'number' ? `$${value.toLocaleString('es-CL')}` : String(value ?? '');

export function RevenueChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Ingresos vs Gastos vs Utilidad</CardTitle>
        <p className="text-xs text-muted-foreground">Últimos 12 meses</p>
      </CardHeader>
      <CardContent>
        {/* ResponsiveContainer hace el gráfico adaptable al ancho del contenedor */}
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `$${Number(v).toLocaleString('es-CL')}`} />
            <Legend />
            <Area type="monotone" dataKey="revenue" name="Ingresos" stroke="#3b82f6" fill="url(#colorRevenue)" strokeWidth={2} />
            <Area type="monotone" dataKey="expenses" name="Gastos" stroke="#f43f5e" fill="url(#colorExpenses)" strokeWidth={2} />
            <Area type="monotone" dataKey="profit" name="Utilidad" stroke="#10b981" fill="url(#colorProfit)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
