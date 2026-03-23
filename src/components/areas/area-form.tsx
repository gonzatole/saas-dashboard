"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { areaSchema, type AreaFormData } from "@/lib/validations/worker";
import { createArea, updateArea } from "@/actions/areas";
import { RISK_LEVEL_LABELS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";

interface AreaFormProps {
  areaId?: string;
  defaultValues?: Partial<AreaFormData>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AreaForm({ areaId, defaultValues, onSuccess, onCancel }: AreaFormProps) {
  const isEditing = !!areaId;
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: { riskLevel: "MEDIUM", ...defaultValues },
  });

  const onSubmit = (data: AreaFormData) => {
    setServerError(null);
    startTransition(async () => {
      const result = isEditing
        ? await updateArea(areaId, data)
        : await createArea(data);

      if (!result.success) {
        setServerError(result.error);
        return;
      }
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre del área *</Label>
          <Input id="name" placeholder="Ej: Bodega principal" {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="riskLevel">Nivel de riesgo *</Label>
          <select
            id="riskLevel"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            {...register("riskLevel")}
          >
            {Object.entries(RISK_LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Descripción</Label>
        <Input id="description" placeholder="Descripción del área..." {...register("description")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location">Ubicación</Label>
        <Input id="location" placeholder="Ej: Piso 2, sector norte" {...register("location")} />
      </div>

      <div className="flex justify-end gap-3 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEditing ? "Guardando..." : "Crear área"}</>
          ) : isEditing ? "Guardar cambios" : "Crear área"}
        </Button>
      </div>
    </form>
  );
}
