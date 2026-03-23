import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type PrismaTx = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { supabaseId, email, name, companyName, companyRut } = body;

    if (!supabaseId || !email || !name || !companyName || !companyRut) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Verify the supabase user actually exists (security check)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== supabaseId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Check if user already exists (idempotency)
    const existing = await prisma.user.findUnique({
      where: { supabaseId },
    });

    if (existing) {
      return NextResponse.json({ ok: true, userId: existing.id });
    }

    // Create company + admin user in a transaction
    const result = await prisma.$transaction(async (tx: PrismaTx) => {
      const company = await tx.company.create({
        data: {
          rut: companyRut,
          name: companyName,
          plan: "FREE",
        },
      });

      const dbUser = await tx.user.create({
        data: {
          supabaseId,
          email,
          name,
          role: "ADMIN",
          companyId: company.id,
          lastLoginAt: new Date(),
        },
      });

      // Seed default risk categories for this company
      await tx.riskCategory.createMany({
        data: [
          { name: "Caída a distinto nivel", color: "#ef4444", isSystem: true, companyId: company.id },
          { name: "Caída al mismo nivel", color: "#f97316", isSystem: true, companyId: company.id },
          { name: "Contacto eléctrico", color: "#eab308", isSystem: true, companyId: company.id },
          { name: "Incendio / Explosión", color: "#dc2626", isSystem: true, companyId: company.id },
          { name: "Ergonómico", color: "#8b5cf6", isSystem: true, companyId: company.id },
          { name: "Químico / Tóxico", color: "#06b6d4", isSystem: true, companyId: company.id },
          { name: "Ruido / Vibración", color: "#10b981", isSystem: true, companyId: company.id },
          { name: "Orden y Aseo", color: "#6366f1", isSystem: true, companyId: company.id },
        ],
      });

      return { company, user: dbUser };
    });

    return NextResponse.json({ ok: true, userId: result.user.id, companyId: result.company.id });
  } catch (error) {
    console.error("[API] auth/setup error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
