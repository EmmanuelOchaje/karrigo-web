import { steps } from "@/lib/fixtures";

/**
 * Four step cards, one reading as "current" at a time on a loop — pure CSS
 * (`step-cycle` in globals.css), each card offset by a quarter of the cycle
 * via the --step-delay custom property. No client component needed.
 *
 * The delay counts up, so the highlight runs 1-2-3-4 and round again. A
 * negative delay would start each card that far *into* the cycle, which runs
 * the sweep backwards.
 */
export function StepsGrid() {
  return (
    <div className="gap-lg grid sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <div
          key={step.title}
          style={{ "--step-delay": `${index * 2.4}s` } as React.CSSProperties}
          className="step-cycle rounded-step p-xl md:p-xxl"
        >
          <span className="bg-accent text-on-accent text-site-label grid size-[40px] place-items-center rounded-full font-extrabold">
            {index + 1}
          </span>
          <h3 className="text-site-title mt-lg">{step.title}</h3>
          <p className="text-site-body mt-sm opacity-72 text-pretty">
            {step.body}
          </p>
        </div>
      ))}
    </div>
  );
}
