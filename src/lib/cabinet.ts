import type { CollectionEntry } from "astro:content";
import type { Category } from "../content/config";

export type Minister = CollectionEntry<"cabinet">;

// Find ministers whose portfolio includes a given category. Multiple
// hits are possible (e.g. one minister with two portfolios); we return
// them sorted by rank so the primary responsible minister is first.
export function findMinistersByCategory(
  ministers: Minister[],
  category: Category,
): Minister[] {
  const active = ministers.filter((m) => !m.data.left_office);
  return active
    .filter((m) => (m.data.portfolios_categories ?? []).includes(category))
    .sort((a, b) => a.data.rank - b.data.rank);
}

export function primaryMinisterForCategory(
  ministers: Minister[],
  category: Category,
): Minister | null {
  return findMinistersByCategory(ministers, category)[0] ?? null;
}

export function sortByRank(ministers: Minister[]): Minister[] {
  return [...ministers].sort((a, b) => a.data.rank - b.data.rank);
}

export function displayName(m: Minister, locale: "en" | "ml" = "en"): string {
  return locale === "ml" && m.data.name_ml ? m.data.name_ml : m.data.name_en;
}
