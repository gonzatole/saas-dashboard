"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/dal";
import { incidentSchema, incidentUpdateSchema } from "@/lib/validations/incident";
import type { IncidentFormData, IncidentUpdateData } from "@/lib/validations/incident";

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getIncidents(options?: {
  status?: string;
  severity?: string;
}) {
  const user = await requireAuth();

  return prisma.incident.findMany({
    where: {
      companyId: user.companyId,
      ...(options?.status ? { status: options.status as never } : {}),
      ...(options?.severity ? { severity: options.severity as never } : {}),
    },
    include: {
      area: { select: { id: true, name: true } },
      reportedBy: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, color: true } },
      _count: { select: { correctiveActions: true, workers: true } },
    },
    orderBy: { occurredAt: "desc" },
  });
}

export async function getIncidentById(id: string) {
  const user = await requireAuth();

  return prisma.incident.findFirst({
    where: { id, companyId: user.companyId },
    include: {
      area: true,
      reportedBy: { select: { id: true, name: true, email: true } },
      category: true,
      workers: {
        select: { id: true, name: true, lastName: true, position: true },
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

export async function createIncident(
  data: IncidentFormData
): Promise<ActionResult<{ id: string }>> {
  const user = await requireAuth();

  const parsed = incidentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const {
    workerIds,
    areaId,
    categoryId,
    location,
    occurredAt,
    injuredCount,
    lostDays,
    ...rest
  } = parsed.data;

  const incident = await prisma.incident.create({
    data: {
      ...rest,
      occurredAt: new Date(occurredAt),
      location: location || undefined,
      areaId: areaId || undefined,
      categoryId: categoryId || undefined,
      injuredCount: injuredCount ?? 0,
      lostDays: lostDays ?? 0,
      reportedById: user.id,
      companyId: user.companyId,
      status: "REPORTED",
      ...(workerIds?.length
        ? { workers: { connect: workerIds.map((id) => ({ id })) } }
        : {}),
    },
  });

  revalidatePath("/dashboard/incidentes");
  return { success: true, data: { id: incident.id } };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateIncident(
  id: string,
  data: IncidentUpdateData
): Promise<ActionResult> {
  const user = await requireAuth();

  const parsed = incidentUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const existing = await prisma.incident.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!existing) return { success: false, error: "Incidente no encontrado." };

  const {
    workerIds,
    areaId,
    categoryId,
    location,
    occurredAt,
    ...rest
  } = parsed.data;

  await prisma.incident.update({
    where: { id },
    data: {
      ...rest,
      occurredAt: occurredAt ? new Date(occurredAt) : undefined,
      location: location !== undefined ? location || null : undefined,
      areaId: areaId !== undefined ? areaId || null : undefined,
      categoryId: categoryId !== undefined ? categoryId || null : undefined,
      ...(workerIds
        ? { workers: { set: workerIds.map((wId) => ({ id: wId })) } }
        : {}),
    },
  });

  revalidatePath("/dashboard/incidentes");
  revalidatePath(`/dashboard/incidentes/${id}`);
  return { success: true, data: undefined };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteIncident(id: string): Promise<ActionResult> {
  const user = await requireAuth();

  const existing = await prisma.incident.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!existing) return { success: false, error: "Incidente no encontrado." };

  await prisma.incident.delete({ where: { id } });

  revalidatePath("/dashboard/incidentes");
  return { success: true, data: undefined };
}
