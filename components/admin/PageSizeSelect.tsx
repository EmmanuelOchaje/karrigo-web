"use client";

import { useRouter } from "next/navigation";

/** "Rows per page" as a select. Choosing a size goes to that size's address,
 *  which the server page builds (and which starts again from page one). */
export function PageSizeSelect({
  current,
  options,
}: {
  current: number;
  options: { size: number; href: string }[];
}) {
  const router = useRouter();

  return (
    <label className="text-text/55 flex items-center gap-2 text-[12px]">
      Rows per page
      <select
        value={current}
        onChange={(event) => {
          const chosen = options.find((o) => o.size === Number(event.target.value));
          if (chosen) router.push(chosen.href);
        }}
        className="border-text/16 bg-ops-surface text-text h-8 rounded-pill border px-3 text-[12.5px] font-semibold outline-none"
      >
        {options.map((o) => (
          <option key={o.size} value={o.size}>
            {o.size}
          </option>
        ))}
      </select>
    </label>
  );
}
