import { z } from "zod";

export const inspectionItemSchema = z.object({
  question: z.string().min(3, "La pregunta es requerida"),
  answer: z.enum(["OK", "NO_OK", "NA"]).optional(),
  observation: z.string().max(500).optional().or(z.literal("")),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  categoryId: z.string().cuid().optional().or(z.literal("")),
  workerId: z.string().cuid().optional().or(z.literal("")),
  order: z.number().int(),
});

export const inspectionSchema = z.object({
  title: z.string().min(3, "El título es requerido").max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
  areaId: z.string().cuid().optional().or(z.literal("")),
  scheduledDate: z.string().optional().or(z.literal("")),
  items: z.array(inspectionItemSchema).min(1, "Agrega al menos un ítem"),
});

export const inspectionUpdateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(1000).optional().or(z.literal("")),
  areaId: z.string().cuid().optional().or(z.literal("")),
  scheduledDate: z.string().optional().or(z.literal("")),
  status: z
    .enum(["DRAFT", "IN_PROGRESS", "COMPLETED", "REVIEWED"])
    .optional(),
});

export const correctiveActionSchema = z.object({
  title: z.string().min(3, "El título es requerido").max(200),
  description: z.string().min(5, "La descripción es requerida").max(1000),
  dueDate: z.string().min(1, "La fecha límite es requerida"),
  assignedToId: z.string().cuid("Asigna un responsable"),
  inspectionId: z.string().cuid().optional().or(z.literal("")),
  incidentId: z.string().cuid().optional().or(z.literal("")),
});

export type InspectionFormData = z.infer<typeof inspectionSchema>;
export type InspectionItemData = z.infer<typeof inspectionItemSchema>;
export type InspectionUpdateData = z.infer<typeof inspectionUpdateSchema>;
export type CorrectiveActionFormData = z.infer<typeof correctiveActionSchema>;
