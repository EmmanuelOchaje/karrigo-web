import Link from "next/link";

/** What a kitchen still has to finish, each item linking to where it is done.
 *  Renders nothing when nothing is left. */
export function SetupChecklist({ items }: { items: { label: string; href: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="bg-warning-bg rounded-panel-sm p-xl">
      <p className="text-warning text-site-title">Still to set up</p>
      <ul className="mt-sm gap-xs flex flex-col">
        {items.map((item) => (
          <li key={item.label} className="text-site-body">
            <Link href={item.href} className="text-accent-text font-bold">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
