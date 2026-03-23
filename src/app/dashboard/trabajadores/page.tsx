import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { WorkerTable } from "@/components/workers/worker-table";
import { getWorkers } from "@/actions/workers";
import { getAreas } from "@/actions/areas";
import { requireAuth } from "@/lib/dal";

export default async function TrabajadoresPage() {
  const [user, workers, areas] = await Promise.all([
    requireAuth(),
    getWorkers(),
    getAreas(),
  ]);

  const activeCount = workers.filter((w) => w.isActive).length;
  const inactiveCount = workers.length - activeCount;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Trabajadores"
        subtitle={`${activeCount} activos · ${inactiveCount} inactivos`}
        action={
          <Link
            href="/dashboard/trabajadores/nuevo"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar trabajador
          </Link>
        }
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Total</p>
            <p className="text-2xl font-bold">{workers.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Activos</p>
            <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Inactivos</p>
            <p className="text-2xl font-bold text-zinc-400">{inactiveCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Áreas</p>
            <p className="text-2xl font-bold text-blue-600">{areas.length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold">Lista de trabajadores</h2>
            <Link
              href="/dashboard/areas"
              className="text-sm text-primary hover:underline"
            >
              Gestionar áreas →
            </Link>
          </div>
          <WorkerTable data={workers} />
        </div>
      </main>
    </div>
  );
}
