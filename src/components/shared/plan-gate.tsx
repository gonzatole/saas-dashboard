import Link from "next/link";
import { Lock } from "lucide-react";

interface PlanGateProps {
  children: React.ReactNode;
  /** Feature label shown in the upgrade prompt */
  feature: string;
  /** Whether the user has access (pass from server via requireAuth + plan check) */
  hasAccess: boolean;
}

/**
 * Wraps content that requires a paid plan.
 * If hasAccess is false, shows an upgrade prompt instead of children.
 */
export function PlanGate({ children, feature, hasAccess }: PlanGateProps) {
  if (hasAccess) return <>{children}</>;

  return (
    <div className="relative rounded-xl border border-border bg-card overflow-hidden">
      {/* Blurred preview */}
      <div className="pointer-events-none select-none blur-sm opacity-40 p-5">
        {children}
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-6 text-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <p className="text-sm font-semibold mb-1">{feature} requiere plan Pro</p>
        <p className="text-xs text-muted-foreground mb-4">
          Actualiza tu plan para acceder a esta funcionalidad
        </p>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Ver planes
        </Link>
      </div>
    </div>
  );
}
