import { NextResponse, type NextRequest } from "next/server";

import {
  API_URL,
  REFRESH_MAX_AGE_SECONDS,
  SCOPES,
  jwtExpiry,
  type Scope,
} from "@/lib/api/scopes";

/**
 * Two domains, one deployment.
 *
 *   karrigo.app          the customer site and ordering flow
 *   admin.karrigo.app    the ops panel
 *
 * The ops panel lives at `app/(admin)/admin/*` in this codebase, but ops never
 * sees `/admin` in the address bar: on the admin host every path is rewritten
 * under that prefix, so `admin.karrigo.app/orders` serves `/admin/orders`.
 *
 * The reverse is closed off. On the public host anything under `/admin`
 * behaves as if the route does not exist — not a redirect, which would
 * advertise it. This is obscurity, not security: the real guard is that every
 * admin page and action checks the session server-side (CLAUDE.md rule 3).
 * Hiding the surface just keeps it off the public site's URL space.
 */

const ADMIN_PREFIX = "/admin";

/** Matches nothing in `app/`, so Next renders its 404 exactly as it would for
 *  any unknown URL. */
const NOWHERE = "/__no_such_route";

/** In production set ADMIN_HOST to the ops domain. In development,
 *  http://admin.localhost:3000 resolves to 127.0.0.1 in every modern browser
 *  with no hosts-file entry, so both surfaces run off one `next dev`. */
function adminHosts(): string[] {
  const configured = process.env.ADMIN_HOST?.trim();
  return [configured, "admin.localhost"].filter(
    (h): h is string => !!h && h.length > 0,
  );
}

function hostname(request: NextRequest): string {
  // Host carries the port; the comparison should not.
  const host = request.headers.get("host") ?? "";
  return host.split(":")[0].toLowerCase();
}

type Tokens = { accessToken: string; refreshToken: string };

/**
 * Refresh tokens rotate, and reusing an old one revokes the whole chain (a
 * deliberate tripwire in karrigo-be). A page load fires several requests at
 * once, so without this they would each spend the same token and the second
 * would sign the user out. One refresh per token; late arrivals reuse its
 * answer for a few seconds.
 */
const inFlight = new Map<string, Promise<Tokens | null>>();

function refreshOnce(scope: Scope, refreshToken: string): Promise<Tokens | null> {
  const existing = inFlight.get(refreshToken);
  if (existing) return existing;

  const attempt = (async () => {
    try {
      const response = await fetch(`${API_URL}${SCOPES[scope].refreshPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });
      if (!response.ok) return null;
      return (await response.json()) as Tokens;
    } catch {
      return null;
    }
  })();

  inFlight.set(refreshToken, attempt);
  setTimeout(() => inFlight.delete(refreshToken), 15_000);
  return attempt;
}

/** Rotates any signed-in session whose access token is spent or about to be,
 *  before the page or action runs — the one place cookies can be written for
 *  a render. Returns the cookie changes to apply to both request and response. */
async function rotateSessions(request: NextRequest) {
  const changes: { name: string; value: string | null }[] = [];
  const now = Date.now() / 1000;

  for (const scope of Object.keys(SCOPES) as Scope[]) {
    const names = SCOPES[scope];
    const refreshToken = request.cookies.get(names.refresh)?.value;
    if (!refreshToken) continue;

    const access = request.cookies.get(names.access)?.value;
    if (access && jwtExpiry(access) - now > 30) continue;

    const tokens = await refreshOnce(scope, refreshToken);
    if (tokens) {
      changes.push(
        { name: names.access, value: tokens.accessToken },
        { name: names.refresh, value: tokens.refreshToken },
      );
    } else {
      // Revoked or expired for good: sign out rather than loop on a dead token.
      changes.push({ name: names.access, value: null }, { name: names.refresh, value: null });
    }
  }
  return changes;
}

export async function proxy(request: NextRequest) {
  const changes = await rotateSessions(request);
  const response = route(request, changes);

  for (const { name, value } of changes) {
    if (value === null) {
      response.cookies.delete(name);
    } else {
      response.cookies.set(name, value, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: REFRESH_MAX_AGE_SECONDS,
      });
    }
  }
  return response;
}

function route(
  request: NextRequest,
  changes: { name: string; value: string | null }[],
): NextResponse {
  const { pathname, search } = request.nextUrl;
  const isAdminHost = adminHosts().includes(hostname(request));

  // What the page or action will see on this very request.
  const headers = new Headers(request.headers);
  if (changes.length) {
    const jar = new Map(request.cookies.getAll().map((c) => [c.name, c.value]));
    for (const { name, value } of changes) {
      if (value === null) jar.delete(name);
      else jar.set(name, value);
    }
    headers.set(
      "cookie",
      [...jar].map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("; "),
    );
  }
  const forward = { request: { headers } };

  if (!isAdminHost) {
    if (pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`)) {
      return NextResponse.rewrite(new URL(NOWHERE, request.url), forward);
    }
    return NextResponse.next(forward);
  }

  // Landing on the real path — a bookmark, or a Server Action's `redirect()`,
  // which Next resolves internally without re-entering this file and so has
  // to name the route as it exists on disk. Bounce to the clean URL so the
  // prefix never settles in the address bar. Internal rewrites below do not
  // come back through here, so this cannot loop.
  if (pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`)) {
    const stripped = pathname.slice(ADMIN_PREFIX.length) || "/";
    return NextResponse.redirect(new URL(`${stripped}${search}`, request.url));
  }

  const target = pathname === "/" ? ADMIN_PREFIX : `${ADMIN_PREFIX}${pathname}`;
  return NextResponse.rewrite(new URL(`${target}${search}`, request.url), forward);
}

export const config = {
  /* Everything except Next's own assets, the favicon and files with an
     extension. Those are served identically on both hosts. */
  matcher: ["/((?!_next/|favicon\\.ico|.*\\.[\\w]+$).*)"],
};
