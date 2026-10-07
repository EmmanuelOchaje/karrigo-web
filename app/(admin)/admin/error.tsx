"use client";

/**
 * What ops sees when a page can't load — usually the backend being
 * unreachable for a moment. Standing alone (no shell), since the shell
 * itself needs the backend to render.
 */
export default function OpsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[440px] flex-col items-center justify-center gap-3 px-lg text-center">
      <p className="text-text text-[17px] font-semibold">This page couldn&rsquo;t load</p>
      <p className="text-text/62 text-[13.5px]/[1.5] font-light">
        Usually that is the connection to the Karrigo backend. Nothing you did has been lost.
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-text text-bg mt-2 h-10 rounded-pill px-[18px] text-[13px] font-bold"
      >
        Try again
      </button>
    </div>
  );
}
