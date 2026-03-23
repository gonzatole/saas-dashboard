import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, HardHat, Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { WorkerForm } from "@/components/workers/worker-form";
import { getWorkerById } from "@/actions/workers";
import { getAreas } from "@/actions/areas";
import { RISK_LEVEL_LABELS, RISK_LEVEL_COLORS, TIPOS_CONTRATO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [worker, areas] = await Promise.all([getWorkerById(id), getAreas()]);

  if (!worker) notFound();

  const contractLabel = TIPOS_CONTRATO.find((t) => t.value === worker.contractType)?.label;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title={`${worker.name} ${worker.lastName}`}
        subtitle={worker.position}
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Back link */}
        <Link
          href="/dashboard/trabajadores"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a trabajadores
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Info card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mb-4">
                <HardHat className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-lg font-semibold">{worker.name} {worker.lastName}</h2>
              <p className="text-sm text-muted-foreground">{worker.position}</p>
              <div className="mt-3 flex justify-center">
                <Badge
                  variant="outline"
                  className={worker.isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-zinc-200 bg-zinc-50 text-zinc-500"
                  }
                >
                  {worker.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>

            {/* Details */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-semibold">Información</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4 shrink-0" />
                  <span className="font-mono">{worker.rut}</span>
                </div>
                {worker.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{worker.email}</span>
                  </div>
                )}
                {worker.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{worker.phone}</span>
                  </div>
                )}
                {worker.area && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
                      RISK_LEVEL_COLORS[worker.area.riskLevel]
                    )}>
                      {worker.area.name} · {RISK_LEVEL_LABELS[worker.area.riskLevel]}
                    </span>
                  </div>
                )}
                {worker.startDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>
                      Desde {new Date(worker.startDate).toLocaleDateString("es-CL")}
                    </span>
                  </div>
                )}
                {contractLabel && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-4 w-4 shrink-0 text-center text-xs font-bold">C</span>
                    <span>{contractLabel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Edit form */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold mb-5">Editar información</h3>
            <WorkerForm
              workerId={worker.id}
              areas={areas.map((a) => ({ id: a.id, name: a.name, riskLevel: a.riskLevel }))}
              defaultValues={{
                rut: worker.rut,
                name: worker.name,
                lastName: worker.lastName,
                email: worker.email ?? "",
                phone: worker.phone ?? "",
                position: worker.position,
                department: worker.department ?? "",
                areaId: worker.areaId ?? "",
                contractType: worker.contractType ?? "",
                startDate: worker.startDate
                  ? new Date(worker.startDate).toISOString().split("T")[0]
                  : "",
                isActive: worker.isActive,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
