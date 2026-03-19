'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, MoreHorizontal, Users, UserCheck, UserX } from 'lucide-react';
import { customers } from '@/lib/mock-data';
import type { Customer } from '@/types';

const planColors: Record<Customer['plan'], string> = {
  free: 'bg-muted text-muted-foreground',
  pro: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  enterprise: 'bg-violet-500/10 text-violet-600 border-violet-500/30',
};

const statusColors: Record<Customer['status'], string> = {
  active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  trial: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  churned: 'bg-red-500/10 text-red-600 border-red-500/30',
};

const avatarColors = [
  'from-blue-500 to-indigo-600', 'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
];

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  // Summary stats
  const stats = [
    { label: 'Total', value: customers.length, icon: <Users className="h-4 w-4" />, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Activos', value: customers.filter((c) => c.status === 'active').length, icon: <UserCheck className="h-4 w-4" />, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Churn', value: customers.filter((c) => c.status === 'churned').length, icon: <UserX className="h-4 w-4" />, color: 'text-red-500 bg-red-500/10' },
    { label: 'Trial', value: customers.filter((c) => c.status === 'trial').length, icon: <Users className="h-4 w-4" />, color: 'text-amber-500 bg-amber-500/10' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Clientes" subtitle={`${customers.length} clientes registrados`} />

      <main className="flex-1 p-6 space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 pt-5">
                <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex gap-3 items-center justify-between">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invitar Cliente
          </Button>
        </div>

        {/* Tabla */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{filtered.length} clientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Plan</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Ingreso</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Desde</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((customer, i) => (
                    <tr key={customer.id} className="border-b border-border hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center shrink-0`}>
                            <span className="text-xs font-bold text-white">{customer.avatar}</span>
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <Badge variant="outline" className={`text-xs ${planColors[customer.plan]}`}>
                          {customer.plan}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`text-xs ${statusColors[customer.status]}`}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right hidden md:table-cell font-medium">
                        ${customer.revenue.toLocaleString('es-CL')}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-muted-foreground text-xs">
                        {customer.joinDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
