/**
 * Countdown math is kept pure so it can be reasoned about (and tested) without
 * a browser. The invitation date is an absolute instant; the display timezone
 * never changes the remaining time, only how the date is written.
 */
export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const DAY = 86_400;
const HOUR = 3_600;
const MINUTE = 60;

/**
 * Returns the whole seconds left, or `null` once the event instant is reached.
 * `Math.ceil` avoids showing 00:00:00 while a fraction of a second remains.
 */
export function getCountdownParts(
  targetMs: number,
  nowMs: number,
): CountdownParts | null {
  if (!Number.isFinite(targetMs) || !Number.isFinite(nowMs)) return null;

  const remainingMs = targetMs - nowMs;
  if (remainingMs <= 0) return null;

  const totalSeconds = Math.ceil(remainingMs / 1000);

  return {
    days: Math.floor(totalSeconds / DAY),
    hours: Math.floor((totalSeconds % DAY) / HOUR),
    minutes: Math.floor((totalSeconds % HOUR) / MINUTE),
    seconds: totalSeconds % MINUTE,
  };
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Pads to two digits and maps to Arabic-Indic when the config asks for it. */
export function formatCountdownValue(
  value: number,
  numerals: "latn" | "arab",
): string {
  const padded = String(value).padStart(2, "0");
  if (numerals === "latn") return padded;

  return padded.replace(/\d/g, (digit) => ARABIC_DIGITS[Number(digit)]);
}
