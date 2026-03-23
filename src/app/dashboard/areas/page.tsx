"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus, Edit3, Trash2, Users, MapPin } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { AreaForm } from "@/components/areas/area-form";
import { getAreas, deleteArea } from "@/actions/areas";
import { RISK_LEVEL_LABELS, RISK_LEVEL_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AreaFormData } from "@/lib/validations/worker";

type Area = {
  id: string;
  name: string;
  description: string | null;
  riskLevel: string;
  location: string | null;
  _count: { workers: number };
};

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadAreas = () => {
    startTransition(async () => {
      const data = await getAreas();
      setAreas(data as Area[]);
    });
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const handleDelete = (area: Area) => {
    if (!confirm(`¿Eliminar el área "${area.name}"?`)) return;
    startTransition(async () => {
      const result = await deleteArea(area.id);
      if (!result.success) {
        alert(result.error);
        return;
      }
      loadAreas();
    });
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingArea(null);
    loadAreas();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Áreas de trabajo"
        subtitle="Define las áreas de tu empresa y su nivel de riesgo"
        action={
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nueva área
          </Button>
        }
      />

      <main className="flex-1 p-6 space-y-6">
        {areas.length === 0 && !isPending ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-semibold mb-1">Sin áreas configuradas</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crea áreas de trabajo para organizar a tus trabajadores y asignar niveles de riesgo.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear primera área
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map((area) => (
              <div
                key={area.id}
                className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{area.name}</h3>
                    {area.location && (
                      <p className="text-xs text-muted-foreground">{area.location}</p>
                    )}
                  </div>
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border shrink-0",
                    RISK_LEVEL_COLORS[area.riskLevel]
                  )}>
                    {RISK_LEVEL_LABELS[area.riskLevel]}
                  </span>
                </div>

                {area.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{area.description}</p>
                )}

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{area._count.workers} trabajador(es) activo(s)</span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 flex-1"
                    onClick={() => setEditingArea(area)}
                  >
                    <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-red-600 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(area)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva área de trabajo</DialogTitle>
          </DialogHeader>
          <AreaForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editingArea} onOpenChange={(open) => !open && setEditingArea(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar área</DialogTitle>
          </DialogHeader>
          {editingArea && (
            <AreaForm
              areaId={editingArea.id}
              defaultValues={{
                name: editingArea.name,
                description: editingArea.description ?? "",
                riskLevel: editingArea.riskLevel as AreaFormData["riskLevel"],
                location: editingArea.location ?? "",
              }}
              onSuccess={handleSuccess}
              onCancel={() => setEditingArea(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
