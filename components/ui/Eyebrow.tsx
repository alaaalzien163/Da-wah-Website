import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const tones = {
  onDark: "text-gold-300",
  onLight: "text-gold-700",
} as const;

export interface EyebrowProps {
  children: ReactNode;
  /** Choose the tone that matches the surrounding surface. */
  tone?: keyof typeof tones;
  /** Latin labels may be tracked and uppercased; Arabic must never be. */
  latin?: boolean;
  as?: "p" | "span" | "div";
  className?: string;
}

export function Eyebrow({
  children,
  tone = "onDark",
  latin = false,
  as: Tag = "p",
  className,
}: EyebrowProps) {
  return (
    <Tag
      dir={latin ? "ltr" : undefined}
      className={cn(
        "inline-flex items-center gap-2.5 text-label",
        latin
          ? "font-latin uppercase tracking-[0.22em]"
          : "font-body",
        tones[tone],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-px w-4 shrink-0 bg-current/45", latin && "w-6")}
      />
      <span>{children}</span>
    </Tag>
  );
}
