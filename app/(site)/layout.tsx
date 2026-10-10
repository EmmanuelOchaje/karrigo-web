import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

/** The marketing site's inner pages — areas, help, contact and the legal
 *  pages — in the same frame as the homepage: floating nav, footer panel. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="bg-surface grow">
      <SiteNav mode="dark" />
      {children}
      <SiteFooter />
    </div>
  );
}
