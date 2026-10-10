"use client";

import { useEffect } from "react";

/**
 * Switches on scroll-reveal for the page it sits on. AOS watches every
 * `data-aos` element and adds `aos-animate` once it scrolls into view; the
 * look itself is plain CSS in globals.css, so AOS's own stylesheet (and its
 * 25 other animations) is never shipped. Skipped entirely for reduced motion.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    // Loaded on demand so it stays out of the first paint's JavaScript.
    import("aos").then(({ default: AOS }) => {
      if (cancelled) return;
      document.documentElement.dataset.reveal = "";
      AOS.init({ once: true, offset: 48, duration: 0, disableMutationObserver: false });
    });

    return () => {
      cancelled = true;
      delete document.documentElement.dataset.reveal;
    };
  }, []);

  return null;
}
