import { DashboardHeader } from "@/components/layout/dashboard-header";
import { InspectionForm } from "@/components/inspections/inspection-form";
import { getAreas } from "@/actions/areas";
import { getWorkers } from "@/actions/workers";
import { requireAuth } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export default async function NuevaInspeccionPage() {
  const [user, areas, workers] = await Promise.all([
    requireAuth(),
    getAreas(),
    getWorkers({ isActive: true }),
  ]);

  const categories = await prisma.riskCategory.findMany({
    where: {
      OR: [{ companyId: user.companyId }, { isSystem: true }],
    },
    select: { id: true, name: true, color: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Nueva inspección"
        subtitle="Completa los 3 pasos para crear una inspección"
      />

      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6">
          <InspectionForm
            areas={areas.map((a) => ({ id: a.id, name: a.name, riskLevel: a.riskLevel }))}
            categories={categories}
            workers={workers.map((w) => ({ id: w.id, name: w.name, lastName: w.lastName }))}
          />
        </div>
      </main>
    </div>
  );
}
