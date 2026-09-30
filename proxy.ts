import { NextResponse, type NextRequest } from "next/server";

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

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAdminHost = adminHosts().includes(hostname(request));

  if (!isAdminHost) {
    if (pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`)) {
      return NextResponse.rewrite(new URL(NOWHERE, request.url));
    }
    return NextResponse.next();
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
  return NextResponse.rewrite(new URL(`${target}${search}`, request.url));
}

export const config = {
  /* Everything except Next's own assets, the favicon and files with an
     extension. Those are served identically on both hosts. */
  matcher: ["/((?!_next/|favicon\\.ico|.*\\.[\\w]+$).*)"],
};
