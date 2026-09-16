import Image from "next/image";
import { PhoneFrame } from "./PhoneFrame";
import { kitchens } from "@/lib/fixtures";

function BrowseScreen() {
  return (
    <>
      <div className="px-xl pt-sm gap-sm text-h2 flex items-center font-bold">
        <span className="bg-accent grid size-[20px] place-items-center rounded-full">
          <span className="bg-on-accent block size-[6px] rounded-full" />
        </span>
        Behind BSU main gate ▾
      </div>

      <div className="mx-xl bg-surface-raised text-body-med text-text-secondary mt-lg rounded-[16px] px-lg py-md">
        Search egusi, jollof, suya…
      </div>

      <p className="px-xl text-caption text-accent-text pt-xxl pb-sm font-bold">
        7 kitchens · closest first
      </p>

      <div className="px-xl gap-lg flex flex-col">
        {kitchens.slice(0, 4).map((kitchen) => (
          <div key={kitchen.slug} className="gap-md flex min-w-0 items-center">
            <div className="bg-surface relative size-[64px] shrink-0 overflow-hidden rounded-chip">
              <Image
                src={kitchen.image}
                alt=""
                width={64}
                height={64}
                sizes="64px"
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-h2 truncate font-bold">{kitchen.name}</div>
              <div className="text-body-med text-text-secondary mt-[2px]">
                {kitchen.cuisine}
              </div>
              <div className="text-caption text-accent-text mt-[4px] font-bold">
                {kitchen.distanceKm} km · {kitchen.etaMinutes[0]}–
                {kitchen.etaMinutes[1]} min
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-xl border-text/10 text-label text-text-secondary mt-auto flex justify-between border-t py-lg font-semibold">
        <span className="text-text">Home</span>
        <span>Search</span>
        <span>Orders</span>
        <span>Account</span>
      </div>
    </>
  );
}

/** The route the rider takes from the kitchen to the gate — kept as one path
 *  string so the SVG stroke and the dot riding along it (via `offset-path`)
 *  trace the exact same line. Drawn for the 402×230 map panel. */
const ROUTE_PATH = "M26,34 L26,124 L166,124 L166,74 L292,74 L292,192 L380,192";

function TrackingScreen() {
  return (
    <>
      <p className="px-xl text-caption text-cream/50 pt-sm font-bold tracking-[0.06em] uppercase">
        Order 1042
      </p>
      <h3 className="px-xl text-display pt-sm font-extrabold">
        Arriving about 6:41 PM
      </h3>

      <div className="bg-surface relative mt-lg h-[230px] overflow-hidden">
        <svg viewBox="0 0 402 230" width="402" height="230" className="block">
          <path
            d={ROUTE_PATH}
            fill="none"
            stroke="rgba(255,255,255,.1)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={ROUTE_PATH}
            fill="none"
            className="stroke-accent"
            strokeWidth="2.5"
            strokeDasharray="8 9"
            opacity="0.75"
          />
          <circle cx="26" cy="34" r="6" className="fill-accent-warm" />
          <circle cx="380" cy="192" r="6" className="fill-accent" />
        </svg>
        <div
          aria-hidden
          className="ride bg-text absolute top-0 left-0 size-[16px] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_0_6px_rgba(198,244,50,0.3)]"
          style={{ offsetPath: `path('${ROUTE_PATH}')`, offsetRotate: "0deg" }}
        />
        <span className="bg-bg text-accent-warm rounded-pill text-label absolute top-[24px] left-[42px] px-md py-xs font-bold">
          Kitchen
        </span>
        <span className="bg-accent text-on-accent rounded-pill text-label absolute top-[150px] right-[14px] px-md py-xs font-bold whitespace-nowrap">
          Your gate
        </span>
      </div>

      <div className="px-xl border-text/10 gap-md flex items-center border-b py-lg">
        <span className="bg-accent text-on-accent text-h3 grid size-[48px] shrink-0 place-items-center rounded-full font-extrabold">
          DT
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-h2 block truncate font-bold">
            Doosuur Terhemba
          </span>
          <span className="text-body-med text-text/55 mt-[2px] block">
            Your rider · ★ 4.9
          </span>
        </span>
        <span className="bg-accent text-on-accent rounded-pill text-h3 px-xl py-sm font-bold">
          Call
        </span>
      </div>

      <div className="px-xl gap-md flex flex-col py-lg">
        <span className="text-h3 text-text/50 gap-md flex items-center font-semibold">
          <span className="bg-accent block size-[10px] shrink-0 rounded-full" />
          Order accepted · 6:08 PM
        </span>
        <span className="text-h3 text-text/50 gap-md flex items-center font-semibold">
          <span className="bg-accent block size-[10px] shrink-0 rounded-full" />
          Left the kitchen · 6:27 PM
        </span>
        <span className="text-h3 gap-md flex items-center font-bold">
          <span className="bg-accent route-pulse block size-[10px] shrink-0 rounded-full" />
          14 min from your gate
        </span>
      </div>

      <div className="mx-xl bg-accent/12 text-accent-text text-body-med mb-sm rounded-[16px] p-md text-center font-semibold">
        Share this tracking link
      </div>
    </>
  );
}

/**
 * Two devices, not one: browsing and tracking are the two halves of the promise
 * in the headline. Showing both is what makes "follow your rider" concrete.
 *
 * Both are positioned from the centre of a box whose size tracks the same
 * scale variable, so the pair stays centred and the hero column never has to
 * reserve room for the phones at their unscaled size.
 */
export function HeroPhones() {
  return (
    <div className="hero-phones relative w-full max-w-[calc(1010px*var(--phone-scale))] [height:calc(884px*var(--phone-scale))]">
      <div
        className="origin-bottom absolute bottom-0 left-[calc(50%-178px-197px*var(--phone-scale))] z-1 [transform:scale(var(--phone-scale))_rotate(-7deg)]"
      >
        <div className="buzz">
          <PhoneFrame mode="light">
            <BrowseScreen />
          </PhoneFrame>
        </div>
      </div>

      <div
        className="origin-bottom absolute bottom-0 left-[calc(50%-224px+197px*var(--phone-scale))] z-2 [transform:scale(var(--phone-scale))_rotate(7deg)]"
      >
        <div className="buzz buzz-offset">
          <PhoneFrame mode="dark">
            <TrackingScreen />
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}
