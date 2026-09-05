import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { kitchens } from "@/lib/fixtures";

export const metadata = {
  title: "Photo credits — M-Kart",
  description: "Photographers and licences for the images used on this site.",
};

export default function CreditsPage() {
  return (
    <>
      <SiteNav />

      <section className="px-screen-x mx-auto w-full max-w-[1100px] py-xxl">
        <h1 className="text-section-small md:text-section">Photo credits</h1>
        <p className="text-lede text-text-secondary mt-sm max-w-[62ch]">
          These are placeholder photographs, used under Creative Commons
          licences while we photograph the real kitchens. They show the dishes,
          not the specific kitchen listed beside them.
        </p>

        <ul className="mt-lg gap-md flex flex-col">
          {kitchens.map((kitchen) => (
            <li
              key={kitchen.slug}
              className="border-border rounded-card p-md border"
            >
              <p className="text-h3">{kitchen.name}</p>
              <p className="text-site-body text-text-secondary mt-xs">
                Photograph by {kitchen.credit.artist}, licensed{" "}
                {kitchen.credit.license}.{" "}
                <a
                  href={kitchen.credit.source}
                  className="text-accent-text underline"
                  rel="noreferrer"
                >
                  Source on Wikimedia Commons
                </a>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </>
  );
}
