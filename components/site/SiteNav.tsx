import Link from "next/link";
import { Logo } from "./Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";

const links = [
  { href: "/kitchens", label: "Kitchens" },
  { href: "/areas", label: "Areas" },
  { href: "/partners", label: "Restaurants" },
  { href: "/partners#riders", label: "Riders" },
];

/**
 * One floating pill, not a bar: logo, links, log in and the CTA all sit
 * inside a single themed capsule that floats on the page background, rather
 * than framing the page edge to edge. `Screen` here themes just the pill
 * (an island), not a full-width strip — the page behind it keeps its own
 * background.
 */
export function SiteNav({ mode = "light" }: { mode?: "light" | "dark" }) {
  return (
    <div className="px-screen-x pt-md">
      <Screen
        mode={mode}
        className="rounded-pill gap-lg mx-auto flex max-w-[1240px] items-center py-sm pr-md pl-xxl shadow-[0_12px_30px_-14px_rgba(14,15,13,0.55)]"
      >
        <Logo />

        <div className="mx-auto hidden items-center md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-nav-link text-text/72 rounded-pill hover:bg-text/10 hover:text-text px-md py-sm transition-colors duration-(--duration-fast)"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center md:ml-0">
          <ButtonLink
            href="/kitchens"
            variant="accent"
            size="site"
            className="whitespace-nowrap"
          >
            Order now
          </ButtonLink>
        </div>
      </Screen>
    </div>
  );
}
