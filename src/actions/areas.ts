"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/dal";
import { areaSchema } from "@/lib/validations/worker";
import type { AreaFormData } from "@/lib/validations/worker";

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getAreas() {
  const user = await requireAuth();

  return prisma.area.findMany({
    where: { companyId: user.companyId },
    include: {
      _count: { select: { workers: { where: { isActive: true } } } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getAreaById(id: string) {
  const user = await requireAuth();

  return prisma.area.findFirst({
    where: { id, companyId: user.companyId },
    include: {
      workers: {
        where: { isActive: true },
        select: { id: true, name: true, lastName: true, position: true },
      },
    },
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createArea(
  data: AreaFormData
): Promise<ActionResult<{ id: string }>> {
  const user = await requireAuth();

  const parsed = areaSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { description, location, ...rest } = parsed.data;

  const area = await prisma.area.create({
    data: {
      ...rest,
      description: description || undefined,
      location: location || undefined,
      companyId: user.companyId,
    },
  });

  revalidatePath("/dashboard/areas");
  revalidatePath("/dashboard/trabajadores");
  return { success: true, data: { id: area.id } };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateArea(
  id: string,
  data: Partial<AreaFormData>
): Promise<ActionResult> {
  const user = await requireAuth();

  const existing = await prisma.area.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!existing) return { success: false, error: "Área no encontrada." };

  const { description, location, ...rest } = data;

  await prisma.area.update({
    where: { id },
    data: {
      ...rest,
      description: description !== undefined ? (description || null) : undefined,
      location: location !== undefined ? (location || null) : undefined,
    },
  });

  revalidatePath("/dashboard/areas");
  revalidatePath("/dashboard/trabajadores");
  return { success: true, data: undefined };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteArea(id: string): Promise<ActionResult> {
  const user = await requireAuth();

  const area = await prisma.area.findFirst({
    where: { id, companyId: user.companyId },
    include: { _count: { select: { workers: true } } },
  });
  if (!area) return { success: false, error: "Área no encontrada." };

  if (area._count.workers > 0) {
    return {
      success: false,
      error: `No se puede eliminar el área porque tiene ${area._count.workers} trabajador(es) asignado(s).`,
    };
  }

  await prisma.area.delete({ where: { id } });

  revalidatePath("/dashboard/areas");
  revalidatePath("/dashboard/trabajadores");
  return { success: true, data: undefined };
}
