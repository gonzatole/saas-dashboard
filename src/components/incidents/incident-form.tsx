"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incidentSchema, type IncidentFormData } from "@/lib/validations/incident";
import { createIncident, updateIncident } from "@/actions/incidents";
import { INCIDENT_SEVERITY_LABELS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import type { IncidentUpdateData } from "@/lib/validations/incident";

interface IncidentFormProps {
  incidentId?: string;
  defaultValues?: Partial<IncidentFormData>;
  areas: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  workers: { id: string; name: string; lastName: string }[];
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
}

const SEVERITY_COLORS: Record<string, string> = {
  NEAR_MISS: "border-zinc-300 hover:bg-zinc-100",
  MINOR: "border-yellow-300 hover:bg-yellow-50",
  MODERATE: "border-orange-300 hover:bg-orange-50",
  SERIOUS: "border-red-300 hover:bg-red-50",
  FATAL: "border-red-500 hover:bg-red-100",
};

export function IncidentForm({
  incidentId,
  defaultValues,
  areas,
  categories,
  workers,
  onSuccess,
  onCancel,
}: IncidentFormProps) {
  const isEditing = !!incidentId;
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      injuredCount: 0,
      lostDays: 0,
      ...defaultValues,
    },
  });

  const selectedSeverity = watch("severity");

  const onSubmit = (data: IncidentFormData) => {
    setServerError(null);
    startTransition(async () => {
      const result = isEditing
        ? await updateIncident(incidentId, data as IncidentUpdateData)
        : await createIncident(data);

      if (!result.success) {
        setServerError(result.error);
        return;
      }

      if (!isEditing && result.success) {
        onSuccess?.((result as { success: true; data: { id: string } }).data.id);
      } else {
        onSuccess?.(incidentId!);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      {/* Severity selector */}
      <div className="space-y-2">
        <Label>Gravedad *</Label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {Object.entries(INCIDENT_SEVERITY_LABELS).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue("severity", value as IncidentFormData["severity"])}
              className={`rounded-lg border-2 px-2 py-2 text-xs font-medium text-center transition-all ${
                SEVERITY_COLORS[value]
              } ${
                selectedSeverity === value
                  ? "ring-2 ring-offset-1 ring-primary"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.severity && <p className="text-xs text-red-500">{errors.severity.message}</p>}
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Título *</Label>
        <Input id="title" placeholder="Ej: Caída en bodega principal" {...register("title")} />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Descripción *</Label>
        <textarea
          id="description"
          rows={3}
          placeholder="Describe el incidente, cómo ocurrió, qué pasó..."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          {...register("description")}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      {/* Date + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="occurredAt">Fecha y hora del incidente *</Label>
          <Input id="occurredAt" type="datetime-local" {...register("occurredAt")} />
          {errors.occurredAt && <p className="text-xs text-red-500">{errors.occurredAt.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Lugar específico</Label>
          <Input id="location" placeholder="Ej: Pasillo 3, sector B" {...register("location")} />
        </div>
      </div>

      {/* Area + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="areaId">Área</Label>
          <select
            id="areaId"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            {...register("areaId")}
          >
            <option value="">Sin área</option>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="categoryId">Categoría de riesgo</Label>
          <select
            id="categoryId"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            {...register("categoryId")}
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Impact */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="injuredCount">Personas lesionadas</Label>
          <Input id="injuredCount" type="number" min={0} {...register("injuredCount")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lostDays">Días de trabajo perdidos</Label>
          <Input id="lostDays" type="number" min={0} {...register("lostDays")} />
        </div>
      </div>

      {/* Workers involved */}
      {workers.length > 0 && (
        <div className="space-y-1.5">
          <Label>Trabajadores involucrados</Label>
          <div className="max-h-36 overflow-y-auto rounded-md border border-input bg-background p-2 space-y-1">
            {workers.map((w) => (
              <label key={w.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded px-2 py-1">
                <input
                  type="checkbox"
                  value={w.id}
                  className="rounded"
                  {...register("workerIds")}
                />
                <span className="text-sm">{w.name} {w.lastName}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEditing ? "Guardando..." : "Reportar..."}</>
          ) : isEditing ? "Guardar cambios" : "Reportar incidente"}
        </Button>
      </div>
    </form>
  );
}
