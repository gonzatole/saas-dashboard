import Link from "next/link";
import { Plus, AlertTriangle, ShieldAlert, ShieldCheck, Search } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { IncidentTable } from "@/components/incidents/incident-table";
import { getIncidents } from "@/actions/incidents";

export default async function IncidentesPage() {
  const incidents = await getIncidents();

  const open = incidents.filter((i) => i.status !== "CLOSED").length;
  const serious = incidents.filter(
    (i) => i.severity === "SERIOUS" || i.severity === "FATAL"
  ).length;
  const totalInjured = incidents.reduce((sum, i) => sum + i.injuredCount, 0);
  const totalLostDays = incidents.reduce((sum, i) => sum + i.lostDays, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Incidentes"
        subtitle={`${incidents.length} registrados · ${open} activos`}
        action={
          <Link
            href="/dashboard/incidentes/nuevo"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Reportar incidente
          </Link>
        }
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <p className="text-xs text-muted-foreground">Activos</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">{open}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              <p className="text-xs text-muted-foreground">Graves/Fatales</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{serious}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Personas lesionadas</p>
            <p className="text-2xl font-bold">{totalInjured}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <p className="text-xs text-muted-foreground">Días perdidos</p>
            </div>
            <p className="text-2xl font-bold">{totalLostDays}</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold mb-5">Registro de incidentes</h2>
          <IncidentTable data={incidents} />
        </div>
      </main>
    </div>
  );
}
