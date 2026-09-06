import { faqs } from "@/lib/fixtures";

/** Native <details> — accordion behaviour with no client JavaScript. */
export function FaqList() {
  return (
    <div className="gap-sm flex flex-col">
      {faqs.map((faq) => (
        <details
          key={faq.q}
          className="group bg-bg border-border rounded-card hover:border-border-strong open:border-border-strong border px-lg py-md transition-colors duration-(--duration-fast)"
        >
          <summary className="text-h2 gap-md flex cursor-pointer list-none items-center">
            {faq.q}
            {/* One glyph, not two: the plus rotates into a cross when open. */}
            <span
              aria-hidden
              className="text-text-tertiary group-open:text-accent-text ml-auto shrink-0 text-xl leading-none transition-transform duration-(--duration-normal) group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="text-site-body text-text-secondary mt-sm">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
