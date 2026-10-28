import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/cn";

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xs border font-body font-bold transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-refined)] disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0";

const variants = {
  primary:
    "border-gold-500 bg-gold-500 text-emerald-950 shadow-[0_16px_34px_-22px_rgb(198_166_100/0.9)] hover:border-gold-300 hover:bg-gold-300 hover:shadow-[0_20px_40px_-22px_rgb(198_166_100/0.95)]",
  outline:
    "border-gold-500/40 bg-transparent text-gold-300 hover:border-gold-500/75 hover:bg-gold-500/10",
  quiet:
    "border-transparent bg-transparent text-current underline decoration-gold-500/50 decoration-1 underline-offset-8 hover:decoration-gold-500",
} as const;

const sizes = {
  sm: "min-h-10 px-4 text-small",
  md: "min-h-11 px-6 text-small",
  lg: "min-h-12 px-8 text-body",
} as const;

interface SharedProps {
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
}

type ButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps | "href">;

type LinkProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedProps | "href"> & {
    href: string;
  };

export type { ButtonProps, LinkProps };

/**
 * One button for both actions and navigation. `href` renders an anchor so
 * keyboard, middle-click and link previews behave natively.
 */
export function Button(props: ButtonProps | LinkProps) {
  if ("href" in props) {
    const { href, variant = "primary", size = "md", className, children, ...rest } =
      props;

    return (
      <a
        href={href}
        className={cn(base, variants[variant], sizes[size], className)}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const { variant = "primary", size = "md", className, children, ...rest } = props;

  return (
    <button
      type="button"
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
