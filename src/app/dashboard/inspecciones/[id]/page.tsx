import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ClipboardList, MapPin, Calendar, User,
  CheckCircle2, XCircle, MinusCircle, AlertTriangle,
} from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { getInspectionById } from "@/actions/inspections";
import {
  INSPECTION_STATUS_LABELS, RISK_LEVEL_LABELS, RISK_LEVEL_COLORS,
  ACTION_STATUS_LABELS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "border-zinc-200 bg-zinc-50 text-zinc-600",
  IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REVIEWED: "border-violet-200 bg-violet-50 text-violet-700",
};

const ANSWER_ICONS: Record<string, React.ReactNode> = {
  OK: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  NO_OK: <XCircle className="h-4 w-4 text-red-500" />,
  NA: <MinusCircle className="h-4 w-4 text-zinc-400" />,
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

export default async function InspectionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const inspection = await getInspectionById(id);
  if (!inspection) notFound();

  const okCount = inspection.items.filter((i) => i.answer === "OK").length;
  const noOkCount = inspection.items.filter((i) => i.answer === "NO_OK").length;
  const naCount = inspection.items.filter((i) => i.answer === "NA").length;
  const score =
    inspection.items.length > 0
      ? Math.round((okCount / (okCount + noOkCount || 1)) * 100)
      : null;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title={inspection.title}
        subtitle={`Inspección · ${INSPECTION_STATUS_LABELS[inspection.status]}`}
      />

      <main className="flex-1 p-6 space-y-6">
        <Link
          href="/dashboard/inspecciones"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a inspecciones
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar info */}
          <div className="space-y-4">
            {/* Status card */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-semibold">Información</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Estado</span>
                  <Badge variant="outline" className={STATUS_STYLES[inspection.status]}>
                    {INSPECTION_STATUS_LABELS[inspection.status]}
                  </Badge>
                </div>
                {inspection.area && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Área</span>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
                      RISK_LEVEL_COLORS[inspection.area.riskLevel]
                    )}>
                      {inspection.area.name}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  Inspector: {inspection.inspector.name}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {inspection.scheduledDate
                    ? new Date(inspection.scheduledDate).toLocaleDateString("es-CL")
                    : new Date(inspection.createdAt).toLocaleDateString("es-CL")}
                </div>
              </div>
            </div>

            {/* Score */}
            {score !== null && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold mb-3">Resultado</h3>
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold border-4",
                      score >= 80
                        ? "border-emerald-400 text-emerald-600"
                        : score >= 60
                        ? "border-yellow-400 text-yellow-600"
                        : "border-red-400 text-red-600"
                    )}
                  >
                    {score}%
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-emerald-600">✓ {okCount} OK</p>
                    <p className="text-red-600">✗ {noOkCount} No cumple</p>
                    <p className="text-zinc-400">— {naCount} N/A</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main: items + actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold mb-4">
                Ítems de verificación ({inspection.items.length})
              </h3>
              {inspection.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin ítems.</p>
              ) : (
                <div className="space-y-2">
                  {inspection.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-lg border border-border p-3"
                    >
                      <span className="text-xs font-bold text-muted-foreground mt-0.5 w-5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.question}</p>
                        {item.observation && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.observation}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          {item.riskLevel && (
                            <span className={cn(
                              "inline-flex items-center rounded-full px-1.5 py-0.5 text-xs border",
                              RISK_LEVEL_COLORS[item.riskLevel]
                            )}>
                              {RISK_LEVEL_LABELS[item.riskLevel]}
                            </span>
                          )}
                          {item.category && (
                            <span className="text-xs text-muted-foreground">
                              {item.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 mt-0.5">
                        {item.answer ? ANSWER_ICONS[item.answer] : (
                          <MinusCircle className="h-4 w-4 text-zinc-300" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Corrective Actions */}
            {inspection.correctiveActions.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold mb-4">
                  Acciones correctivas ({inspection.correctiveActions.length})
                </h3>
                <div className="space-y-2">
                  {inspection.correctiveActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-start gap-3 rounded-lg border border-border p-3"
                    >
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={ACTION_STATUS_STYLES[action.status]}
                          >
                            {ACTION_STATUS_LABELS[action.status]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Vence: {new Date(action.dueDate).toLocaleDateString("es-CL")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            → {action.assignedTo.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
