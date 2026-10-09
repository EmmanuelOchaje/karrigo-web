/** A kitchen page: the hero, then the menu beside the cart. */
export default function Loading() {
  return (
    <div className="gap-xl mx-auto flex max-w-[1240px] flex-wrap items-start" aria-busy="true" aria-label="Loading menu">
      <div className="gap-lg flex min-w-0 flex-[2_1_520px] flex-col">
        <div className="bg-bg/60 rounded-pill h-[34px] w-[110px] animate-pulse" />
        <div className="bg-bg/60 rounded-panel-md h-[220px] animate-pulse" />
        <div className="gap-md flex">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-bg/60 rounded-pill h-[36px] w-[88px] animate-pulse" />
          ))}
        </div>
        <div className="gap-md grid sm:grid-cols-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-bg/60 rounded-panel-sm h-[110px] animate-pulse" />
          ))}
        </div>
      </div>
      <div className="bg-bg/60 rounded-panel-sm h-[320px] min-w-0 flex-[1_1_320px] animate-pulse" />
    </div>
  );
}
