import Link from "next/link";
import { Plus, ClipboardList, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { InspectionTable } from "@/components/inspections/inspection-table";
import { getInspections } from "@/actions/inspections";

export default async function InspeccionesPage() {
  const inspections = await getInspections();

  const byStatus = {
    DRAFT: inspections.filter((i) => i.status === "DRAFT").length,
    IN_PROGRESS: inspections.filter((i) => i.status === "IN_PROGRESS").length,
    COMPLETED: inspections.filter((i) => i.status === "COMPLETED").length,
    REVIEWED: inspections.filter((i) => i.status === "REVIEWED").length,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Inspecciones"
        subtitle={`${inspections.length} total`}
        action={
          <Link
            href="/dashboard/inspecciones/nueva"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva inspección
          </Link>
        }
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Borradores</p>
            </div>
            <p className="text-2xl font-bold text-zinc-500">{byStatus.DRAFT}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <p className="text-xs text-muted-foreground">En progreso</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{byStatus.IN_PROGRESS}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <p className="text-xs text-muted-foreground">Completadas</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{byStatus.COMPLETED}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-violet-500" />
              <p className="text-xs text-muted-foreground">Revisadas</p>
            </div>
            <p className="text-2xl font-bold text-violet-600">{byStatus.REVIEWED}</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold mb-5">Historial de inspecciones</h2>
          <InspectionTable data={inspections} />
        </div>
      </main>
    </div>
  );
}
