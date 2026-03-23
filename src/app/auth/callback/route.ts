import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const { user } = data.session;

      // Ensure user exists in our DB (created on register, but just in case)
      const dbUser = await prisma.user.findUnique({
        where: { supabaseId: user.id },
      });

      if (dbUser) {
        // Update last login
        await prisma.user.update({
          where: { supabaseId: user.id },
          data: { lastLoginAt: new Date() },
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
