"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { Screen } from "@/components/ui/Screen";
import { logOut, priceCart, useOrderState } from "@/lib/order/store";
import { cn } from "@/lib/cn";

/**
 * The ordering flow's header: the site's floating pill, carrying where the
 * food is going and the cart instead of the marketing links. Once the page
 * scrolls, the strip behind it frosts so menu rows do not show through.
 */
export function OrderNav() {
  const { user, cart, landmark, address, order } = useOrderState();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = priceCart(cart)?.count ?? 0;
  const where = landmark || address;
  const hasLiveOrder = order !== null;

  return (
    <div
      className={cn(
        "px-screen-x sticky top-0 z-20 pt-md pb-md transition-[background-color,backdrop-filter] duration-(--duration-slow)",
        scrolled && "bg-surface/55 backdrop-blur-lg",
      )}
    >
      <Screen
        mode="dark"
        className="rounded-pill gap-sm mx-auto flex max-w-[1240px] items-center py-sm pr-sm pl-lg shadow-[0_12px_30px_-14px_rgba(14,15,13,0.55)]"
      >
        <Logo mode="dark" className="shrink-0" />

        <Link
          href="/kitchens"
          className="bg-text/8 hover:bg-text/16 text-text/80 rounded-pill text-label gap-sm ml-sm hidden min-w-0 items-center px-lg py-sm font-semibold transition-colors duration-(--duration-fast) sm:flex"
        >
          <span className="bg-accent size-[8px] shrink-0 rounded-full" />
          <span className="truncate">
            {where ? `Deliver to ${where}` : "Makurdi · Set address at checkout"}
          </span>
        </Link>

        <div className="gap-xs ml-auto flex shrink-0 items-center">
          {hasLiveOrder && (
            <Link
              href={`/track?order=${order.id}`}
              className="text-accent-text hover:bg-accent/12 rounded-pill text-nav-link hidden px-lg py-sm font-bold transition-colors duration-(--duration-fast) md:block"
            >
              Track order
            </Link>
          )}
          {user ? (
            <button
              type="button"
              onClick={logOut}
              className="text-text/75 hover:bg-text/10 hover:text-text rounded-pill text-nav-link hidden px-lg py-sm transition-colors duration-(--duration-fast) sm:block"
            >
              {user.name.split(" ")[0]} · Log out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-text/75 hover:bg-text/10 hover:text-text rounded-pill text-nav-link px-lg py-sm transition-colors duration-(--duration-fast)"
            >
              Log in
            </Link>
          )}
          <Link
            href="/checkout"
            className="bg-accent text-on-accent rounded-pill text-site-button gap-sm flex items-center py-sm pr-sm pl-lg transition-transform duration-(--duration-fast) hover:-translate-y-0.5"
          >
            Cart
            <span
              key={count}
              data-theme="dark"
              className="bg-bg text-accent-text rounded-pill text-label pop grid h-[22px] min-w-[22px] place-items-center px-xs font-bold"
            >
              {count}
            </span>
          </Link>
        </div>
      </Screen>
    </div>
  );
}
