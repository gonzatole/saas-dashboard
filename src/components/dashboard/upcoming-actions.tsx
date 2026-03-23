import Link from "next/link";
import { Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ACTION_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ACTION_STATUS_STYLES: Record<string, string> = {
  PENDING: "border-yellow-200 bg-yellow-50 text-yellow-700",
  IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  OVERDUE: "border-red-200 bg-red-50 text-red-700",
};

interface CorrectiveAction {
  id: string;
  title: string;
  status: string;
  dueDate: Date;
  assignedTo: { name: string };
  incident: { title: string } | null;
  inspection: { title: string } | null;
}

interface UpcomingActionsProps {
  actions: CorrectiveAction[];
}

export function UpcomingActions({ actions }: UpcomingActionsProps) {
  if (actions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold mb-4">Acciones correctivas pendientes</h3>
        <p className="text-sm text-muted-foreground text-center py-4">
          No hay acciones pendientes.
        </p>
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Acciones correctivas pendientes</h3>
      </div>
      <div className="space-y-3">
        {actions.map((action) => {
          const isOverdue = new Date(action.dueDate) < now && action.status !== "COMPLETED";
          const origin = action.incident?.title ?? action.inspection?.title;

          return (
            <div
              key={action.id}
              className="flex items-start gap-3 rounded-lg border border-border p-3"
            >
              <AlertCircle
                className={cn(
                  "h-4 w-4 mt-0.5 shrink-0",
                  isOverdue ? "text-red-500" : "text-amber-500"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{action.title}</p>
                {origin && (
                  <p className="text-xs text-muted-foreground truncate">
                    {origin}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge
                    variant="outline"
                    className={`text-xs ${ACTION_STATUS_STYLES[action.status]}`}
                  >
                    {ACTION_STATUS_LABELS[action.status]}
                  </Badge>
                  <span
                    className={cn(
                      "text-xs flex items-center gap-1",
                      isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    {new Date(action.dueDate).toLocaleDateString("es-CL")}
                    {isOverdue && " (Vencida)"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    → {action.assignedTo.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
