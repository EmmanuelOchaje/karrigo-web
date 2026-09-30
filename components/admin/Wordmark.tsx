import { cn } from "@/lib/cn";

/** The lockup in the sidebar and on the sign-in screen. "Operations" under
 *  the wordmark is how ops tells at a glance that this is not the customer
 *  site — the two look alike and one of them can refund money. */
export function Wordmark({ size = 30 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 56 56"
        aria-hidden
        className="flex-none"
      >
        <rect width="56" height="56" rx="16" fill="#C6F432" />
        <path
          d="M15 22h26l-2.6 20.5a2.5 2.5 0 0 1-2.5 2.2H20.1a2.5 2.5 0 0 1-2.5-2.2Z"
          fill="#0E0F0D"
        />
        <path
          d="M22 24v-4a6 6 0 0 1 12 0v4"
          stroke="#0E0F0D"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex flex-col gap-[3px]">
        <span
          className={cn(
            "text-text leading-none font-extrabold tracking-[-0.055em]",
            size > 34 ? "text-[24px]" : "text-[19px]",
          )}
        >
          karrigo
        </span>
        <span className="text-text/55 text-[10.5px] leading-none font-semibold tracking-[0.12em] uppercase">
          Operations
        </span>
      </span>
    </span>
  );
}
