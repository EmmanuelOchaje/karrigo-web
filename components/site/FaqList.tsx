import { faqs } from "@/lib/fixtures";

/** Native <details> — accordion behaviour with no client JavaScript. */
export function FaqList() {
  return (
    <div className="gap-sm flex flex-col">
      {faqs.map((faq) => (
        <details
          key={faq.q}
          className="faq-item group bg-bg rounded-panel-xs px-xl py-xs"
        >
          <summary className="text-site-question gap-md flex cursor-pointer list-none items-center justify-between py-lg">
            {faq.q}
            {/* One glyph, not two: the plus rotates into a cross when open. */}
            <span
              aria-hidden
              className="bg-surface text-accent-text text-site-question grid size-[26px] flex-none place-items-center rounded-full leading-none transition-transform duration-(--duration-normal) group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="text-site-answer text-text-secondary mb-lg max-w-[52ch]">
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  );
}
