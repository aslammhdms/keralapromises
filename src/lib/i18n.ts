import en from "../i18n/en.json";
import ml from "../i18n/ml.json";

export const LOCALES = ["en", "ml"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Phase 1 ships English-only. The toggle is visible but disabled until the
// Malayalam content pass lands (Phase 3 in BRIEF.md Section 9). Until then,
// ml.json is a copy of en.json so nothing breaks if the toggle is enabled.
export const PHASE_1_LOCALES_ENABLED: Locale[] = ["en"];

const dictionaries: Record<Locale, Record<string, string>> = {
  en,
  ml,
};

export function t(locale: Locale, key: string): string {
  const dict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
  return dict[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
