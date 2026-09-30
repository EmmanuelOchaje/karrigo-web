"use server";

import { redirect } from "next/navigation";

import { LOGIN_PATH, opsRoute } from "@/lib/admin/nav";
import { endSession, startSession } from "@/lib/admin/session";
import { SIGNED_IN } from "@/lib/admin/fixtures";

export type SignInState = { error: string | null };

/**
 * Checks the one ops account, held in `.env.local` as OPS_ADMIN_EMAIL and
 * OPS_ADMIN_PASSWORD so no credential is ever committed.
 *
 * TODO(M3): verify against the admins table with a password hash, rate-limit
 * per email and per IP the way API.md specifies, and log every attempt. A
 * plaintext comparison against an env var is a placeholder for one account on
 * one machine, not something to ship — and it cannot grow a second admin.
 */
export async function signIn(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!/^\S+@\S+\.\S+$/.test(email) || !password) {
    return { error: "Enter your email and password." };
  }

  const expectedEmail = process.env.OPS_ADMIN_EMAIL;
  const expectedPassword = process.env.OPS_ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return {
      error:
        "Sign-in is not configured on this server. Set OPS_ADMIN_EMAIL and OPS_ADMIN_PASSWORD.",
    };
  }

  if (
    email.toLowerCase() !== expectedEmail.toLowerCase() ||
    password !== expectedPassword
  ) {
    // Deliberately does not say which of the two was wrong — that would tell
    // someone guessing which half they had right.
    return {
      error: "That email and password don't match. Check both and try again.",
    };
  }

  await startSession(SIGNED_IN.role);
  // The route as it exists on disk — see `opsRoute`.
  redirect(opsRoute("/"));
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect(`${opsRoute(LOGIN_PATH)}?signedOut`);
}
