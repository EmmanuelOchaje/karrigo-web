import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SIGNED_IN } from "./fixtures";
import { LOGIN_PATH, opsRoute } from "./nav";
import type { AdminRole, AdminUser } from "./types";

/**
 * The ops session.
 *
 * The cookie is httpOnly, so nothing on the page can read or forge it, and
 * every guarded page calls `requireAdmin()` on the server. Hiding a button
 * from a moderator is a courtesy; `requireSuperAdmin()` in the action is what
 * actually stops them (CLAUDE.md rule 3).
 *
 * TODO(M3): the credential check below is a placeholder. When real auth lands,
 * `signIn` verifies against the admins table with a password hash and this
 * cookie carries a signed JWT, the same way the customer session will. The
 * shape of everything above it does not change.
 */

const COOKIE = "karrigo_ops";

/** A shift is long. Eight hours means one sign-in per day, not three. */
const MAX_AGE_SECONDS = 60 * 60 * 8;

export async function getAdmin(): Promise<AdminUser | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;

  const role: AdminRole = raw === "MODERATOR" ? "MODERATOR" : "SUPER_ADMIN";
  return { ...SIGNED_IN, role };
}

/** For a page. Bounces to the login screen when there is no session. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect(opsRoute(LOGIN_PATH));
  return admin;
}

/**
 * For an action that moves money — payouts and refunds. Throws rather than
 * redirects: a moderator reaching this has bypassed the UI, and the right
 * answer is a failed action, not a navigation.
 */
export async function requireSuperAdmin(): Promise<AdminUser> {
  const admin = await requireAdmin();
  if (admin.role !== "SUPER_ADMIN") {
    throw new Error("Only a super admin can do that.");
  }
  return admin;
}

export async function startSession(role: AdminRole): Promise<void> {
  (await cookies()).set(COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
