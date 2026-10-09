/** My orders: a title and a stack of order rows. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-[760px]" aria-busy="true" aria-label="Loading your orders">
      <div className="bg-bg/60 rounded-panel-xs mt-sm mb-xl h-[48px] w-[min(100%,240px)] animate-pulse" />
      <div className="gap-md flex flex-col">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-bg/60 rounded-panel-sm h-[76px] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
