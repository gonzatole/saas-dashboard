'use client';

import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendItem {
  month: string;
  inspecciones: number;
  incidentes: number;
  acciones: number;
}

interface AnalyticsChartsProps {
  trend: TrendItem[];
}

export function AnalyticsCharts({ trend }: AnalyticsChartsProps) {
  const hasData = trend.some(
    (t) => t.inspecciones > 0 || t.incidentes > 0 || t.acciones > 0
  );

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tendencia de Actividad — Últimos 6 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Sin datos registrados aún. Los gráficos aparecerán una vez que registres inspecciones e incidentes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tendencia de Actividad — Últimos 6 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="inspecciones" name="Inspecciones" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="incidentes" name="Incidentes" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="acciones" name="Acciones correctivas" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evolución de Incidentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="incidentes" name="Incidentes" stroke="#ef4444" strokeWidth={2} dot />
              <Line type="monotone" dataKey="inspecciones" name="Inspecciones" stroke="#3b82f6" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
