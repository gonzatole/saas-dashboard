import { z } from "zod";

export const incidentSchema = z.object({
  title: z.string().min(3, "El título es requerido").max(200),
  description: z.string().min(10, "Describe el incidente con más detalle").max(2000),
  severity: z.enum(["NEAR_MISS", "MINOR", "MODERATE", "SERIOUS", "FATAL"]),
  occurredAt: z.string().min(1, "La fecha del incidente es requerida"),
  location: z.string().max(200).optional().or(z.literal("")),
  areaId: z.string().cuid().optional().or(z.literal("")),
  categoryId: z.string().cuid().optional().or(z.literal("")),
  injuredCount: z.number().int().min(0),
  lostDays: z.number().int().min(0),
  workerIds: z.array(z.string().cuid()).optional(),
});

export const incidentUpdateSchema = incidentSchema.partial().extend({
  status: z
    .enum(["REPORTED", "INVESTIGATING", "ACTION_PENDING", "CLOSED"])
    .optional(),
});

export type IncidentFormData = z.infer<typeof incidentSchema>;
export type IncidentUpdateData = z.infer<typeof incidentUpdateSchema>;
