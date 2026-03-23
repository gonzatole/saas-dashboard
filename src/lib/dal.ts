/**
 * Data Access Layer (DAL)
 * Centralizes auth verification and user session fetching.
 * Use these functions in Server Components and Server Actions.
 */

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Returns the current Supabase session or null.
 * Cached per request via React cache().
 */
export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
});

/**
 * Returns the authenticated user from DB (with company).
 * Redirects to /login if not authenticated.
 */
export const requireAuth = cache(async () => {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { supabaseId: session.user.id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          rut: true,
          plan: true,
          logoUrl: true,
          subscriptionStatus: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
});

/**
 * Returns the current user without redirecting.
 * Useful for optional auth checks.
 */
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;

  return prisma.user.findUnique({
    where: { supabaseId: session.user.id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          plan: true,
          subscriptionStatus: true,
        },
      },
    },
  });
});
