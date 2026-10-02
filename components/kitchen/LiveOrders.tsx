"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";

/** How often the console asks for new orders. There is no push to a browser
 *  yet, so this is the kitchen's doorbell: short enough to matter, long
 *  enough not to eat a data bundle. */
const POLL_MS = 15_000;
const SOUND_KEY = "karrigo.kitchen.sound";

const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}
function soundOn(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
}
function setSound(on: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {
    // Private mode: the choice lasts for this visit only, which is fine.
  }
  listeners.forEach((l) => l());
}

let audio: AudioContext | null = null;

/** Browsers only let a page make noise after a tap, so the context is made
 *  (or woken) inside one. */
function wake() {
  try {
    audio ??= new AudioContext();
    if (audio.state === "suspended") void audio.resume();
  } catch {
    audio = null;
  }
}

/** Three rising notes — distinct from a phone's own notification sounds. */
function ring() {
  if (!audio || audio.state !== "running") return;
  const start = audio.currentTime;
  [660, 880, 1100].forEach((frequency, i) => {
    const at = start + i * 0.18;
    const tone = audio!.createOscillator();
    const volume = audio!.createGain();
    tone.frequency.value = frequency;
    volume.gain.setValueAtTime(0.0001, at);
    volume.gain.exponentialRampToValueAtTime(0.35, at + 0.02);
    volume.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
    tone.connect(volume).connect(audio!.destination);
    tone.start(at);
    tone.stop(at + 0.17);
  });
}

/**
 * Keeps the console current and announces a new order. It lives in the
 * console's layout, so the bell works on whichever tab the kitchen has open —
 * but only while this page is on screen. A locked phone will not ring; that
 * needs the Partner app.
 */
export function LiveOrders({ waitingIds }: { waitingIds: string[] }) {
  const router = useRouter();
  const sound = useSyncExternalStore(subscribe, soundOn, () => false);
  const known = useRef<Set<string> | null>(null);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const poll = setInterval(refresh, POLL_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(poll);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router]);

  // After a reload the sound is still switched on but the browser has gone
  // quiet again; the first tap anywhere wakes it.
  useEffect(() => {
    if (!sound) return;
    document.addEventListener("pointerdown", wake, { once: true });
    return () => document.removeEventListener("pointerdown", wake);
  }, [sound]);

  const key = waitingIds.join(",");
  useEffect(() => {
    const ids = key ? key.split(",") : [];
    const before = known.current;
    known.current = new Set(ids);
    // The first look is not news: those orders were already waiting.
    if (!before) return;
    if (ids.some((id) => !before.has(id))) {
      if (soundOn()) ring();
      if ("vibrate" in navigator) navigator.vibrate?.([200, 100, 200]);
    }
  }, [key]);

  // Say it in the browser tab too, for a kitchen with another tab in front.
  const count = waitingIds.length;
  useEffect(() => {
    if (count === 0) return;
    const title = document.title;
    document.title = `(${count}) New order${count === 1 ? "" : "s"} · Karrigo`;
    return () => {
      document.title = title;
    };
  }, [count]);

  return (
    <button
      type="button"
      aria-pressed={sound}
      onClick={() => {
        if (!sound) {
          wake();
          setSound(true);
          // Play it once, so they know what a new order sounds like.
          setTimeout(ring, 80);
        } else {
          setSound(false);
        }
      }}
      className={cn(
        "rounded-pill text-site-chip shrink-0 px-lg py-sm transition-colors duration-(--duration-fast)",
        sound ? "bg-text text-bg" : "bg-bg text-text hover:bg-surface-raised",
      )}
    >
      {sound ? "Order sound on" : "Turn on order sound"}
    </button>
  );
}
