import Link from "next/link";
import { Logo } from "./Logo";
import { Screen } from "@/components/ui/Screen";

const columns = [
  {
    heading: "Order",
    links: [
      { href: "/kitchens", label: "Kitchens" },
      { href: "/areas", label: "Areas we cover" },
      { href: "/help", label: "Help" },
    ],
  },
  {
    heading: "Partner",
    links: [
      { href: "/partners", label: "List your kitchen" },
      { href: "/partners#riders", label: "Ride with us" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/help#contact", label: "Contact" },
      { href: "/help#terms", label: "Terms" },
      { href: "/help#privacy", label: "Privacy" },
      { href: "/credits", label: "Photo credits" },
    ],
  },
];

export function SiteFooter() {
  return (
    <div className="px-screen-x mt-auto">
      <Screen mode="dark" className="rounded-t-panel-lg">
        <div className="px-xxl md:px-pad-card mx-auto max-w-[1240px] pt-xxl pb-xxl md:pt-pad-hero">
          <div className="gap-xl grid sm:grid-cols-2 md:grid-cols-4">
            <div>
              <Logo mode="dark" />
              <p className="text-site-answer text-cream/55 mt-lg max-w-[32ch]">
                Food delivery in Makurdi, Benue State. Cooked locally, carried
                by riders who know the roads.
              </p>
            </div>

            {columns.map((column) => (
              <div key={column.heading}>
                <h3 className="text-eyebrow text-accent-text tracking-[0.08em] uppercase">
                  {column.heading}
                </h3>
                <ul className="mt-lg gap-md flex flex-col">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-site-answer text-cream/70 hover:text-accent-text transition-colors duration-(--duration-fast)"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-site-label text-cream/50 border-text/10 mt-xl border-t pt-lg">
            © {new Date().getFullYear()} Karrigo. Makurdi, Benue State, Nigeria.
          </p>
        </div>
      </Screen>
    </div>
  );
}
