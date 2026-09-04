import type { Metadata } from "next";
import { Gallery } from "@/components/kitchen-sink/Gallery";

export const metadata: Metadata = {
  title: "Kitchen sink — M-Kart",
  robots: { index: false, follow: false },
};

export default function KitchenSinkPage() {
  return (
    <main className="bg-surface-raised text-text p-xl">
      <header className="mx-auto mb-xl max-w-[900px]">
        <h1 className="text-display">M-Kart — one system, two modes</h1>
        <p className="text-body text-text-secondary mt-sm max-w-[76ch]">
          Same components, same markup. Only the token values underneath change.
          Every value comes from theme.ts via the generated tokens.css.
        </p>
      </header>

      <div className="mx-auto grid max-w-[900px] gap-xl md:grid-cols-2">
        <div className="border-border-strong overflow-hidden rounded-sheet border">
          <Gallery mode="light" />
        </div>
        <div className="border-border-strong overflow-hidden rounded-sheet border">
          <Gallery mode="dark" />
        </div>
      </div>
    </main>
  );
}
