import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { latestUpdates, STATUS_LABEL_EN } from "../lib/status";

const FEED_LIMIT = 50;

export const prerender = true;

export async function GET(context: APIContext) {
  const promises = await getCollection("promises");
  const updates = latestUpdates(promises, FEED_LIMIT);

  return rss({
    title: "Kerala Promises — status updates",
    description:
      "Every status update recorded by Kerala Promises, a non-partisan public ledger of the UDF 2026 manifesto.",
    site: context.site ?? "https://keralapromises.in",
    items: updates.map(({ promise, update }) => {
      const url = `/promises/${promise.data.slug}`;
      const statusLabel = STATUS_LABEL_EN[update.status];
      return {
        title: `${promise.data.title_en} — ${statusLabel}`,
        pubDate: update.date,
        link: url,
        // GUID is a stable per-update identifier; combining the
        // promise id with the ISO date gives uniqueness across both
        // initial entries and subsequent revisions of the same date.
        customData: `<guid isPermaLink="false">${promise.data.id}@${update.date
          .toISOString()
          .slice(0, 10)}</guid>`,
        description: update.summary_en,
        categories: [promise.data.category, update.status],
        author: `editors@keralapromises.in (${update.editor})`,
      };
    }),
    customData: `<language>en-IN</language><docs>https://keralapromises.in/methodology</docs>`,
    stylesheet: false,
  });
}
