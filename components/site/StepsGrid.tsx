import { steps } from "@/lib/fixtures";

/**
 * Four step cards, one reading as "current" at a time on a loop — pure CSS
 * (`step-dash` and `step-fill` in globals.css), each card offset by a quarter
 * of the cycle via the --step-delay custom property. No client component.
 *
 * The highlight wipes out of one card's right edge as it wipes into the next
 * card's left, so it reads as a single dark block crossing the row. The delay
 * counts up, so that runs 1-2-3-4 and round again; a negative delay would
 * start each card that far *into* the cycle, which runs the sweep backwards.
 */
export function StepsGrid() {
  return (
    <div className="gap-lg grid sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <div
          key={step.title}
          style={{ "--step-delay": `${index * 2.4}s` } as React.CSSProperties}
          className="step-dash step-fill bg-bg rounded-step p-xl md:p-xxl"
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
