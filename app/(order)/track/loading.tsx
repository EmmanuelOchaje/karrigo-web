/** Tracking: the large status panel beside the order details. */
export default function Loading() {
  return (
    <div
      className="gap-xl mx-auto flex max-w-[1240px] flex-wrap items-start"
      aria-busy="true"
      aria-label="Loading your order"
    >
      <div className="bg-bg/60 rounded-panel-lg h-[460px] min-w-0 flex-[2_1_480px] animate-pulse" />
      <div className="gap-lg flex min-w-0 flex-[1_1_320px] flex-col">
        <div className="bg-bg/60 rounded-panel-sm h-[180px] animate-pulse" />
        <div className="bg-bg/60 rounded-panel-sm h-[140px] animate-pulse" />
      </div>
    </div>
  );
}
