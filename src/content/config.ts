import { defineCollection, z, reference } from "astro:content";
import { glob, file } from "astro/loaders";

// ---------------------------------------------------------------------------
// Enums — locked. Any change here is a public contract change; bump the
// JSON-API version in src/pages/api/promises.json.ts when you touch them.
// ---------------------------------------------------------------------------

export const STATUSES = ["pending", "in_progress", "fulfilled", "evaded"] as const;
export const statusEnum = z.enum(STATUSES);
export type Status = (typeof STATUSES)[number];

export const CATEGORIES = [
  "health",
  "education",
  "agriculture",
  "infrastructure",
  "women_child",
  "welfare_pensions",
  "industry_jobs",
  "technology",
  "environment",
  "law_order",
  "fiscal",
  "culture_heritage",
  "transport",
  "housing",
  "tribal_dalit",
] as const;
export const categoryEnum = z.enum(CATEGORIES);
export type Category = (typeof CATEGORIES)[number];

// The evidence-type enum mirrors the source hierarchy in BRIEF.md Section
// 5.3. `manifesto` is the bootstrap source for pending entries at term
// start. Excluded sources (tweets, party press releases, opinion pieces)
// have no value here on purpose — there is no way to encode them.
export const EVIDENCE_TYPES = [
  "manifesto",
  "gazette",
  "government_order",
  "government_press_release",
  "cabinet_statement",
  "wire",
  "longform",
] as const;
export const evidenceTypeEnum = z.enum(EVIDENCE_TYPES);
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export const SOURCE_TIERS = [1, 2, 3, 4] as const;
export const sourceTierEnum = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

export const SCOPES = ["statewide", "regional", "district", "sector"] as const;
export const PRIORITIES = ["high", "medium", "low"] as const;

// ---------------------------------------------------------------------------
// Shared object schemas
// ---------------------------------------------------------------------------

const evidenceSchema = z.object({
  type: evidenceTypeEnum,
  url: z.string().url(),
  archive_url: z.string().url().or(z.literal("")),
  publisher: z.string().min(1),
  published: z.coerce.date(),
  excerpt_en: z.string().min(1),
  excerpt_ml: z.string().optional(),
  reporter: z.string().optional(),
  note: z.string().optional(),
});

const statusUpdateSchema = z.object({
  date: z.coerce.date(),
  status: statusEnum,
  summary_en: z.string().min(1),
  summary_ml: z.string().optional(),
  editor: z.string().min(1),
  evidence: z.array(evidenceSchema).min(1),
});

const targetSchema = z.object({
  metric: z.string().min(1),
  value: z.string().optional(),
  deadline: z.coerce.date(),
});

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

const promises = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/promises" }),
  schema: z.object({
    id: z.string().regex(/^udf-2026-\d{3}$/, "id must look like udf-2026-014"),
    slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
    title_en: z.string().min(1),
    title_ml: z.string().optional(),
    manifesto: z.literal("udf-2026"),
    manifesto_page: z.number().int().positive(),
    category: categoryEnum,
    flagship: z.boolean().default(false),
    target: targetSchema,
    beneficiary: z.string().min(1),
    scope: z.enum(SCOPES),
    priority: z.enum(PRIORITIES),
    current_status: statusEnum,
    status_updates: z.array(statusUpdateSchema).min(1),
    related: z.array(reference("promises")).optional(),
  }),
});

const categories = defineCollection({
  loader: file("./src/content/categories/index.json"),
  schema: z.object({
    id: categoryEnum,
    name_en: z.string().min(1),
    name_ml: z.string().min(1),
    description_en: z.string().min(1),
    order: z.number().int().nonnegative(),
  }),
});

const sources = defineCollection({
  loader: file("./src/content/sources/index.json"),
  schema: z.object({
    id: z.string().min(1),
    name_en: z.string().min(1),
    name_ml: z.string().optional(),
    tier: sourceTierEnum,
    kind: z.enum([
      "government",
      "wire",
      "newspaper",
      "magazine",
      "broadcaster",
      "manifesto",
    ]),
    homepage: z.string().url().optional(),
    notes: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title_en: z.string().min(1),
    title_ml: z.string().optional(),
    description_en: z.string().min(1),
    updated: z.coerce.date(),
  }),
});

export const collections = { promises, categories, sources, pages };
