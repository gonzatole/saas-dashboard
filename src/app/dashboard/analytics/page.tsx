'use client';

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { visitorData, trafficSources, revenueData } from '@/lib/mock-data';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'];

const metricStats = [
  { label: 'Pageviews', value: '142,837', change: '+18.2%' },
  { label: 'Sesiones', value: '64,291', change: '+12.7%' },
  { label: 'Tasa de Rebote', value: '38.4%', change: '-3.1%' },
  { label: 'Duración Media', value: '2m 43s', change: '+8.5%' },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Analytics" subtitle="Análisis detallado de tráfico y conversiones" />

      <main className="flex-1 p-6 space-y-6">
        {/* Métricas clave */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metricStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-emerald-500 mt-1">{stat.change} este mes</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráfico de visitantes (BarChart) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visitantes Diarios — Marzo 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={visitorData.slice(0, 15)} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="visitors" name="Visitantes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pageViews" name="Pageviews" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Row: Ingresos mensuales + Traffic Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Line chart de ingresos */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">Tendencia de Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => typeof v === 'number' ? `$${v.toLocaleString('es-CL')}` : v} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Ingresos" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="profit" name="Utilidad" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie chart de fuentes de tráfico */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Fuentes de Tráfico</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {trafficSources.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => typeof v === 'number' ? v.toLocaleString('es-CL') : v} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
