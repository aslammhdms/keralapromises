// Term reference points for the 14th Kerala Legislative Assembly under UDF.
// Sourced from BRIEF.md Section 1: oath taken 2026-05-09, term ends 2031-05-23.
// We store both as UTC midnight so toISOString().slice(0,10) round-trips to
// the calendar date the manifesto names. Display formatting goes through
// en-IN / ml-IN locales, so readers see Indian-style date labels even
// though the underlying value is UTC-aligned.
export const TERM_START = new Date("2026-05-09T00:00:00Z");
export const TERM_END = new Date("2031-05-23T00:00:00Z");

const ONE_DAY_MS = 86_400_000;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function diffDays(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / ONE_DAY_MS);
}

export function daysInOffice(now: Date = new Date()): number {
  return clamp(diffDays(TERM_START, now), 0, diffDays(TERM_START, TERM_END));
}

export function daysRemaining(now: Date = new Date()): number {
  return clamp(diffDays(now, TERM_END), 0, diffDays(TERM_START, TERM_END));
}

export function termLengthDays(): number {
  return diffDays(TERM_START, TERM_END);
}

export function termFractionElapsed(now: Date = new Date()): number {
  const total = termLengthDays();
  if (total === 0) return 0;
  return clamp(daysInOffice(now) / total, 0, 1);
}

export function formatIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function formatLongDate(d: Date, locale: "en" | "ml" = "en"): string {
  const tag = locale === "ml" ? "ml-IN" : "en-IN";
  return new Intl.DateTimeFormat(tag, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
