import { cn } from "@/lib/cn";
import { modeByScreen } from "@/theme";

type Mode = "light" | "dark";
type ScreenName =
  | (typeof modeByScreen.dark)[number]
  | (typeof modeByScreen.light)[number];

const modeFor = (name: ScreenName): Mode =>
  (modeByScreen.dark as readonly string[]).includes(name) ? "dark" : "light";

/**
 * Sets the palette for a screen. v1 ignores the system preference entirely —
 * mode is a property of the screen's purpose, listed in theme.ts.
 */
export function Screen({
  name,
  mode,
  className,
  children,
}: {
  name?: ScreenName;
  mode?: Mode;
  className?: string;
  children: React.ReactNode;
}) {
  const resolved = mode ?? (name ? modeFor(name) : "light");

  return (
    <div
      data-theme={resolved}
      className={cn("bg-bg text-text", className)}
    >
      {children}
    </div>
  );
}
