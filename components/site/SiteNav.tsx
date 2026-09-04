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
 * The home page sits on a dark hero, so its nav is dark. Every other marketing
 * page is light. Same markup either way — only the theme underneath changes.
 */
export function SiteNav({ mode = "light" }: { mode?: "light" | "dark" }) {
  return (
    <Screen mode={mode} className="border-border border-b">
      <nav className="px-screen-x gap-xl mx-auto flex max-w-[1100px] items-center py-md">
        <Logo />

        <div className="gap-xl text-site-body text-text-secondary hidden md:flex">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-text">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="gap-md ml-auto flex items-center">
          <Link
            href="/login"
            className="text-site-body text-text-secondary hover:text-text hidden sm:block"
          >
            Log in
          </Link>
          <ButtonLink
            href="/kitchens"
            variant={mode === "dark" ? "accent" : "dark"}
            size="sm"
          >
            Order now
          </ButtonLink>
        </div>
      </nav>
    </Screen>
  );
}
