"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { say } from "@/lib/admin/store";

/** How often the panel re-reads itself. karrigo-be has no push for browsers,
 *  so this is what keeps a queue honest without anyone pressing refresh. */
const POLL_MS = 20_000;

type Counts = { kitchens: number; riders: number; issues: number };

const NEWS: Record<keyof Counts, (n: number) => string> = {
  kitchens: (n) => (n === 1 ? "A new kitchen is waiting for approval" : `${n} new kitchens are waiting for approval`),
  riders: (n) => (n === 1 ? "A new rider is waiting for review" : `${n} new riders are waiting for review`),
  issues: (n) => (n === 1 ? "A new issue has come in" : `${n} new issues have come in`),
};

/**
 * Keeps every ops page current: the sidebar badges, the approval queues, the
 * boards. It re-renders the server components in place, so a selected row, an
 * open tab or a half-typed note stays as it was. Paused while the tab is in
 * the background, and caught up the moment it comes back.
 */
export function LiveRefresh({ counts }: { counts: Counts }) {
  const router = useRouter();
  const before = useRef<Counts | null>(null);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const poll = setInterval(refresh, POLL_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(poll);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router]);

  const { kitchens, riders, issues } = counts;
  useEffect(() => {
    const now = { kitchens, riders, issues };
    const was = before.current;
    before.current = now;
    // The first look is not news: those were already waiting.
    if (!was) return;
    for (const key of ["kitchens", "riders", "issues"] as const) {
      if (now[key] > was[key]) return say(NEWS[key](now[key] - was[key]));
    }
  }, [kitchens, riders, issues]);

  return null;
}
