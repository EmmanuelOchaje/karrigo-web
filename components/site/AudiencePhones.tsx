import { PhoneFrame } from "./PhoneFrame";
import { Screen } from "@/components/ui/Screen";
import { formatKobo } from "@/lib/money";

/**
 * The restaurant's incoming-order screen, from design/mkart-restaurant-phone.html.
 * It is the best argument the section can make: the commission is shown as a
 * number the kitchen actually receives, not as a percentage.
 */
export function RestaurantPhone() {
  return (
    <PhoneFrame mode="light">
      <div className="px-md mt-sm flex min-h-0 flex-1 flex-col">
        <p className="text-micro text-accent-text font-semibold tracking-[0.1em] uppercase">
          New order
        </p>
        <h3 className="text-h3 mt-xs">Order 1042 · High Level</h3>

        <div className="border-border mt-sm gap-xs flex flex-col border-b pb-sm">
          {[
            ["Pounded yam & egusi", 330000],
            ["Catfish pepper soup", 350000],
            ["2× chilled zobo", 80000],
          ].map(([label, kobo]) => (
            <div key={label as string} className="text-micro flex justify-between">
              <span>{label}</span>
              <span className="font-semibold">{formatKobo(kobo as number)}</span>
            </div>
          ))}
        </div>

        <div className="text-micro mt-sm flex justify-between">
          <span className="text-text-secondary">Order total</span>
          <span>{formatKobo(760000)}</span>
        </div>

        <div className="bg-surface rounded-card mt-sm p-sm">
          <div className="text-micro text-text-secondary">You receive</div>
          <div className="text-h3 text-accent-text">{formatKobo(646000)}</div>
        </div>

        <div className="mt-auto mb-sm">
          <div className="bg-accent text-on-accent rounded-pill text-micro py-sm text-center font-semibold">
            Accept · ready in 25 min
          </div>
          <div className="text-micro text-text-secondary mt-xs text-center">
            Can&apos;t cook it
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

/**
 * The rider's trip screen. The rider app is not designed yet, so this is
 * marketing furniture built from the terms in the copy — it is not a spec.
 */
export function RiderPhone() {
  return (
    <PhoneFrame mode="dark">
      <div className="px-md mt-sm flex min-h-0 flex-1 flex-col">
        <p className="text-micro text-accent-text font-semibold tracking-[0.1em] uppercase">
          Trip offered
        </p>
        <h3 className="text-h3 mt-xs">{formatKobo(70000)} · 3.2 km</h3>

        <div className="mt-md gap-sm flex flex-col">
          <div className="gap-sm flex items-start">
            <span className="bg-accent mt-[3px] size-[9px] shrink-0 rounded-full" />
            <div>
              <div className="text-micro font-semibold">Terkimbi&apos;s Kitchen</div>
              <div className="text-micro text-text-secondary">
                Wurukum · ready in 8 min
              </div>
            </div>
          </div>
          <div className="border-border-strong ml-[4px] h-[18px] border-l" />
          <div className="gap-sm flex items-start">
            <span className="border-border-strong mt-[3px] size-[9px] shrink-0 rounded-full border-2" />
            <div>
              <div className="text-micro font-semibold">Behind BSU main gate</div>
              <div className="text-micro text-text-secondary">High Level</div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-card mt-md p-sm">
          <div className="text-micro text-text-secondary">Earned today</div>
          <div className="text-h3 text-accent-text">{formatKobo(840000)}</div>
          <div className="text-micro text-text-secondary mt-xs">
            12 trips · paid Friday
          </div>
        </div>

        <div className="mt-auto mb-sm">
          <div className="bg-accent text-on-accent rounded-pill text-micro py-sm text-center font-semibold">
            Accept trip
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

/**
 * The push notification a kitchen actually gets when an order lands. It floats
 * in front of the device rather than inside it, because that is where a
 * notification lives — over whatever you were already looking at.
 */
export function OrderNotification() {
  return (
    <Screen
      mode="light"
      className="rounded-card w-[236px] p-md shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="gap-sm flex items-start">
        <span className="bg-accent text-on-accent grid size-[26px] shrink-0 place-items-center rounded-[8px] text-[13px]">
          🔔
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-micro text-text-secondary flex items-center justify-between">
            <span className="font-semibold tracking-[0.08em] uppercase">
              M-Kart
            </span>
            <span>now</span>
          </div>
          <div className="text-h3 mt-[2px]">New order · {formatKobo(760000)}</div>
          <div className="text-micro text-text-secondary mt-[1px]">
            High Level · accept within 3 min
          </div>
        </div>
      </div>
    </Screen>
  );
}
