"use client";

import { Button } from "@/components/ui/Button";

export default function OrderError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="bg-bg rounded-panel-sm mx-auto max-w-[640px] p-xxl text-center">
      <p className="text-site-title">We couldn&rsquo;t load this page</p>
      <p className="text-site-body text-text-secondary mt-sm">
        Usually that is the connection. Your cart is saved on this phone.
      </p>
      <Button type="button" variant="accent" size="site" className="mt-xl" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
