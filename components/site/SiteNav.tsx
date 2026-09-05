import Link from "next/link";
import { Logo } from "./Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";

const links = [
  { href: "/kitchens", label: "Kitchens" },
  { href: "/areas", label: "Areas" },
  { href: "/partners", label: "For restaurants" },
  { href: "/partners#riders", label: "Ride with us" },
];

/**
 * Floating pill nav: no bar, no rule under it — the links sit in their own
 * raised group so the nav reads as sitting on the page rather than framing it.
 * The home page's nav is dark because it sits on the dark hero; every other
 * marketing page is light. Same markup either way.
 */
export function SiteNav({ mode = "light" }: { mode?: "light" | "dark" }) {
  return (
    <Screen mode={mode}>
      <nav className="px-screen-x gap-md mx-auto flex max-w-[1180px] items-center py-lg">
        <Logo />

        <div className="bg-surface rounded-pill gap-xl text-site-body text-text-secondary mx-auto hidden items-center px-xl py-md md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-text transition-colors duration-(--duration-fast)"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="gap-sm ml-auto flex items-center md:ml-0">
          <Link
            href="/login"
            className="bg-surface rounded-pill text-site-body text-text-secondary hover:text-text hidden px-lg py-md transition-colors duration-(--duration-fast) sm:block"
          >
            Log in
          </Link>
          <ButtonLink
            href="/kitchens"
            variant={mode === "dark" ? "accent" : "dark"}
          >
            Order now
          </ButtonLink>
        </div>
      </nav>
    </Screen>
  );
}
