import type { EvidenceType } from "../content/config";

export type EvidenceStrength = "single" | "corroborated" | "tier1";

// Tier 1 evidence types per BRIEF.md §5.3. These are direct
// government / constitutional-body documents whose presence alone
// justifies surfacing the strongest pill on a status update.
// Keep in sync with the evidence-type enum in src/content/config.ts.
const TIER_1_EVIDENCE_TYPES: ReadonlySet<EvidenceType> = new Set<EvidenceType>([
  "gazette",
  "government_order",
]);

interface EvidenceLike {
  type: EvidenceType;
  publisher: string;
}

// Classifies the source strength of one status_updates entry's
// evidence array. The intent is presentational — to let a reader
// see at a glance whether a status is backed by a Tier 1 document,
// by multi-publisher corroboration, or by a single source.
//
// Rules, in order:
//   - tier1        — any one evidence entry is a Tier 1 type.
//   - corroborated — two or more distinct publishers.
//   - single       — everything else (one entry, or many entries
//                    from one publisher).
//
// The "manifesto" type alone is treated as `single`. A bootstrap
// "Promise recorded from the manifesto" entry is a single source
// by construction.
export function evidenceStrength(evidence: readonly EvidenceLike[]): EvidenceStrength {
  if (evidence.length === 0) return "single";

  const hasTier1 = evidence.some((e) => TIER_1_EVIDENCE_TYPES.has(e.type));
  if (hasTier1) return "tier1";

  const distinctPublishers = new Set(evidence.map((e) => e.publisher));
  if (distinctPublishers.size >= 2) return "corroborated";

  return "single";
}

export const EVIDENCE_STRENGTH_LABEL: Record<EvidenceStrength, string> = {
  single: "Single source",
  corroborated: "Corroborated",
  tier1: "Tier 1 evidence",
};
