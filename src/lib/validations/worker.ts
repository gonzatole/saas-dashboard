import { z } from "zod";

// ─── RUT validation (Chile) ───────────────────────────────────────────────────

function calcularDv(rut: string): string {
  const body = rut.replace(/[.\-]/g, "").slice(0, -1);
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  if (remainder === 11) return "0";
  if (remainder === 10) return "k";
  return String(remainder);
}

export function validarRut(rut: string): boolean {
  const clean = rut.replace(/[.\-\s]/g, "").toLowerCase();
  if (!/^\d{7,8}[0-9k]$/.test(clean)) return false;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  return dv === calcularDv(body + "0"); // recalculate with body
}

// Better approach: validate directly
export function esRutValido(rut: string): boolean {
  const clean = rut.replace(/[.\-\s]/g, "").toLowerCase();
  if (!/^\d{7,8}[0-9k]$/.test(clean)) return false;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  const expected = remainder === 11 ? "0" : remainder === 10 ? "k" : String(remainder);

  return dv === expected;
}

export function formatearRut(rut: string): string {
  const clean = rut.replace(/[.\-\s]/g, "");
  if (clean.length < 2) return clean;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1).toUpperCase();

  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const rutSchema = z
  .string()
  .min(1, "El RUT es requerido")
  .refine(esRutValido, { message: "RUT inválido" });

export const workerSchema = z.object({
  rut: rutSchema,
  name: z.string().min(2, "Nombre muy corto").max(100),
  lastName: z.string().min(2, "Apellido muy corto").max(100),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  position: z.string().min(2, "Cargo requerido").max(100),
  department: z.string().max(100).optional().or(z.literal("")),
  areaId: z.string().cuid().optional().or(z.literal("")),
  contractType: z.string().optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export const workerUpdateSchema = workerSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type WorkerFormData = z.infer<typeof workerSchema>;
export type WorkerUpdateData = z.infer<typeof workerUpdateSchema>;

// ─── Area schema ──────────────────────────────────────────────────────────────

export const areaSchema = z.object({
  name: z.string().min(2, "Nombre muy corto").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  location: z.string().max(200).optional().or(z.literal("")),
});

export type AreaFormData = z.infer<typeof areaSchema>;
