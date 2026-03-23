"use client";

import { useEffect, useState } from "react";
import type { PlanId } from "@/lib/stripe";
import { PLANS } from "@/lib/stripe";

interface PlanLimits {
  plan: PlanId;
  limits: (typeof PLANS)[PlanId]["limits"];
  isLoading: boolean;
}

export function usePlanLimits(): PlanLimits {
  const [plan, setPlan] = useState<PlanId>("FREE");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data: { plan?: PlanId }) => {
        if (data.plan) setPlan(data.plan);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return {
    plan,
    limits: PLANS[plan].limits,
    isLoading,
  };
}
