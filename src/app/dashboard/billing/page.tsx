import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield } from "lucide-react";
import { requireAuth } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/stripe";
import { BillingActions } from "@/components/billing/billing-actions";

export default async function BillingPage() {
  const user = await requireAuth();
  const company = await prisma.company.findUnique({
    where: { id: user.companyId },
    select: { plan: true, stripeCustomerId: true, stripeSubscriptionId: true },
  });

  const currentPlan = (company?.plan as keyof typeof PLANS) ?? "FREE";
  const hasStripe = !!company?.stripeCustomerId;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Facturación"
        subtitle="Gestiona tu plan de RiskGuard AI"
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Current plan card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Plan Actual
              </CardTitle>
              <Badge
                variant="outline"
                className={
                  currentPlan === "FREE"
                    ? "border-zinc-200 text-zinc-600"
                    : currentPlan === "PRO"
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-violet-300 bg-violet-50 text-violet-700"
                }
              >
                {PLANS[currentPlan].name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-3xl font-black">
                ${PLANS[currentPlan].price}
              </span>
              <span className="text-muted-foreground mb-1">/mes</span>
            </div>
            <BillingActions
              currentPlan={currentPlan}
              hasStripeCustomer={hasStripe}
            />
          </CardContent>
        </Card>

        {/* Plan comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.values(PLANS) as (typeof PLANS)[keyof typeof PLANS][]).map((plan) => {
            const isCurrent = plan.id === currentPlan;
            return (
              <Card
                key={plan.id}
                className={
                  isCurrent ? "border-primary ring-1 ring-primary" : ""
                }
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    {isCurrent && (
                      <Badge
                        variant="outline"
                        className="border-primary text-primary text-xs"
                      >
                        Actual
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-end gap-1 mt-2">
                    <span className="text-2xl font-black">${plan.price}</span>
                    <span className="text-muted-foreground text-sm">/mes</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {!isCurrent && plan.id !== "FREE" && (
                    <BillingActions
                      currentPlan={currentPlan}
                      targetPlan={plan.id as "PRO" | "ENTERPRISE"}
                      hasStripeCustomer={hasStripe}
                      compact
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature limits table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparativa de funcionalidades</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-semibold">Funcionalidad</th>
                  {Object.values(PLANS).map((p) => (
                    <th key={p.id} className="text-center py-3 font-semibold px-4">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  {
                    label: "Trabajadores",
                    values: Object.values(PLANS).map((p) =>
                      p.limits.workers === null ? "Ilimitados" : String(p.limits.workers)
                    ),
                  },
                  {
                    label: "Inspecciones/mes",
                    values: Object.values(PLANS).map((p) =>
                      p.limits.inspectionsPerMonth === null ? "Ilimitadas" : String(p.limits.inspectionsPerMonth)
                    ),
                  },
                  {
                    label: "Asistente IA",
                    values: Object.values(PLANS).map((p) => (p.limits.aiChat ? "✓" : "—")),
                  },
                  {
                    label: "Reportes IA",
                    values: Object.values(PLANS).map((p) => (p.limits.aiReports ? "✓" : "—")),
                  },
                  {
                    label: "Exportar PDF",
                    values: Object.values(PLANS).map((p) => (p.limits.exportPdf ? "✓" : "—")),
                  },
                  {
                    label: "Multi-sucursal",
                    values: Object.values(PLANS).map((p) => (p.limits.multiBranch ? "✓" : "—")),
                  },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="py-3 text-muted-foreground">{row.label}</td>
                    {row.values.map((val, i) => (
                      <td
                        key={i}
                        className={`text-center py-3 px-4 ${
                          val === "✓" ? "text-emerald-600 font-semibold" :
                          val === "—" ? "text-muted-foreground" : "font-medium"
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
