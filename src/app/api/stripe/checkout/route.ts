import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { requireAuth } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import type { PlanId } from "@/lib/stripe";

export async function POST(req: Request) {
  const user = await requireAuth();

  const { planId } = await req.json() as { planId: Exclude<PlanId, "FREE"> };

  const company = await prisma.company.findUnique({
    where: { id: user.companyId },
    select: { stripeCustomerId: true },
  });

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const session = await createCheckoutSession({
    planId,
    customerId: company?.stripeCustomerId ?? undefined,
    companyId: user.companyId,
    successUrl: `${origin}/dashboard/billing?success=1`,
    cancelUrl: `${origin}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
