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
    ],
  },
];

export function SiteFooter() {
  return (
    <Screen mode="dark" className="mt-auto">
      <div className="px-screen-x mx-auto max-w-[1100px] py-xxl">
        <div className="gap-xl grid sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Logo />
            <p className="text-caption text-text-secondary mt-sm max-w-[28ch]">
              Food delivery in Makurdi, Benue State. Cooked locally, carried by
              riders who know the roads.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-label text-text-tertiary tracking-[0.12em] uppercase">
                {column.heading}
              </h3>
              <ul className="mt-sm gap-sm flex flex-col">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-body-med text-text-secondary hover:text-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-caption text-text-tertiary border-border mt-xl border-t pt-lg">
          © {new Date().getFullYear()} M-Kart. Makurdi, Benue State, Nigeria.
        </p>
      </div>
    </Screen>
  );
}
