import type { CollectionEntry } from "astro:content";
import { STATUSES, type Status } from "../content/config";

export type Promise_ = CollectionEntry<"promises">;

export interface Scorecard {
  pending: number;
  in_progress: number;
  fulfilled: number;
  evaded: number;
  total: number;
}

export const STATUS_ICON: Record<Status, string> = {
  pending: "○",       // ○
  in_progress: "◑",   // ◑
  fulfilled: "✓",     // ✓
  evaded: "✗",        // ✗
};

export const STATUS_LABEL_EN: Record<Status, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  fulfilled: "Fulfilled",
  evaded: "Evaded",
};

export const STATUS_LABEL_ML: Record<Status, string> = {
  pending: "കാത്തിരിക്കുന്നു",
  in_progress: "നടന്നുകൊണ്ടിരിക്കുന്നു",
  fulfilled: "നിറവേറ്റി",
  evaded: "ഒഴിവാക്കി",
};

export function scorecard(promises: Promise_[]): Scorecard {
  const out: Scorecard = {
    pending: 0,
    in_progress: 0,
    fulfilled: 0,
    evaded: 0,
    total: promises.length,
  };
  for (const p of promises) {
    out[p.data.current_status] += 1;
  }
  return out;
}

export function statusPercentages(s: Scorecard): Record<Status, number> {
  const total = Math.max(s.total, 1);
  return {
    pending: (s.pending / total) * 100,
    in_progress: (s.in_progress / total) * 100,
    fulfilled: (s.fulfilled / total) * 100,
    evaded: (s.evaded / total) * 100,
  };
}

export function latestUpdates(promises: Promise_[], limit = 5) {
  const updates = promises.flatMap((p) =>
    p.data.status_updates.map((u) => ({
      promise: p,
      update: u,
    }))
  );
  updates.sort(
    (a, b) => b.update.date.getTime() - a.update.date.getTime()
  );
  return updates.slice(0, limit);
}

export function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}
