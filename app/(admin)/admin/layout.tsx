import type { Metadata } from "next";
import { cookies } from "next/headers";

import { OPS_THEME_COOKIE, readOpsTheme } from "@/lib/admin/theme";

import "./admin.css";

export const metadata: Metadata = {
  title: "Karrigo Operations",
  description: "Internal. Live orders, kitchens, riders and money across Karrigo.",
  robots: { index: false, follow: false },
};

/**
 * The ops surface. `data-theme` sits on this wrapper rather than on <html>,
 * so the palette is chosen on the server and the marketing site's own theme
 * is left alone — the two share a root layout.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = readOpsTheme((await cookies()).get(OPS_THEME_COOKIE)?.value);

  return (
    <div
      data-ops
      data-theme={theme}
      className="bg-ops-bg text-text min-h-screen flex-1 [font-variant-numeric:tabular-nums]"
    >
      {children}
    </div>
  );
}
