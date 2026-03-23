import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const companyId = session.metadata?.companyId;
      const planId = session.metadata?.planId;

      if (companyId && planId) {
        await prisma.company.update({
          where: { id: companyId },
          data: {
            plan: planId as never,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const companyId = sub.metadata?.companyId;
      const planId = sub.metadata?.planId;

      if (companyId && planId) {
        await prisma.company.update({
          where: { id: companyId },
          data: { plan: planId as never },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const companyId = sub.metadata?.companyId;

      if (companyId) {
        await prisma.company.update({
          where: { id: companyId },
          data: { plan: "FREE" as never, stripeSubscriptionId: null },
        });
      }
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
