"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/dal";
import {
  inspectionSchema,
  inspectionUpdateSchema,
  correctiveActionSchema,
} from "@/lib/validations/inspection";
import type {
  InspectionFormData,
  InspectionUpdateData,
  CorrectiveActionFormData,
} from "@/lib/validations/inspection";

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getInspections(options?: {
  status?: string;
  areaId?: string;
}) {
  const user = await requireAuth();

  return prisma.inspection.findMany({
    where: {
      companyId: user.companyId,
      ...(options?.status ? { status: options.status as never } : {}),
      ...(options?.areaId ? { areaId: options.areaId } : {}),
    },
    include: {
      area: { select: { id: true, name: true, riskLevel: true } },
      inspector: { select: { id: true, name: true } },
      _count: { select: { items: true, correctiveActions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getInspectionById(id: string) {
  const user = await requireAuth();

  return prisma.inspection.findFirst({
    where: { id, companyId: user.companyId },
    include: {
      area: true,
      inspector: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          category: { select: { id: true, name: true, color: true } },
          worker: { select: { id: true, name: true, lastName: true } },
        },
        orderBy: { order: "asc" },
      },
      correctiveActions: {
        include: {
          assignedTo: { select: { id: true, name: true } },
        },
        orderBy: { dueDate: "asc" },
      },
    },
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createInspection(
  data: InspectionFormData
): Promise<ActionResult<{ id: string }>> {
  const user = await requireAuth();

  const parsed = inspectionSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { items, areaId, scheduledDate, description, ...rest } = parsed.data;

  const inspection = await prisma.inspection.create({
    data: {
      ...rest,
      description: description || undefined,
      areaId: areaId || undefined,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      inspectorId: user.id,
      companyId: user.companyId,
      status: "DRAFT",
      items: {
        create: items.map((item, idx) => ({
          question: item.question,
          answer: item.answer || undefined,
          observation: item.observation || undefined,
          riskLevel: item.riskLevel || undefined,
          categoryId: item.categoryId || undefined,
          workerId: item.workerId || undefined,
          order: idx,
        })),
      },
    },
  });

  revalidatePath("/dashboard/inspecciones");
  return { success: true, data: { id: inspection.id } };
}

// ─── Update status / fields ───────────────────────────────────────────────────

export async function updateInspection(
  id: string,
  data: InspectionUpdateData
): Promise<ActionResult> {
  const user = await requireAuth();

  const parsed = inspectionUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const existing = await prisma.inspection.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!existing) return { success: false, error: "Inspección no encontrada." };

  const { areaId, scheduledDate, description, ...rest } = parsed.data;

  await prisma.inspection.update({
    where: { id },
    data: {
      ...rest,
      description: description !== undefined ? description || null : undefined,
      areaId: areaId !== undefined ? areaId || null : undefined,
      scheduledDate:
        scheduledDate !== undefined
          ? scheduledDate
            ? new Date(scheduledDate)
            : null
          : undefined,
      ...(rest.status === "COMPLETED" ? { completedDate: new Date() } : {}),
    },
  });

  revalidatePath("/dashboard/inspecciones");
  revalidatePath(`/dashboard/inspecciones/${id}`);
  return { success: true, data: undefined };
}

// ─── Update inspection item ───────────────────────────────────────────────────

export async function updateInspectionItem(
  itemId: string,
  data: {
    answer?: "OK" | "NO_OK" | "NA";
    observation?: string;
    riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  }
): Promise<ActionResult> {
  const user = await requireAuth();

  // Verify the item belongs to this company
  const item = await prisma.inspectionItem.findFirst({
    where: {
      id: itemId,
      inspection: { companyId: user.companyId },
    },
  });
  if (!item) return { success: false, error: "Ítem no encontrado." };

  await prisma.inspectionItem.update({
    where: { id: itemId },
    data: {
      answer: data.answer,
      observation: data.observation !== undefined ? data.observation || null : undefined,
      riskLevel: data.riskLevel,
    },
  });

  return { success: true, data: undefined };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteInspection(id: string): Promise<ActionResult> {
  const user = await requireAuth();

  const existing = await prisma.inspection.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!existing) return { success: false, error: "Inspección no encontrada." };

  await prisma.inspection.delete({ where: { id } });

  revalidatePath("/dashboard/inspecciones");
  return { success: true, data: undefined };
}

// ─── Corrective Actions ───────────────────────────────────────────────────────

export async function createCorrectiveAction(
  data: CorrectiveActionFormData
): Promise<ActionResult<{ id: string }>> {
  const user = await requireAuth();

  const parsed = correctiveActionSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { inspectionId, incidentId, dueDate, ...rest } = parsed.data;

  const action = await prisma.correctiveAction.create({
    data: {
      ...rest,
      dueDate: new Date(dueDate),
      inspectionId: inspectionId || undefined,
      incidentId: incidentId || undefined,
      companyId: user.companyId,
    },
  });

  revalidatePath("/dashboard/inspecciones");
  revalidatePath("/dashboard/incidentes");
  return { success: true, data: { id: action.id } };
}

export async function updateCorrectiveActionStatus(
  id: string,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE"
): Promise<ActionResult> {
  const user = await requireAuth();

  const action = await prisma.correctiveAction.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!action) return { success: false, error: "Acción no encontrada." };

  await prisma.correctiveAction.update({
    where: { id },
    data: {
      status,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });

  revalidatePath("/dashboard/inspecciones");
  revalidatePath("/dashboard/incidentes");
  return { success: true, data: undefined };
}
