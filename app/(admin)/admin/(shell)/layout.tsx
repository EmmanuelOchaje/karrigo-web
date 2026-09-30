import { Sidebar } from "@/components/admin/Sidebar";
import { OpsToast } from "@/components/admin/OpsToast";
import { requireAdmin } from "@/lib/admin/session";
import { OPS_THEME_COOKIE, readOpsTheme } from "@/lib/admin/theme";

import { cookies } from "next/headers";

import { signOut } from "../actions";

/**
 * Every page inside this group is behind `requireAdmin()`. The check runs on
 * the server on each render, so a stale tab whose session has expired lands
 * on the sign-in screen rather than showing a board it can no longer act on.
 */
export default async function OpsShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  const theme = readOpsTheme((await cookies()).get(OPS_THEME_COOKIE)?.value);

  return (
    <div className="grid min-h-screen grid-cols-[clamp(196px,17vw,232px)_minmax(0,1fr)]">
      <Sidebar admin={admin} theme={theme} signOut={signOut} />
      <main data-ops-main className="min-w-0">
        {children}
      </main>
      <OpsToast />
    </div>
  );
}
