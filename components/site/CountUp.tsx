"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 1800;
const format = (n: number) => n.toLocaleString("en-NG");

/**
 * Counts from 0 to `value` once, the first time it scrolls into view. The real
 * number is in the server HTML and in a screen-reader-only span, so no-JS and
 * assistive tech always see the final figure; the animated copy is aria-hidden
 * and written straight to the DOM to avoid a re-render per frame.
 * Reduced-motion visitors keep the final number.
 */
export function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const live = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const out = live.current;
    if (!el || !out) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    out.textContent = format(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / DURATION_MS, 1);
          out.textContent = format(
            Math.round(value * (1 - Math.pow(1 - t, 4))),
          );
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={root} className={className}>
      <span className="sr-only">{format(value)}</span>
      <span ref={live} aria-hidden className="tabular-nums">
        {format(value)}
      </span>
    </span>
  );
}
