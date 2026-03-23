"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workerSchema, type WorkerFormData } from "@/lib/validations/worker";
import { createWorker, updateWorker } from "@/actions/workers";
import { TIPOS_CONTRATO } from "@/lib/constants";
import { RutInput } from "@/components/shared/rut-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";

interface WorkerFormProps {
  workerId?: string;
  defaultValues?: Partial<WorkerFormData>;
  areas: { id: string; name: string; riskLevel: string }[];
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
}

export function WorkerForm({
  workerId,
  defaultValues,
  areas,
  onSuccess,
  onCancel,
}: WorkerFormProps) {
  const isEditing = !!workerId;
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      isActive: true,
      ...defaultValues,
    },
  });

  const onSubmit = (data: WorkerFormData) => {
    setServerError(null);
    startTransition(async () => {
      const result = isEditing
        ? await updateWorker(workerId, data)
        : await createWorker(data);

      if (!result.success) {
        setServerError(result.error);
        return;
      }

      if (!isEditing && result.success) {
        onSuccess?.((result as { success: true; data: { id: string } }).data.id);
      } else {
        onSuccess?.(workerId!);
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

      {/* Row 1: RUT + Position */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="rut">RUT *</Label>
          <Controller
            name="rut"
            control={control}
            render={({ field }) => (
              <RutInput
                id="rut"
                value={field.value || ""}
                onChange={field.onChange}
                disabled={isEditing} // RUT no se cambia después de creado
                showValidation
              />
            )}
          />
          {errors.rut && <p className="text-xs text-red-500">{errors.rut.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="position">Cargo *</Label>
          <Input
            id="position"
            placeholder="Ej: Operario de producción"
            {...register("position")}
          />
          {errors.position && <p className="text-xs text-red-500">{errors.position.message}</p>}
        </div>
      </div>

      {/* Row 2: Name + LastName */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" placeholder="Juan" {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lastName">Apellido *</Label>
          <Input id="lastName" placeholder="González" {...register("lastName")} />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Row 3: Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="juan@empresa.cl"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" placeholder="+56 9 1234 5678" {...register("phone")} />
        </div>
      </div>

      {/* Row 4: Department + Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="department">Departamento</Label>
          <Input id="department" placeholder="Producción" {...register("department")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="areaId">Área de trabajo</Label>
          <select
            id="areaId"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            {...register("areaId")}
          >
            <option value="">Sin área asignada</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 5: Contract Type + Start Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="contractType">Tipo de contrato</Label>
          <select
            id="contractType"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            {...register("contractType")}
          >
            <option value="">Seleccionar...</option>
            {TIPOS_CONTRATO.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="startDate">Fecha de ingreso</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Guardando..." : "Creando..."}
            </>
          ) : isEditing ? (
            "Guardar cambios"
          ) : (
            "Agregar trabajador"
          )}
        </Button>
      </div>
    </form>
  );
}
