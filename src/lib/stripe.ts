import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

// ─── Plan definitions ─────────────────────────────────────────────────────────

export type PlanId = "FREE" | "PRO" | "ENTERPRISE";

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // USD/month
  stripePriceId: string | null;
  features: string[];
  limits: {
    workers: number | null; // null = unlimited
    inspectionsPerMonth: number | null;
    aiChat: boolean;
    aiReports: boolean;
    exportPdf: boolean;
    multiBranch: boolean;
  };
}

export const PLANS: Record<PlanId, Plan> = {
  FREE: {
    id: "FREE",
    name: "Gratis",
    price: 0,
    stripePriceId: null,
    features: [
      "Hasta 10 trabajadores",
      "5 inspecciones por mes",
      "Incidentes ilimitados",
      "Soporte por email",
    ],
    limits: {
      workers: 10,
      inspectionsPerMonth: 5,
      aiChat: false,
      aiReports: false,
      exportPdf: false,
      multiBranch: false,
    },
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    price: 29,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    features: [
      "Trabajadores ilimitados",
      "Inspecciones ilimitadas",
      "Asistente IA incluido",
      "Reportes IA automáticos",
      "Exportar PDF",
      "Soporte prioritario",
    ],
    limits: {
      workers: null,
      inspectionsPerMonth: null,
      aiChat: true,
      aiReports: true,
      exportPdf: true,
      multiBranch: false,
    },
  },
  ENTERPRISE: {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: 99,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? null,
    features: [
      "Todo lo de Pro",
      "Multi-sucursal",
      "API personalizada",
      "Soporte dedicado",
      "SLA garantizado",
      "Facturación personalizada",
    ],
    limits: {
      workers: null,
      inspectionsPerMonth: null,
      aiChat: true,
      aiReports: true,
      exportPdf: true,
      multiBranch: true,
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export async function createCheckoutSession({
  planId,
  customerId,
  companyId,
  successUrl,
  cancelUrl,
}: {
  planId: Exclude<PlanId, "FREE">;
  customerId?: string;
  companyId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const plan = PLANS[planId];
  if (!plan.stripePriceId) throw new Error("Plan has no Stripe price ID");

  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { companyId, planId },
    subscription_data: {
      metadata: { companyId, planId },
    },
  });
}

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}
