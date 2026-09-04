import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
  href?: string;
  className?: string;
};

export function ListRow({
  icon,
  title,
  description,
  trailing,
  href,
  className,
}: Props) {
  const body = (
    <>
      {icon}
      <div className="min-w-0 flex-1">
        <div className="text-h3 font-medium">{title}</div>
        {description && (
          <div className="text-caption text-text-secondary mt-xs">{description}</div>
        )}
      </div>
      {trailing ?? (href && <span className="text-text-tertiary text-h3">›</span>)}
    </>
  );

  const classes = cn(
    "border-border flex w-full items-center gap-md border-b py-md text-left last:border-b-0",
    className,
  );

  return href ? (
    <Link href={href} className={classes}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  );
}
