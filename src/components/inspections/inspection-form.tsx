"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, ChevronLeft, ChevronRight, AlertCircle, Loader2,
  ClipboardList, MapPin, CheckSquare,
} from "lucide-react";
import { inspectionSchema, type InspectionFormData } from "@/lib/validations/inspection";
import { createInspection } from "@/actions/inspections";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RISK_LEVEL_LABELS } from "@/lib/constants";

interface InspectionFormProps {
  areas: { id: string; name: string; riskLevel: string }[];
  categories: { id: string; name: string; color: string }[];
  workers: { id: string; name: string; lastName: string }[];
}

const STEPS = [
  { id: 1, label: "General", icon: ClipboardList },
  { id: 2, label: "Área", icon: MapPin },
  { id: 3, label: "Ítems", icon: CheckSquare },
];

const ANSWER_OPTIONS = [
  { value: "OK", label: "Cumple", className: "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
  { value: "NO_OK", label: "No cumple", className: "border-red-300 bg-red-50 text-red-700 hover:bg-red-100" },
  { value: "NA", label: "N/A", className: "border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100" },
] as const;

export function InspectionForm({ areas, categories, workers }: InspectionFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      items: [{ question: "", order: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const validateAndNext = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(["title", "description"]);
    if (step === 2) valid = await trigger(["areaId", "scheduledDate"]);
    if (valid || step === 2) setStep((s) => Math.min(s + 1, 3));
  };

  const onSubmit = (data: InspectionFormData) => {
    setServerError(null);
    startTransition(async () => {
      const result = await createInspection(data);
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      router.push(`/dashboard/inspecciones/${result.data.id}`);
    });
  };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, idx) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => s.id < step && setStep(s.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                step === s.id
                  ? "text-primary"
                  : s.id < step
                  ? "text-emerald-600 cursor-pointer hover:bg-muted"
                  : "text-muted-foreground cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border-2",
                  step === s.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : s.id < step
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {s.id < step ? "✓" : s.id}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {idx < STEPS.length - 1 && (
              <div className={cn("flex-1 h-px mx-2", step > s.id ? "bg-emerald-400" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      {serverError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: General */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Título de la inspección *</Label>
              <Input
                id="title"
                placeholder="Ej: Inspección mensual bodega norte"
                {...register("title")}
              />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Descripción / objetivo</Label>
              <textarea
                id="description"
                rows={3}
                placeholder="Objetivo de la inspección, alcance, etc."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                {...register("description")}
              />
            </div>
          </div>
        )}

        {/* Step 2: Area + date */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="areaId">Área a inspeccionar</Label>
              <select
                id="areaId"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register("areaId")}
              >
                <option value="">Sin área específica</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {RISK_LEVEL_LABELS[a.riskLevel]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scheduledDate">Fecha programada</Label>
              <Input id="scheduledDate" type="date" {...register("scheduledDate")} />
            </div>
          </div>
        )}

        {/* Step 3: Items */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Ítems de verificación ({fields.length})
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ question: "", order: fields.length })}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Añadir ítem
              </Button>
            </div>

            {errors.items && typeof errors.items.message === "string" && (
              <p className="text-xs text-red-500">{errors.items.message}</p>
            )}

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-border bg-muted/30 p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-2 text-xs font-bold text-muted-foreground w-5 shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 space-y-1.5">
                      <Input
                        placeholder="¿Qué se verifica?"
                        {...register(`items.${idx}.question`)}
                      />
                      {errors.items?.[idx]?.question && (
                        <p className="text-xs text-red-500">
                          {errors.items[idx]?.question?.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fields.length > 1 && remove(idx)}
                      disabled={fields.length <= 1}
                      className="mt-1.5 p-1 rounded text-muted-foreground hover:text-red-600 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Answer */}
                  <div className="flex items-center gap-2 ml-8">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">Resultado:</span>
                    <div className="flex gap-1.5">
                      <Controller
                        name={`items.${idx}.answer`}
                        control={control}
                        render={({ field: f }) =>
                          ANSWER_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => f.onChange(f.value === opt.value ? undefined : opt.value)}
                              className={cn(
                                "px-2.5 py-1 rounded-md text-xs font-medium border transition-all",
                                f.value === opt.value
                                  ? opt.className
                                  : "border-border text-muted-foreground hover:bg-muted"
                              )}
                            >
                              {opt.label}
                            </button>
                          )) as unknown as React.ReactElement
                        }
                      />
                    </div>
                  </div>

                  {/* Risk level */}
                  <div className="flex items-center gap-2 ml-8">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">Riesgo:</span>
                    <select
                      className="h-7 rounded-md border border-input bg-background px-2 text-xs"
                      {...register(`items.${idx}.riskLevel`)}
                    >
                      <option value="">Sin clasificar</option>
                      {Object.entries(RISK_LEVEL_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* Observation */}
                  <div className="ml-8">
                    <Input
                      placeholder="Observación (opcional)"
                      className="text-xs h-8"
                      {...register(`items.${idx}.observation`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step === 1 ? router.back() : setStep((s) => s - 1))}
          >
            <ChevronLeft className="mr-1.5 h-4 w-4" />
            {step === 1 ? "Cancelar" : "Anterior"}
          </Button>

          {step < 3 ? (
            <Button type="button" onClick={validateAndNext}>
              Siguiente
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</>
              ) : (
                "Crear inspección"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
