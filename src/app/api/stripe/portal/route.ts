import { NextResponse } from "next/server";
import { createCustomerPortalSession } from "@/lib/stripe";
import { requireAuth } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await requireAuth();

  const company = await prisma.company.findUnique({
    where: { id: user.companyId },
    select: { stripeCustomerId: true },
  });

  if (!company?.stripeCustomerId) {
    return NextResponse.json({ error: "No customer ID found" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const session = await createCustomerPortalSession({
    customerId: company.stripeCustomerId,
    returnUrl: `${origin}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
