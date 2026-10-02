"use server";

import { redirect } from "next/navigation";

import { ApiError, api, type Schemas } from "@/lib/api/client";
import { clearTokens, readRefreshToken, storeTokens } from "@/lib/api/session";
import { LOGIN_PATH, opsRoute } from "@/lib/admin/nav";

export type SignInState = { error: string | null };

export async function signIn(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!/^\S+@\S+\.\S+$/.test(email) || !password) {
    return { error: "Enter your email and password." };
  }

  try {
    const tokens = await api<Schemas["TokenPairResponseDto"]>("/admin-auth/login", {
      method: "POST",
      body: { email, password },
    });
    await storeTokens("admin", tokens);
  } catch (error) {
    if (error instanceof ApiError) {
      // A wrong password and an unknown email get the same answer on purpose.
      if (error.status === 401) {
        return { error: "That email and password don't match. Check both and try again." };
      }
      if (error.status === 429) {
        return { error: "Too many attempts. Wait a few minutes and try again." };
      }
      return { error: error.message };
    }
    throw error;
  }

  // The route as it exists on disk — see `opsRoute`.
  redirect(opsRoute("/"));
}

export async function signOut(): Promise<void> {
  const refreshToken = await readRefreshToken("admin");
  if (refreshToken) {
    // Revoke it server-side too; a failure here must not trap someone signed in.
    await api("/admin-auth/logout", { method: "POST", body: { refreshToken } }).catch(() => {});
  }
  await clearTokens("admin");
  redirect(`${opsRoute(LOGIN_PATH)}?signedOut`);
}
