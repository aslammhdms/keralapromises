import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { scorecard } from "../../lib/status";
import { TERM_START, TERM_END, formatIsoDate } from "../../lib/dates";
import { primaryMinisterForCategory } from "../../lib/cabinet";

// Versioned public API. BRIEF.md Section 10 names this a public
// contract. Breaking changes (renames, removals, type changes) require
// bumping API_VERSION and documenting the diff in /methodology.
//
// v2 (2026-05-21) — adds cag_report, rti_response, budget_document to
// the evidence.type enum. Existing consumers may see these new values
// in status_history[].evidence[].type once entries start using them.
const API_VERSION = "2";

export const prerender = true;

export const GET: APIRoute = async () => {
  const promises = await getCollection("promises");
  const totals = scorecard(promises);
  const cabinet = await getCollection("cabinet");

  const payload = {
    version: API_VERSION,
    generated_at: new Date().toISOString(),
    manifesto: "udf-2026",
    term_start: formatIsoDate(TERM_START),
    term_end: formatIsoDate(TERM_END),
    totals: {
      pending: totals.pending,
      in_progress: totals.in_progress,
      fulfilled: totals.fulfilled,
      evaded: totals.evaded,
      total: totals.total,
    },
    promises: promises
      .sort((a, b) => a.data.id.localeCompare(b.data.id))
      .map((p) => {
        const latest = p.data.status_updates[p.data.status_updates.length - 1];
        const minister = primaryMinisterForCategory(cabinet, p.data.category);
        return {
          id: p.data.id,
          slug: p.data.slug,
          url: `https://keralapromises.in/promises/${p.data.slug}`,
          title_en: p.data.title_en,
          title_ml: p.data.title_ml ?? null,
          category: p.data.category,
          flagship: p.data.flagship,
          scope: p.data.scope,
          priority: p.data.priority,
          beneficiary: p.data.beneficiary,
          manifesto: p.data.manifesto,
          manifesto_page: p.data.manifesto_page ?? null,
          target: {
            metric: p.data.target.metric,
            value: p.data.target.value ?? null,
            deadline: formatIsoDate(p.data.target.deadline),
          },
          status: p.data.current_status,
          status_history: p.data.status_updates.map((u) => ({
            date: formatIsoDate(u.date),
            status: u.status,
            editor: u.editor,
            summary_en: u.summary_en,
            summary_ml: u.summary_ml ?? null,
            evidence: u.evidence.map((e) => ({
              type: e.type,
              publisher: e.publisher,
              published: formatIsoDate(e.published),
              url: e.url,
              archive_url: e.archive_url || null,
              excerpt_en: e.excerpt_en,
              excerpt_ml: e.excerpt_ml ?? null,
              reporter: e.reporter ?? null,
              note: e.note ?? null,
            })),
          })),
          last_updated: formatIsoDate(latest.date),
          responsible_minister: minister
            ? {
                id: minister.data.id,
                slug: minister.data.slug,
                name_en: minister.data.name_en,
                portfolio_en: minister.data.portfolio_en,
                party: minister.data.party,
                placeholder: minister.data.placeholder,
                url: `https://keralapromises.in/cabinet/${minister.data.slug}`,
              }
            : null,
        };
      }),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
};
