"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { KitchenCard } from "@/components/site/KitchenCard";
import { Eyebrow } from "@/components/site/Eyebrow";
import { fromPriceKobo, kitchens } from "@/lib/fixtures";
import { setDelivery, useOrderState } from "@/lib/order/store";
import { cn } from "@/lib/cn";

/** Spelled out so Tailwind sees each class name. */
const stagger = ["rise-1", "rise-2", "rise-3", "rise-4", "rise-5", "rise-6"];

const categories = ["All", ...new Set(kitchens.map((k) => k.category))];

/**
 * Search and category chips over the kitchen grid. Search matches kitchen
 * names, cuisines and dishes, so "egusi" finds every kitchen that cooks it.
 */
/** The homepage's address form lands here with ?address=. Keep it as the
 *  landmark so checkout and the header already know where the food goes.
 *  Read in the browser, not on the server, so /kitchens stays a static page
 *  that links can prefetch in full. */
function AddressFromQuery() {
  const address = useSearchParams().get("address")?.trim();
  useEffect(() => {
    if (address) setDelivery({ landmark: address });
  }, [address]);
  return null;
}

export function KitchensBrowser() {
  const { user } = useOrderState();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");


  const q = query.trim().toLowerCase();
  const shown = kitchens.filter(
    (kitchen) =>
      (category === "All" || kitchen.category === category) &&
      (!q ||
        [kitchen.name, kitchen.cuisine, kitchen.area, ...kitchen.menu.map((d) => d.name)]
          .join(" ")
          .toLowerCase()
          .includes(q)),
  );

  return (
    <div className="mx-auto max-w-[1240px]">
      <Suspense fallback={null}>
        <AddressFromQuery />
      </Suspense>
      <div className="gap-lg flex flex-wrap items-end justify-between">
        <div>
          <Eyebrow className="rise">
            {user ? `Hi ${user.name.split(" ")[0]} · open right now` : "Open right now"}
          </Eyebrow>
          <h1 className="text-section-small md:text-section rise rise-1 mt-md">
            Kitchens in Makurdi
          </h1>
        </div>

        <label className="bg-bg rounded-pill gap-sm flex min-w-[240px] flex-[0_1_380px] items-center py-xs pr-xs pl-lg">
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="stroke-text-tertiary size-[16px] shrink-0 fill-none stroke-[2.4]"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="sr-only">Search kitchens and dishes</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search egusi, jollof, suya…"
            className="text-site-body placeholder:text-text-secondary min-w-0 flex-1 bg-transparent py-sm outline-none"
          />
        </label>
      </div>

      <div className="gap-sm mt-xl mb-xxl flex flex-wrap" role="group" aria-label="Filter by food">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            data-theme={category === c ? "dark" : undefined}
            className={cn(
              "rounded-pill text-nav-link px-lg py-sm font-bold transition-colors duration-(--duration-fast)",
              category === c ? "bg-bg text-accent-text" : "bg-bg text-text hover:bg-surface-raised",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        <div className="gap-xl grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((kitchen, i) => (
            <div key={kitchen.slug} className={cn("rise", stagger[i])}>
              <KitchenCard kitchen={kitchen} fromKobo={fromPriceKobo(kitchen)} priority={i < 4} />
            </div>
          ))}
        </div>
      ) : (
        <p className="bg-bg rounded-panel-sm text-site-body text-text-secondary p-xxl text-center font-semibold">
          {q
            ? `No kitchen serves “${query.trim()}” yet. Try jollof, suya or egusi.`
            : `No ${category.toLowerCase()} kitchens are open right now.`}
        </p>
      )}
    </div>
  );
}
