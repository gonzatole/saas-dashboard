'use client';

import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { riskTrendData } from '@/lib/mock-data';

const metricStats = [
  { label: 'Inspecciones totales', value: '0', description: 'Acumuladas' },
  { label: 'Incidentes totales', value: '0', description: 'Acumulados' },
  { label: 'Tasa de cumplimiento', value: '—', description: 'Score promedio IA' },
  { label: 'Acciones cerradas', value: '0', description: 'Del total abiertas' },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Analytics" subtitle="Análisis de riesgos laborales y cumplimiento normativo" />

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

        {/* Tendencia de riesgos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tendencia de Actividad — Últimos 6 meses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={riskTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="inspecciones" name="Inspecciones" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incidentes" name="Incidentes" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="acciones" name="Acciones correctivas" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Línea de incidentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolución de Incidentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={riskTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="incidentes" name="Incidentes" stroke="#ef4444" strokeWidth={2} dot />
                <Line type="monotone" dataKey="inspecciones" name="Inspecciones" stroke="#3b82f6" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
