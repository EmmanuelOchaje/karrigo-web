import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/** Light grounds get the near-black lockup; dark grounds get the lime tile and
 *  cream wordmark, which would vanish on white. A `light` logo also swaps to
 *  the dark lockup when the page itself is in dark mode. */
const lockups = {
  light: { src: "/brand/karrigo-logo.png", width: 932, height: 288 },
  dark: { src: "/brand/karrigo-logo-dark.png", width: 374, height: 116 },
} as const;

export function Logo({
  mode = "light",
  className,
}: {
  mode?: "light" | "dark";
  className?: string;
}) {
  const lockup = lockups[mode];
  const image = (l: (typeof lockups)[keyof typeof lockups], extra?: string, priority = true) => (
    <Image
      src={l.src}
      alt=""
      width={l.width}
      height={l.height}
      priority={priority}
      className={cn("h-logo w-auto", extra)}
    />
  );

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="Karrigo home"
    >
      {image(lockup, mode === "light" ? "logo-on-light" : undefined)}
      {/* A light-ground logo must still read when the whole page goes dark, so
          the light lockup carries a dark twin that globals.css swaps in. It is
          never displayed (so never fetched) in light mode. */}
      {mode === "light" && image(lockups.dark, "logo-on-dark", false)}
    </Link>
  );
}
