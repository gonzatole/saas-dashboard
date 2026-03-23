// RiskGuard AI — Mock data para desarrollo (reemplazar con datos reales desde DB)

import type { RiskTrendData, DashboardStat } from "@/types";

export const riskTrendData: RiskTrendData[] = [
  { month: "Oct", inspecciones: 8, incidentes: 2, acciones: 5 },
  { month: "Nov", inspecciones: 12, incidentes: 1, acciones: 7 },
  { month: "Dic", inspecciones: 6, incidentes: 3, acciones: 9 },
  { month: "Ene", inspecciones: 14, incidentes: 2, acciones: 6 },
  { month: "Feb", inspecciones: 11, incidentes: 0, acciones: 4 },
  { month: "Mar", inspecciones: 15, incidentes: 1, acciones: 8 },
];

export const dashboardStats: DashboardStat[] = [
  { label: "Trabajadores activos", value: 0, icon: "hardhat" },
  { label: "Inspecciones este mes", value: 0, icon: "clipboard" },
  { label: "Incidentes este mes", value: 0, icon: "alert", color: "red" },
  { label: "Acciones pendientes", value: 0, icon: "check", color: "amber" },
];
