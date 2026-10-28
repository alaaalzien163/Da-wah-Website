import { cn } from "@/lib/cn";

export interface DividerProps {
  /** Optional Arabic caption between the rules. */
  label?: string;
  className?: string;
}

/**
 * Hairline rule with a small diamond. Uses `currentColor`, so it inherits the
 * tone of its section (champagne on emerald, bronze on ivory).
 */
export function Divider({ label, className }: DividerProps) {
  return (
    <div
      role="presentation"
      className={cn("flex items-center gap-4", className)}
    >
      <span aria-hidden="true" className="h-px flex-1 bg-current/25" />
      {label ? (
        <span className="text-label font-body opacity-80">{label}</span>
      ) : (
        <span
          aria-hidden="true"
          className="size-[0.4375rem] rotate-45 border border-current/65 bg-current/10"
        />
      )}
      <span aria-hidden="true" className="h-px flex-1 bg-current/25" />
    </div>
  );
}
