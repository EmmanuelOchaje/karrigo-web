import "server-only";

import { cookies } from "next/headers";

import { REFRESH_MAX_AGE_SECONDS, SCOPES, type Scope } from "./scopes";

/**
 * Writing and clearing a signed-in session. Only callable from a Server Action
 * or Route Handler — Next does not allow cookies to be set while a page
 * renders. Rotation on expiry is `proxy.ts`'s job, for that reason.
 */

export async function storeTokens(
  scope: Scope,
  tokens: { accessToken: string; refreshToken: string },
): Promise<void> {
  const jar = await cookies();
  const base = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
  jar.set(SCOPES[scope].access, tokens.accessToken, {
    ...base,
    maxAge: REFRESH_MAX_AGE_SECONDS,
  });
  jar.set(SCOPES[scope].refresh, tokens.refreshToken, {
    ...base,
    maxAge: REFRESH_MAX_AGE_SECONDS,
  });
}

export async function readRefreshToken(scope: Scope): Promise<string | undefined> {
  return (await cookies()).get(SCOPES[scope].refresh)?.value;
}

export async function clearTokens(scope: Scope): Promise<void> {
  const jar = await cookies();
  jar.delete(SCOPES[scope].access);
  jar.delete(SCOPES[scope].refresh);
}
