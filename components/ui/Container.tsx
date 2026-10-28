import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const widths = {
  page: "max-w-page",
  narrow: "max-w-narrow",
  prose: "max-w-prose",
} as const;

export interface ContainerProps {
  children: ReactNode;
  size?: keyof typeof widths;
  className?: string;
}

/** Horizontal rhythm for every section; never hard-code page padding. */
export function Container({ children, size = "page", className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-gutter", widths[size], className)}>
      {children}
    </div>
  );
}
