import Link from "next/link";

import { Logo } from "@/components/site/Logo";

/**
 * Signing in to a partner account. Deliberately without the ordering
 * header: a kitchen owner logging in has no cart and no delivery address,
 * and showing them one is how the page ends up looking like a customer's.
 */
export default function PartnerAuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="bg-surface grow">
      <header className="px-screen-x gap-md mx-auto flex max-w-[1240px] items-center justify-between py-lg">
        <Logo />
        <Link
          href="/kitchens"
          className="text-text-secondary hover:text-text text-nav-link font-bold transition-colors duration-(--duration-fast)"
        >
          Order food instead →
        </Link>
      </header>
      <main className="px-screen-x pt-lg pb-section-sm">{children}</main>
    </div>
  );
}
