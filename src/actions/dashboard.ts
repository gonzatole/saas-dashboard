"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/dal";

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const user = await requireAuth();
  const companyId = user.companyId;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    workersActive,
    inspectionsThisMonth,
    incidentsThisMonth,
    pendingActions,
    recentIncidents,
    upcomingActions,
    avgScore,
  ] = await Promise.all([
    // Active workers
    prisma.worker.count({ where: { companyId, isActive: true } }),

    // Inspections this month
    prisma.inspection.count({
      where: { companyId, createdAt: { gte: startOfMonth } },
    }),

    // Incidents this month
    prisma.incident.count({
      where: { companyId, createdAt: { gte: startOfMonth } },
    }),

    // Pending/overdue corrective actions
    prisma.correctiveAction.count({
      where: { companyId, status: { in: ["PENDING", "IN_PROGRESS", "OVERDUE"] } },
    }),

    // Last 5 incidents
    prisma.incident.findMany({
      where: { companyId },
      include: {
        area: { select: { name: true } },
        reportedBy: { select: { name: true } },
      },
      orderBy: { occurredAt: "desc" },
      take: 5,
    }),

    // Corrective actions due in next 14 days or overdue (PENDING/IN_PROGRESS)
    prisma.correctiveAction.findMany({
      where: {
        companyId,
        status: { in: ["PENDING", "IN_PROGRESS", "OVERDUE"] },
      },
      include: {
        assignedTo: { select: { name: true } },
        incident: { select: { title: true } },
        inspection: { select: { title: true } },
      },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),

    // Average inspection score (inspections with items, last 30 days)
    prisma.inspectionItem.aggregate({
      where: {
        inspection: {
          companyId,
          createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
        },
        answer: { not: "NA" },
      },
      _count: true,
    }).then(async (total) => {
      if (total._count === 0) return null;
      const ok = await prisma.inspectionItem.count({
        where: {
          inspection: {
            companyId,
            createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
          },
          answer: "OK",
        },
      });
      return Math.round((ok / total._count) * 100);
    }),
  ]);

  return {
    workersActive,
    inspectionsThisMonth,
    incidentsThisMonth,
    pendingActions,
    recentIncidents,
    upcomingActions,
    avgScore,
  };
}

// ─── Analytics: monthly trend (last 6 months) ────────────────────────────────

export async function getAnalyticsData() {
  const user = await requireAuth();
  const companyId = user.companyId;

  const now = new Date();

  // Build last 6 months buckets
  const months: { label: string; start: Date; end: Date }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const label = start.toLocaleDateString("es-CL", { month: "short" });
    months.push({ label, start, end });
  }

  // Parallel queries for each entity type
  const [inspectionsByMonth, incidentsByMonth, actionsByMonth] = await Promise.all([
    Promise.all(
      months.map((m) =>
        prisma.inspection.count({
          where: { companyId, createdAt: { gte: m.start, lte: m.end } },
        })
      )
    ),
    Promise.all(
      months.map((m) =>
        prisma.incident.count({
          where: { companyId, createdAt: { gte: m.start, lte: m.end } },
        })
      )
    ),
    Promise.all(
      months.map((m) =>
        prisma.correctiveAction.count({
          where: { companyId, createdAt: { gte: m.start, lte: m.end } },
        })
      )
    ),
  ]);

  const trend = months.map((m, i) => ({
    month: m.label,
    inspecciones: inspectionsByMonth[i],
    incidentes: incidentsByMonth[i],
    acciones: actionsByMonth[i],
  }));

  // Severity breakdown (all time)
  const severityBreakdown = await prisma.incident.groupBy({
    by: ["severity"],
    where: { companyId },
    _count: { severity: true },
  });

  // Total stats
  const [totalInspections, totalIncidents, totalActions, closedActions] = await Promise.all([
    prisma.inspection.count({ where: { companyId } }),
    prisma.incident.count({ where: { companyId } }),
    prisma.correctiveAction.count({ where: { companyId } }),
    prisma.correctiveAction.count({ where: { companyId, status: "COMPLETED" } }),
  ]);

  return {
    trend,
    severityBreakdown,
    totalInspections,
    totalIncidents,
    totalActions,
    closedActions,
  };
}
