import { cn } from "@/lib/cn";

type Props = {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: React.ReactNode;
  className?: string;
} & Omit<React.ComponentProps<"input">, "className">;

export function TextField({
  label,
  hint,
  error,
  prefix,
  className,
  id,
  ...props
}: Props) {
  const fieldId = id ?? props.name;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-sm", className)}>
      {label && (
        <label htmlFor={fieldId} className="text-label text-text-secondary">
          {label}
        </label>
      )}

      <div
        className={cn(
          "bg-surface rounded-field h-field-height flex items-center gap-sm px-md",
          "focus-within:outline-2 focus-within:outline-accent-text",
          error && "outline-2 outline-danger",
        )}
      >
        {prefix && (
          <>
            <span className="text-body-med text-text font-semibold">{prefix}</span>
            <span className="bg-border-strong h-[13px] w-px" />
          </>
        )}
        <input
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            "text-body-med text-text placeholder:text-text-tertiary",
            "min-w-0 flex-1 bg-transparent outline-none",
          )}
          {...props}
        />
      </div>

      {error ? (
        <p id={`${fieldId}-error`} className="text-caption text-danger-text">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="text-caption text-text-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
