import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, AlertTriangle, MapPin, Calendar, User,
  HardHat, Clock,
} from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { getIncidentById } from "@/actions/incidents";
import {
  INCIDENT_SEVERITY_LABELS, ACTION_STATUS_LABELS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES: Record<string, string> = {
  NEAR_MISS: "border-zinc-200 bg-zinc-50 text-zinc-600",
  MINOR: "border-yellow-200 bg-yellow-50 text-yellow-700",
  MODERATE: "border-orange-200 bg-orange-50 text-orange-700",
  SERIOUS: "border-red-200 bg-red-50 text-red-700",
  FATAL: "border-red-400 bg-red-100 text-red-900",
};

const STATUS_LABELS: Record<string, string> = {
  REPORTED: "Reportado",
  INVESTIGATING: "Investigando",
  ACTION_PENDING: "Acción pendiente",
  CLOSED: "Cerrado",
};

const STATUS_STYLES: Record<string, string> = {
  REPORTED: "border-blue-200 bg-blue-50 text-blue-700",
  INVESTIGATING: "border-amber-200 bg-amber-50 text-amber-700",
  ACTION_PENDING: "border-orange-200 bg-orange-50 text-orange-700",
  CLOSED: "border-zinc-200 bg-zinc-50 text-zinc-500",
};

const ACTION_STATUS_STYLES: Record<string, string> = {
  PENDING: "border-yellow-200 bg-yellow-50 text-yellow-700",
  IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  OVERDUE: "border-red-200 bg-red-50 text-red-700",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function IncidentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const incident = await getIncidentById(id);
  if (!incident) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title={incident.title}
        subtitle={`${INCIDENT_SEVERITY_LABELS[incident.severity]} · ${STATUS_LABELS[incident.status]}`}
      />

      <main className="flex-1 p-6 space-y-6">
        <Link
          href="/dashboard/incidentes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a incidentes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-semibold">Clasificación</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Gravedad</span>
                  <Badge variant="outline" className={SEVERITY_STYLES[incident.severity]}>
                    {INCIDENT_SEVERITY_LABELS[incident.severity]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Estado</span>
                  <Badge variant="outline" className={STATUS_STYLES[incident.status]}>
                    {STATUS_LABELS[incident.status]}
                  </Badge>
                </div>
                {incident.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Categoría</span>
                    <span className="text-xs font-medium">{incident.category.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <h3 className="text-sm font-semibold mb-1">Detalles</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(incident.occurredAt).toLocaleString("es-CL")}
              </div>
              {incident.area && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {incident.area.name}
                </div>
              )}
              {incident.location && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {incident.location}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Reportado por: {incident.reportedBy.name}
              </div>
            </div>

            {(incident.injuredCount > 0 || incident.lostDays > 0) && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-2">
                <h3 className="text-sm font-semibold text-red-700">Impacto</h3>
                {incident.injuredCount > 0 && (
                  <p className="text-sm text-red-700">
                    <strong>{incident.injuredCount}</strong> persona(s) lesionada(s)
                  </p>
                )}
                {incident.lostDays > 0 && (
                  <p className="text-sm text-red-700">
                    <strong>{incident.lostDays}</strong> día(s) de trabajo perdido(s)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Description */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold mb-3">Descripción</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {incident.description}
              </p>
            </div>

            {/* Workers */}
            {incident.workers.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold mb-3">
                  Trabajadores involucrados ({incident.workers.length})
                </h3>
                <div className="space-y-2">
                  {incident.workers.map((w) => (
                    <div key={w.id} className="flex items-center gap-2 text-sm">
                      <HardHat className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{w.name} {w.lastName}</span>
                      <span className="text-muted-foreground">— {w.position}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Corrective Actions */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">
                  Acciones correctivas ({incident.correctiveActions.length})
                </h3>
              </div>
              {incident.correctiveActions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay acciones correctivas registradas.
                </p>
              ) : (
                <div className="space-y-2">
                  {incident.correctiveActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-start gap-3 rounded-lg border border-border p-3"
                    >
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge
                            variant="outline"
                            className={ACTION_STATUS_STYLES[action.status]}
                          >
                            {ACTION_STATUS_LABELS[action.status]}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(action.dueDate).toLocaleDateString("es-CL")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            → {action.assignedTo.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
