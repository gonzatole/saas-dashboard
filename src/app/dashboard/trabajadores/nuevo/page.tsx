"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { WorkerForm } from "@/components/workers/worker-form";
import { useEffect, useState } from "react";
import { getAreas } from "@/actions/areas";

type Area = { id: string; name: string; riskLevel: string };

export default function NuevoTrabajadorPage() {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    getAreas().then((data) =>
      setAreas(data.map((a) => ({ id: a.id, name: a.name, riskLevel: a.riskLevel })))
    );
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Nuevo trabajador"
        subtitle="Agrega un trabajador a tu empresa"
      />

      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6">
          <WorkerForm
            areas={areas}
            onSuccess={(id) => router.push(`/dashboard/trabajadores/${id}`)}
            onCancel={() => router.push("/dashboard/trabajadores")}
          />
        </div>
      </main>
    </div>
  );
}
