import { cookies } from "next/headers";

import { OpsShell } from "@/components/admin/OpsShell";
import { OpsToast } from "@/components/admin/OpsToast";
import { requireAdmin } from "@/lib/admin/session";
import { OPS_THEME_COOKIE, readOpsTheme } from "@/lib/admin/theme";

import { signOut } from "../actions";

/**
 * Every page inside this group is behind `requireAdmin()`. The check runs on
 * the server on each render, so a stale tab whose session has expired lands
 * on the sign-in screen rather than showing a board it can no longer act on.
 */
export default async function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  const theme = readOpsTheme((await cookies()).get(OPS_THEME_COOKIE)?.value);

  return (
    <>
      <OpsShell admin={admin} theme={theme} signOut={signOut}>
        {children}
      </OpsShell>
      <OpsToast />
    </>
  );
}
