import Image from "next/image";
import { PhoneFrame } from "./PhoneFrame";
import { kitchens } from "@/lib/fixtures";
import { formatKobo } from "@/lib/money";

function BrowseScreen() {
  return (
    <>
      <div className="px-md pt-sm">
        <div className="text-micro gap-xs flex items-center font-semibold">
          <span className="bg-accent text-on-accent grid size-[16px] place-items-center rounded-[5px] text-[7px]">
            ⌖
          </span>
          Behind BSU main gate
          <span className="text-text-secondary">▾</span>
        </div>
        <div className="bg-surface rounded-pill text-micro text-text-tertiary mt-sm px-md py-xs">
          Search egusi, jollof, suya…
        </div>
      </div>

      <div className="px-md mt-sm min-h-0 flex-1 overflow-hidden">
        <p className="text-micro text-text-secondary font-semibold">
          7 kitchens · closest first
        </p>
        {kitchens.slice(0, 4).map((kitchen) => (
          <div
            key={kitchen.slug}
            className="border-border gap-sm flex items-center border-b py-sm last:border-b-0"
          >
            <div className="bg-surface relative size-[30px] shrink-0 overflow-hidden rounded-[8px]">
              <Image
                src={kitchen.image}
                alt=""
                fill
                sizes="30px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-micro font-semibold">{kitchen.name}</div>
              <div className="text-micro text-text-secondary truncate">
                {kitchen.cuisine}
              </div>
              <div className="text-micro gap-xs mt-[1px] flex items-center">
                <span className="text-accent-text font-semibold">
                  {kitchen.distanceKm} km
                </span>
                <span className="text-text-secondary">
                  · {kitchen.etaMinutes[0]}–{kitchen.etaMinutes[1]} min
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-border text-micro mt-auto flex justify-around border-t pt-sm pb-xs">
        <span className="font-semibold">Home</span>
        <span className="text-text-tertiary">Search</span>
        <span className="text-text-tertiary">Orders</span>
        <span className="text-text-tertiary">Account</span>
      </div>
    </>
  );
}

function TrackingScreen() {
  return (
    <div className="px-md mt-sm flex min-h-0 flex-1 flex-col">
      <p className="text-micro text-text-secondary font-semibold tracking-[0.1em] uppercase">
        Order 1042
      </p>
      <h3 className="text-h3 mt-xs">Arriving about 6:41 PM</h3>
      <p className="text-micro text-text-secondary mt-xs">
        Doosuur is 14 minutes away, heading to High Level.
      </p>

      <div className="gap-xs my-md flex items-center">
        <span className="bg-accent text-on-accent grid size-[17px] place-items-center rounded-full text-[8px]">
          ✓
        </span>
        <span className="bg-accent h-[2px] flex-1 rounded-full" />
        <span className="bg-accent text-on-accent grid size-[17px] place-items-center rounded-full text-[8px]">
          ✓
        </span>
        <span className="bg-accent h-[2px] flex-1 rounded-full" />
        <span className="bg-accent text-on-accent grid size-[17px] place-items-center rounded-full text-[8px]">
          🛵
        </span>
        <span className="bg-surface-raised h-[2px] flex-1 rounded-full" />
        <span className="bg-surface-raised text-text-tertiary grid size-[17px] place-items-center rounded-full text-[8px]">
          ⌂
        </span>
      </div>

      <div className="bg-surface rounded-card min-h-0 flex-1 overflow-hidden">
        <svg
          viewBox="0 0 200 150"
          preserveAspectRatio="xMidYMid slice"
          className="size-full"
        >
          <g className="stroke-surface-raised" strokeWidth="9" strokeLinecap="round">
            <path d="M-10 34 L210 28" />
            <path d="M-10 96 L210 90" />
            <path d="M34 -10 L42 160" />
            <path d="M132 -10 L140 160" />
          </g>
          <g className="fill-surface-raised">
            <rect x="52" y="42" width="24" height="26" rx="3" />
            <rect x="96" y="40" width="26" height="28" rx="3" />
            <rect x="56" y="104" width="22" height="24" rx="3" />
          </g>
          <path
            d="M138 46 L138 78 L88 84 L88 118 L44 124"
            fill="none"
            className="stroke-text"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="138" cy="46" r="6" className="fill-bg stroke-text" strokeWidth="3" />
          <circle cx="44" cy="124" r="5" className="fill-accent stroke-text" strokeWidth="2.5" />
        </svg>
      </div>

      <div className="mt-sm">
        <p className="text-micro text-text-secondary">
          Pounded yam &amp; egusi, catfish pepper soup, 2× chilled zobo
        </p>
        <p className="text-micro mt-xs font-semibold">
          {formatKobo(760000)} · paid by card
        </p>
      </div>

      <div className="border-border gap-sm mt-sm mb-sm flex items-center border-t pt-sm">
        <div className="bg-surface text-micro text-text-secondary grid size-[28px] place-items-center rounded-full font-semibold">
          DT
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-micro font-semibold">Doosuur Terhemba</div>
          <div className="text-micro text-text-secondary">Your rider · ★ 4.9</div>
        </div>
        <span className="bg-accent text-on-accent rounded-pill text-micro px-sm py-xs font-semibold">
          Call
        </span>
      </div>
    </div>
  );
}

/**
 * Two devices, not one: browsing and tracking are the two halves of the promise
 * in the headline. Showing both is what makes "follow your rider" concrete.
 */
export function HeroPhones() {
  return (
    // Three nested wrappers because each owns a transform and they would
    // otherwise overwrite one another: the outer tilts, the middle buzzes
    // forever, and PhoneFrame itself carries the entrance animation.
    <div className="flex items-end justify-center">
      <div className="origin-bottom z-10 -rotate-[7deg]">
        <div className="buzz">
          <PhoneFrame mode="light" className="rise rise-5">
            <BrowseScreen />
          </PhoneFrame>
        </div>
      </div>

      <div className="origin-bottom -ml-xxl hidden rotate-[7deg] sm:block">
        <div className="buzz buzz-offset">
          <PhoneFrame mode="dark" className="rise rise-6">
            <TrackingScreen />
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}
