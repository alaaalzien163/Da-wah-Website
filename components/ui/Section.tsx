import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Container } from "./Container";

const tones = {
  dark: "bg-emerald-900 text-ivory-100 [--focus-ring:var(--color-gold-300)]",
  deepest: "bg-emerald-950 text-ivory-100 [--focus-ring:var(--color-gold-300)]",
  light: "bg-ivory-50 text-ink-900 [--focus-ring:var(--color-emerald-800)]",
  muted: "bg-ivory-100 text-ink-900 [--focus-ring:var(--color-emerald-800)]",
} as const;

const spacings = {
  default: "py-section",
  compact: "py-section-sm",
  none: "",
} as const;

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: keyof typeof tones;
  spacing?: keyof typeof spacings;
  container?: "page" | "narrow" | "prose" | "none";
  children: ReactNode;
}

/** Surface + vertical rhythm + container in one semantic section. */
export function Section({
  tone = "dark",
  spacing = "default",
  container = "page",
  className,
  children,
  ...rest
}: SectionProps) {
  const content =
    container === "none" ? (
      children
    ) : (
      <Container size={container}>{children}</Container>
    );

  return (
    <section className={cn(tones[tone], spacings[spacing], className)} {...rest}>
      {content}
    </section>
  );
}
