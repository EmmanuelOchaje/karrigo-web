export const OPS_THEME_COOKIE = "karrigo_ops_theme";

export type OpsTheme = "dark" | "light";

/**
 * Dark by default, and the default matters: a dispatcher runs this from 08:00
 * to 22:00, and the back half of that shift is in the dark. Light is there for
 * whoever is doing it beside a window.
 */
export const DEFAULT_OPS_THEME: OpsTheme = "dark";

export function readOpsTheme(value: string | undefined): OpsTheme {
  return value === "light" ? "light" : DEFAULT_OPS_THEME;
}

/**
 * The choice lives in a cookie rather than localStorage so the server renders
 * the right palette first time. localStorage would mean either a flash of the
 * wrong theme or an inline script racing the paint, and this dashboard is
 * looked at all day — a white flash at 21:00 is not a small thing.
 *
 * Readable by script on purpose: it is a display preference, not a session.
 */
export const OPS_THEME_MAX_AGE = 60 * 60 * 24 * 365;
