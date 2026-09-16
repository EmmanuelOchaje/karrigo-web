import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * App store badges. The marks are monochrome and inherit the button's text
 * colour rather than shipping Google's four-colour Play triangle — one
 * imported brand palette on the page is enough, and these pills are ours.
 *
 * The hrefs are placeholders until the apps are listed — swap them for the
 * real store URLs when the listings go live.
 */
const stores = [
  {
    href: "#app-store",
    label: "App Store",
    tone: "solid" as const,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] fill-current">
        <path d="M17.05 12.53c-.02-2.4 1.96-3.55 2.05-3.61-1.12-1.63-2.86-1.86-3.48-1.88-1.48-.15-2.89.87-3.64.87-.75 0-1.91-.85-3.14-.83-1.61.02-3.1.94-3.93 2.38-1.68 2.91-.43 7.21 1.2 9.57.8 1.16 1.75 2.46 3 2.41 1.21-.05 1.67-.78 3.13-.78 1.46 0 1.87.78 3.14.76 1.3-.02 2.12-1.18 2.91-2.34.92-1.34 1.3-2.64 1.32-2.71-.03-.01-2.53-.97-2.56-3.84Z" />
        <path d="M14.66 5.5c.66-.8 1.11-1.91.99-3.02-.95.04-2.11.63-2.79 1.43-.61.71-1.15 1.85-1 2.94 1.06.08 2.14-.54 2.8-1.35Z" />
      </svg>
    ),
  },
  {
    href: "#google-play",
    label: "Google Play",
    tone: "translucent" as const,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] fill-current">
        <path d="M4.2 2.3a1 1 0 0 0-.7 1v17.4a1 1 0 0 0 .7 1L14 12 4.2 2.3Z" />
        <path d="M15.1 13.1 5.4 22.8c.3.1.6 0 .9-.1l11.4-6.5-2.6-3.1Z" />
        <path d="M15.1 10.9 17.7 7.8 6.3 1.3c-.3-.2-.6-.2-.9-.1l9.7 9.7Z" />
        <path d="M18.9 8.5 16 11.9l2.9 3.4 2.6-1.5c.9-.6.9-2.2 0-2.8l-2.6-1.5Z" />
      </svg>
    ),
  },
];

export function StoreButtons({ className }: { className?: string }) {
  return (
    <div className={cn("gap-sm flex flex-wrap", className)}>
      {stores.map((store) => (
        <Link
          key={store.label}
          href={store.href}
          className={cn(
            "rounded-pill text-site-button gap-sm px-xl py-md inline-flex items-center transition-colors duration-(--duration-fast)",
            store.tone === "solid"
              ? "bg-cream text-on-accent hover:opacity-90"
              : "bg-text/8 text-cream hover:bg-text/14",
          )}
        >
          {store.icon}
          {store.label}
        </Link>
      ))}
    </div>
  );
}
