import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { INCIDENT_SEVERITY_LABELS } from "@/lib/constants";

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

interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  occurredAt: Date;
  area: { name: string } | null;
  reportedBy: { name: string };
}

interface RecentIncidentsProps {
  incidents: Incident[];
}

export function RecentIncidents({ incidents }: RecentIncidentsProps) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold mb-4">Incidentes recientes</h3>
        <p className="text-sm text-muted-foreground text-center py-4">
          No hay incidentes registrados.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Incidentes recientes</h3>
        <Link
          href="/dashboard/incidentes"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver todos →
        </Link>
      </div>
      <div className="space-y-3">
        {incidents.map((incident) => (
          <Link
            key={incident.id}
            href={`/dashboard/incidentes/${incident.id}`}
            className="flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
          >
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{incident.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-xs ${SEVERITY_STYLES[incident.severity]}`}
                >
                  {INCIDENT_SEVERITY_LABELS[incident.severity]}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {STATUS_LABELS[incident.status]}
                </span>
                {incident.area && (
                  <span className="text-xs text-muted-foreground">
                    · {incident.area.name}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {new Date(incident.occurredAt).toLocaleDateString("es-CL")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
