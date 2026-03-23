"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlanId } from "@/lib/stripe";

interface BillingActionsProps {
  currentPlan: PlanId;
  targetPlan?: "PRO" | "ENTERPRISE";
  hasStripeCustomer: boolean;
  compact?: boolean;
}

export function BillingActions({
  currentPlan,
  targetPlan,
  hasStripeCustomer,
  compact = false,
}: BillingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout(planId: "PRO" | "ENTERPRISE") {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const { url } = await res.json();
      if (url) router.push(url);
    } catch {
      // silent fail — user stays on page
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) router.push(url);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  // Compact mode: just an upgrade button for a specific plan
  if (compact && targetPlan) {
    return (
      <Button
        className="w-full"
        size="sm"
        disabled={loading}
        onClick={() => handleCheckout(targetPlan)}
      >
        {loading ? (
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        ) : (
          <CreditCard className="mr-2 h-3.5 w-3.5" />
        )}
        Cambiar a {targetPlan === "PRO" ? "Pro" : "Enterprise"}
      </Button>
    );
  }

  // Full mode: manage current plan
  if (currentPlan === "FREE") {
    return (
      <div className="flex gap-3">
        <Button onClick={() => handleCheckout("PRO")} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <CreditCard className="mr-2 h-4 w-4" />
          Actualizar a Pro — $29/mes
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {hasStripeCustomer && (
        <Button variant="outline" onClick={handlePortal} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ExternalLink className="mr-2 h-4 w-4" />
          )}
          Gestionar suscripción
        </Button>
      )}
    </div>
  );
}
