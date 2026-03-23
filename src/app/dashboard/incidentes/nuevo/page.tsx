"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { IncidentForm } from "@/components/incidents/incident-form";
import { getAreas } from "@/actions/areas";
import { getWorkers } from "@/actions/workers";

type Area = { id: string; name: string };
type Worker = { id: string; name: string; lastName: string };
type Category = { id: string; name: string };

export default function NuevoIncidentePage() {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [categories] = useState<Category[]>([]);

  useEffect(() => {
    Promise.all([getAreas(), getWorkers({ isActive: true })]).then(
      ([areasData, workersData]) => {
        setAreas(areasData.map((a) => ({ id: a.id, name: a.name })));
        setWorkers(workersData.map((w) => ({ id: w.id, name: w.name, lastName: w.lastName })));
      }
    );
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Reportar incidente"
        subtitle="Registra un nuevo incidente de seguridad laboral"
      />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6">
          <IncidentForm
            areas={areas}
            categories={categories}
            workers={workers}
            onSuccess={(id) => router.push(`/dashboard/incidentes/${id}`)}
            onCancel={() => router.push("/dashboard/incidentes")}
          />
        </div>
      </main>
    </div>
  );
}
