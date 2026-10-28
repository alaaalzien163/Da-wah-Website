"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds; stagger siblings by 0.06–0.09 for a restrained cascade. */
  delay?: number;
  /** Vertical travel in pixels. */
  y?: number;
  once?: boolean;
}

/**
 * Single entrance primitive for the whole invitation.
 *
 * Motion is configured with `reducedMotion="user"` in MotionProvider, so
 * reduced-motion visitors receive the fade without the translation.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.3, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
