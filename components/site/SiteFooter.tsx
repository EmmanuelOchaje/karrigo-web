import Link from "next/link";
import { Logo } from "./Logo";
import { Screen } from "@/components/ui/Screen";
import { areasLive, cuisines, kitchens } from "@/lib/fixtures";

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
            <p className="text-site-label text-text-secondary mt-sm max-w-[28ch]">
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
                      className="text-site-body text-text-secondary hover:text-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Area, cuisine and kitchen links. These are here for local search as
            much as for navigation — people look for "jollof Wurukum". */}
        <div className="border-border gap-xl mt-xl grid border-t pt-lg sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h3 className="text-label text-text-tertiary tracking-[0.12em] uppercase">
              Areas
            </h3>
            <ul className="mt-sm gap-xs flex flex-wrap">
              {areasLive.map((area) => (
                <li key={area}>
                  <Link
                    href={`/areas#${area.toLowerCase().replace(/\s+/g, "-")}`}
                    className="bg-surface text-site-label text-text-secondary hover:text-text rounded-pill px-md py-xs inline-block"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-label text-text-tertiary tracking-[0.12em] uppercase">
              Food
            </h3>
            <ul className="mt-sm gap-xs flex flex-wrap">
              {cuisines.map((cuisine) => (
                <li key={cuisine}>
                  <Link
                    href="/kitchens"
                    className="bg-surface text-site-label text-text-secondary hover:text-text rounded-pill px-md py-xs inline-block"
                  >
                    {cuisine}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-label text-text-tertiary tracking-[0.12em] uppercase">
              Kitchens
            </h3>
            <ul className="mt-sm gap-xs flex flex-wrap">
              {kitchens.map((kitchen) => (
                <li key={kitchen.slug}>
                  <Link
                    href={`/k/${kitchen.slug}`}
                    className="bg-surface text-site-label text-text-secondary hover:text-text rounded-pill px-md py-xs inline-block"
                  >
                    {kitchen.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-caption text-text-tertiary border-border mt-xl border-t pt-lg">
          © {new Date().getFullYear()} M-Kart. Makurdi, Benue State, Nigeria.
        </p>
      </div>
    </Screen>
  );
}
