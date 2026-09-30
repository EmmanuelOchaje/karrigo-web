import { cn } from "@/lib/cn";

/** The padded column every ops screen sits in. */
export function OpsPage({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "min-w-0 overflow-x-hidden px-[clamp(16px,2.4vw,32px)] pt-[26px] pb-12",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function OpsPageHeader({
  title,
  meta,
  actions,
}: {
  title: string;
  meta: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-[22px] flex flex-wrap items-end justify-between gap-xl">
      <div>
        <h1 className="text-text text-[30px]/[1.1] font-bold tracking-[-0.035em]">
          {title}
        </h1>
        <p className="text-text/62 mt-[7px] text-[14px] font-light">{meta}</p>
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </header>
  );
}
