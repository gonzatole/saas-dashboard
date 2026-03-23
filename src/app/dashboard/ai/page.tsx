import { DashboardHeader } from "@/components/layout/dashboard-header";
import { AiChat } from "@/components/ai/ai-chat";
import { Bot, Shield, FileText, ClipboardList } from "lucide-react";

const AI_CAPABILITIES = [
  {
    icon: <Shield className="h-5 w-5 text-violet-500" />,
    title: "Normativa chilena",
    description: "Ley 16.744, DS 40, DS 594, MINSAL, ISL",
  },
  {
    icon: <FileText className="h-5 w-5 text-violet-500" />,
    title: "Análisis de incidentes",
    description: "Causas raíz, acciones correctivas, riesgo de reincidencia",
  },
  {
    icon: <ClipboardList className="h-5 w-5 text-violet-500" />,
    title: "Checklists y procedimientos",
    description: "Genera documentos de seguridad adaptados a tu empresa",
  },
];

export default function AiPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Asistente IA"
        subtitle="Consultor virtual de prevención de riesgos laborales"
      />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          {/* Sidebar capabilities */}
          <div className="lg:col-span-1 space-y-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="h-4 w-4 text-violet-500" />
                <h3 className="text-sm font-semibold">Capacidades</h3>
              </div>
              <div className="space-y-3">
                {AI_CAPABILITIES.map((cap) => (
                  <div key={cap.title} className="flex gap-2">
                    <div className="shrink-0 mt-0.5">{cap.icon}</div>
                    <div>
                      <p className="text-xs font-medium">{cap.title}</p>
                      <p className="text-xs text-muted-foreground">{cap.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-700">
                <strong>Nota legal:</strong> Este asistente es una herramienta de apoyo.
                Para decisiones críticas consulta un prevencionista de riesgos certificado.
              </p>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card overflow-hidden flex flex-col">
            <AiChat />
          </div>
        </div>
      </main>
    </div>
  );
}
