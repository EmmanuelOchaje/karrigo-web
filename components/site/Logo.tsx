import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/** Light grounds get the near-black lockup; dark grounds get the lime tile and
 *  cream wordmark, which would vanish on white. */
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
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="Karrigo home"
    >
      <Image
        src={lockup.src}
        alt=""
        width={lockup.width}
        height={lockup.height}
        priority
        className="h-logo w-auto"
      />
    </Link>
  );
}
