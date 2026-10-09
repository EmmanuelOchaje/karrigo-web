/**
 * Tells iOS which paths on this host belong to which app, so a tapped email
 * link opens the app instead of Safari. Apple fetches it (over HTTPS, no
 * redirects, no extension) when the app is installed. Each app only claims
 * its own path prefix; the screens they map to live in each app's
 * src/lib/email-links.ts.
 *
 * APPLE_TEAM_ID is the 10-character Team ID from the Apple Developer account.
 * Until it is set there is nothing correct to serve, so this 404s.
 */
export function GET() {
  const team = process.env.APPLE_TEAM_ID?.trim();
  if (!team) return new Response("Not found", { status: 404 });

  return Response.json(
    {
      applinks: {
        details: [
          {
            appIDs: [`${team}.com.karrigo.partner`],
            components: [{ "/": "/partner" }, { "/": "/partner/*" }],
          },
          {
            appIDs: [`${team}.com.karrigo.eats`],
            components: [{ "/": "/eats" }, { "/": "/eats/*" }],
          },
        ],
      },
    },
    { headers: { "content-type": "application/json", "cache-control": "public, max-age=3600" } },
  );
}
