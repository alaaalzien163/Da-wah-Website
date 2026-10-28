"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import {
  formatCountdownValue,
  getCountdownParts,
  type CountdownParts,
} from "@/lib/countdown";
import type { NumeralStyle } from "@/lib/invitation";

type CountdownState =
  | { status: "pending"; parts: null }
  | { status: "active"; parts: CountdownParts }
  | { status: "expired"; parts: null };

const UNITS = [
  { key: "days", label: "أيام" },
  { key: "hours", label: "ساعات" },
  { key: "minutes", label: "دقائق" },
  { key: "seconds", label: "ثوانٍ" },
] as const;

export interface CountdownProps {
  /** Absolute event instant in milliseconds. */
  targetMs: number;
  timeZoneLabel: string;
  numerals: NumeralStyle;
}

/**
 * Client-only clock.
 *
 * The first client render deliberately matches the server: placeholders, never
 * stale zeroes. The real values appear after mount and then update on the next
 * whole second. A single timeout is always cleared on unmount or when the tab
 * becomes visible again after being throttled.
 */
export function Countdown({
  targetMs,
  timeZoneLabel,
  numerals,
}: CountdownProps) {
  const [state, setState] = useState<CountdownState>({
    status: "pending",
    parts: null,
  });

  useEffect(() => {
    let timer: number | undefined;
    let cancelled = false;

    const update = () => {
      if (cancelled) return;

      const now = Date.now();
      const parts = getCountdownParts(targetMs, now);

      setState(
        parts
          ? { status: "active", parts }
          : { status: "expired", parts: null },
      );

      if (parts) {
        // Align to the next whole second instead of drifting every interval.
        timer = window.setTimeout(update, 1000 - (now % 1000) + 20);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState !== "visible") return;
      if (timer !== undefined) window.clearTimeout(timer);
      update();
    };

    update();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [targetMs]);

  if (state.status === "expired") {
    return (
      <div className="mx-auto mt-8 max-w-xl border-y border-gold-500/20 py-7">
        <p className="font-display text-heading text-gold-300">
          انتهى العد التنازلي
        </p>
        <p className="mt-2 text-small text-mist-300/90">
          شكراً لمشاركتكم فرحتنا.
        </p>
      </div>
    );
  }

  const parts = state.parts;

  return (
    <div className="mt-8">
      <div
        role="timer"
        aria-live="off"
        aria-label="الوقت المتبقي حتى موعد الحفل"
        aria-busy={state.status === "pending"}
      >
        {state.status === "pending" ? (
          <span className="sr-only">جارٍ احتساب الوقت المتبقي…</span>
        ) : null}

        <div
          aria-hidden={state.status === "pending" ? true : undefined}
          className="mx-auto grid max-w-xl grid-cols-4 gap-px overflow-hidden rounded-xs border border-gold-500/20 bg-gold-500/15"
        >
          {UNITS.map((unit) => {
            const value = parts ? parts[unit.key] : null;
            // A four-digit day count is wider than a 320px cell at full size.
            const longValue = value !== null && value >= 1000;

            return (
              <div
                key={unit.key}
                className="bg-emerald-900 px-1 py-6 text-center sm:px-2 sm:py-7"
              >
                <span
                  className={cn(
                    "block leading-none tabular-nums text-ivory-50 sm:text-[2.75rem]",
                    longValue ? "text-[2rem]" : "text-[2.25rem]",
                    numerals === "arab" ? "font-body" : "font-latin",
                  )}
                >
                  {value === null
                    ? "—"
                    : formatCountdownValue(value, numerals)}
                </span>
                <span className="mt-3 block text-[0.7rem] leading-none text-gold-300/90 sm:text-xs">
                  {unit.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-mist-300/85">
        {timeZoneLabel}
      </p>
    </div>
  );
}
