import { faqs } from "@/lib/fixtures";

/** Native <details> — accordion behaviour with no client JavaScript. */
export function FaqList() {
  return (
    <div className="mt-lg">
      {faqs.map((faq) => (
        <details key={faq.q} className="border-border group border-b py-md">
          <summary className="text-h2 gap-md flex cursor-pointer list-none items-center">
            {faq.q}
            <span
              aria-hidden
              className="text-text-tertiary ml-auto text-xl leading-none group-open:hidden"
            >
              +
            </span>
            <span
              aria-hidden
              className="text-text-tertiary ml-auto hidden text-xl leading-none group-open:block"
            >
              −
            </span>
          </summary>
          <p className="text-site-body text-text-secondary mt-sm max-w-[70ch]">
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  );
}
