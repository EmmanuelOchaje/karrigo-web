/**
 * Android's counterpart to the AASA file: proves this host and each app
 * belong together, which turns on verified App Links for the intent filters
 * in the apps' app.config.ts. The fingerprints are the SHA-256 of each app's
 * release signing certificate (EAS: `eas credentials -p android`; or Play
 * Console > App signing). Comma-separate several to cover both an upload key
 * and Play's app-signing key. An app with no fingerprint is left out, and
 * with none at all this 404s.
 */
const APPS = [
  { packageName: "com.karrigo.partner", env: "ANDROID_SHA256_PARTNER" },
  { packageName: "com.karrigo.eats", env: "ANDROID_SHA256_EATS" },
] as const;

export function GET() {
  const entries = APPS.flatMap(({ packageName, env }) => {
    const fingerprints = (process.env[env] ?? "")
      .split(",")
      .map((f) => f.trim().toUpperCase())
      .filter(Boolean);
    return fingerprints.length
      ? [
          {
            relation: ["delegate_permission/common.handle_all_urls"],
            target: {
              namespace: "android_app",
              package_name: packageName,
              sha256_cert_fingerprints: fingerprints,
            },
          },
        ]
      : [];
  });
  if (!entries.length) return new Response("Not found", { status: 404 });

  return Response.json(entries, {
    headers: { "content-type": "application/json", "cache-control": "public, max-age=3600" },
  });
}
