import { cn } from "@/lib/cn";

const sizes = {
  sm: "size-12 text-sm",
  md: "size-16 text-lg sm:size-20 sm:text-xl",
  lg: "size-24 text-2xl sm:size-28 sm:text-3xl",
} as const;

export interface MonogramProps {
  /** Decorative mark only; the couple's names carry the accessible heading. */
  initials: string;
  size?: keyof typeof sizes;
  className?: string;
}

export function Monogram({ initials, size = "md", className }: MonogramProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full border border-gold-500/40 font-display leading-none whitespace-nowrap text-gold-300",
        sizes[size],
        className,
      )}
    >
      <span className="absolute inset-1.5 rounded-full border border-gold-500/20" />
      <span className="relative">{initials}</span>
    </span>
  );
}
