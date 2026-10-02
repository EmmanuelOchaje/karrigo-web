import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { ApiError, api, type Schemas } from "@/lib/api/client";
import { LOGIN_PATH, opsRoute } from "./nav";
import type { AdminUser } from "./types";

/**
 * The ops session — real, against karrigo-be's admin auth.
 *
 * The tokens live in httpOnly cookies (`lib/api/session.ts`), so nothing on
 * the page can read or forge them, and `proxy.ts` rotates them before a page
 * renders. Every guarded page calls `requireAdmin()` here, and the backend
 * checks the token again on every call: hiding a button from a moderator is a
 * courtesy, the server refusing is the lock (CLAUDE.md rule 3).
 */

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}

/** One lookup per request, however many components ask. */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  try {
    const me = await api<Schemas["AuthenticatedAdminResponseDto"]>("/admin-auth/me", {
      scope: "admin",
    });
    return {
      name: me.name,
      email: me.email,
      role: me.adminRole,
      initials: initialsOf(me.name),
    };
  } catch (error) {
    if (error instanceof ApiError && (error.unauthorized || error.status === 403)) return null;
    throw error;
  }
});

/** For a page. Bounces to the login screen when there is no session. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect(opsRoute(LOGIN_PATH));
  return admin;
}

/**
 * For an action that moves money — payouts and refunds. Throws rather than
 * redirects: a moderator reaching this has bypassed the UI, and the right
 * answer is a failed action, not a navigation. (Whether the backend itself
 * restricts these to super admins is still an open product decision, so this
 * check is the one that holds.)
 */
export async function requireSuperAdmin(): Promise<AdminUser> {
  const admin = await requireAdmin();
  if (admin.role !== "SUPER_ADMIN") {
    throw new Error("Only a super admin can do that.");
  }
  return admin;
}
