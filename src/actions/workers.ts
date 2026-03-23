"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/dal";
import { workerSchema, workerUpdateSchema } from "@/lib/validations/worker";
import type { WorkerFormData, WorkerUpdateData } from "@/lib/validations/worker";
import { formatearRut } from "@/lib/validations/worker";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getWorkers(options?: {
  search?: string;
  areaId?: string;
  isActive?: boolean;
}) {
  const user = await requireAuth();

  const where: Record<string, unknown> = { companyId: user.companyId };

  if (options?.isActive !== undefined) {
    where.isActive = options.isActive;
  }

  if (options?.areaId) {
    where.areaId = options.areaId;
  }

  if (options?.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { lastName: { contains: options.search, mode: "insensitive" } },
      { rut: { contains: options.search, mode: "insensitive" } },
      { position: { contains: options.search, mode: "insensitive" } },
    ];
  }

  return prisma.worker.findMany({
    where,
    include: {
      area: { select: { id: true, name: true, riskLevel: true } },
    },
    orderBy: [{ isActive: "desc" }, { lastName: "asc" }, { name: "asc" }],
  });
}

export async function getWorkerById(id: string) {
  const user = await requireAuth();

  return prisma.worker.findFirst({
    where: { id, companyId: user.companyId },
    include: {
      area: true,
    },
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createWorker(
  data: WorkerFormData
): Promise<ActionResult<{ id: string }>> {
  const user = await requireAuth();

  const parsed = workerSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { rut, email, phone, department, areaId, contractType, startDate, ...rest } =
    parsed.data;

  // Check RUT uniqueness within company
  const existing = await prisma.worker.findFirst({
    where: { rut: formatearRut(rut), companyId: user.companyId },
  });
  if (existing) {
    return { success: false, error: "Ya existe un trabajador con ese RUT en tu empresa." };
  }

  const worker = await prisma.worker.create({
    data: {
      ...rest,
      rut: formatearRut(rut),
      email: email || undefined,
      phone: phone || undefined,
      department: department || undefined,
      areaId: areaId || undefined,
      contractType: contractType || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      companyId: user.companyId,
    },
  });

  revalidatePath("/dashboard/trabajadores");
  return { success: true, data: { id: worker.id } };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateWorker(
  id: string,
  data: WorkerUpdateData
): Promise<ActionResult> {
  const user = await requireAuth();

  const parsed = workerUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const existing = await prisma.worker.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!existing) {
    return { success: false, error: "Trabajador no encontrado." };
  }

  const { rut, email, phone, department, areaId, contractType, startDate, ...rest } =
    parsed.data;

  // If RUT changed, check uniqueness
  if (rut && formatearRut(rut) !== existing.rut) {
    const duplicate = await prisma.worker.findFirst({
      where: { rut: formatearRut(rut), companyId: user.companyId, NOT: { id } },
    });
    if (duplicate) {
      return { success: false, error: "Ya existe un trabajador con ese RUT." };
    }
  }

  await prisma.worker.update({
    where: { id },
    data: {
      ...rest,
      ...(rut ? { rut: formatearRut(rut) } : {}),
      email: email !== undefined ? (email || null) : undefined,
      phone: phone !== undefined ? (phone || null) : undefined,
      department: department !== undefined ? (department || null) : undefined,
      areaId: areaId !== undefined ? (areaId || null) : undefined,
      contractType: contractType !== undefined ? (contractType || null) : undefined,
      startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined,
    },
  });

  revalidatePath("/dashboard/trabajadores");
  revalidatePath(`/dashboard/trabajadores/${id}`);
  return { success: true, data: undefined };
}

// ─── Toggle active status ─────────────────────────────────────────────────────

export async function toggleWorkerStatus(id: string): Promise<ActionResult> {
  const user = await requireAuth();

  const worker = await prisma.worker.findFirst({
    where: { id, companyId: user.companyId },
    select: { id: true, isActive: true },
  });
  if (!worker) return { success: false, error: "Trabajador no encontrado." };

  await prisma.worker.update({
    where: { id },
    data: { isActive: !worker.isActive },
  });

  revalidatePath("/dashboard/trabajadores");
  return { success: true, data: undefined };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteWorker(id: string): Promise<ActionResult> {
  const user = await requireAuth();

  const worker = await prisma.worker.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!worker) return { success: false, error: "Trabajador no encontrado." };

  await prisma.worker.delete({ where: { id } });

  revalidatePath("/dashboard/trabajadores");
  return { success: true, data: undefined };
}
