/** Checkout's layout: the address and payment panels beside the order summary. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-[1240px]" aria-busy="true" aria-label="Loading checkout">
      <div className="bg-bg/60 rounded-panel-xs mt-sm mb-xl h-[48px] w-[min(100%,260px)] animate-pulse" />
      <div className="gap-xl flex flex-wrap items-start">
        <div className="gap-lg flex min-w-0 flex-[2_1_480px] flex-col">
          <div className="bg-bg/60 rounded-panel-sm h-[300px] animate-pulse" />
          <div className="bg-bg/60 rounded-panel-sm h-[160px] animate-pulse" />
        </div>
        <div className="bg-bg/60 rounded-panel-sm h-[380px] min-w-0 flex-[1_1_320px] animate-pulse" />
      </div>
    </div>
  );
}
