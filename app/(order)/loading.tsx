/** Card-shaped placeholders, so a slow 3G load holds the layout still. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-[1240px]" aria-busy="true" aria-label="Loading">
      <div className="bg-bg/60 rounded-pill h-[26px] w-[140px] animate-pulse" />
      <div className="bg-bg/60 rounded-panel-xs mt-md h-[56px] w-[min(100%,480px)] animate-pulse" />
      <div className="gap-xl mt-xxl grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-bg/60 rounded-panel-sm aspect-[4/5] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
