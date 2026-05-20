#!/usr/bin/env node
// Mirror evidence URLs from changed promise files to the Internet Archive.
//
// Runs in .github/workflows/archive-mirror.yml after a push to main.
// For every promise file in the diff, reads the frontmatter, walks each
// status_update.evidence[] entry, and if archive_url is empty, asks
// web.archive.org to save the URL, polls until the snapshot resolves,
// and writes the snapshot URL back into the frontmatter.
//
// Failure on any single URL is logged and the script continues; the
// deploy is never blocked. Per BRIEF.md Section 11.

import { readFile, writeFile, appendFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import matter from "gray-matter";
import YAML from "yaml";

const SAVE_ENDPOINT = "https://web.archive.org/save/";
const WAYBACK_TIMELINE = "https://web.archive.org/web/";
const POLL_INTERVAL_MS = 6_000;
const POLL_MAX_ATTEMPTS = 12; // up to ~72s per URL
const REQUEST_TIMEOUT_MS = 30_000;

async function setGithubOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  } else {
    console.log(`output ${name}=${value}`);
  }
}

function changedPromiseFiles() {
  // The workflow uses fetch-depth: 2, so HEAD~1 is the previous commit.
  // workflow_dispatch can run without a parent; fall back to listing all
  // promise files in that case.
  let diff = "";
  try {
    diff = execSync(
      "git diff --name-only --diff-filter=AM HEAD~1 HEAD -- 'src/content/promises/'",
      { encoding: "utf8" }
    );
  } catch {
    diff = execSync(
      "git ls-files 'src/content/promises/'",
      { encoding: "utf8" }
    );
  }
  return diff
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.endsWith(".mdx") || s.endsWith(".md"))
    .filter((s) => existsSync(s));
}

async function requestSnapshot(url) {
  const headers = {
    "User-Agent":
      "keralapromises.in archive-mirror bot (contact: hello@keralapromises.in)",
    Accept: "text/html, */*;q=0.5",
  };
  const auth =
    process.env.IA_S3_ACCESS_KEY && process.env.IA_S3_SECRET_KEY
      ? { Authorization: `LOW ${process.env.IA_S3_ACCESS_KEY}:${process.env.IA_S3_SECRET_KEY}` }
      : {};

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${SAVE_ENDPOINT}${url}`, {
      method: "GET",
      headers: { ...headers, ...auth },
      redirect: "follow",
      signal: ac.signal,
    });
    // The Save Page Now endpoint returns a Content-Location header
    // pointing at the snapshot URL when ready, or the final URL via
    // res.url after redirect.
    const location = res.headers.get("content-location");
    if (location && location.startsWith("/web/")) {
      return `https://web.archive.org${location}`;
    }
    if (res.url && res.url.startsWith(WAYBACK_TIMELINE)) {
      return res.url;
    }
    return null;
  } catch (err) {
    console.warn(`request error for ${url}: ${err.message ?? err}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function pollAvailability(url) {
  // Fallback: ask the availability API whether a recent snapshot exists.
  for (let attempt = 1; attempt <= POLL_MAX_ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch(
        `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`,
        {
          headers: { "User-Agent": "keralapromises.in archive-mirror bot" },
        },
      );
      if (res.ok) {
        const body = await res.json();
        const closest = body?.archived_snapshots?.closest;
        if (closest?.available && closest.url) {
          return closest.url.startsWith("http")
            ? closest.url
            : `https:${closest.url}`;
        }
      }
    } catch (err) {
      console.warn(`availability poll error for ${url}: ${err.message ?? err}`);
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  return null;
}

async function archive(url) {
  const direct = await requestSnapshot(url);
  if (direct) return direct;
  return pollAvailability(url);
}

// gray-matter parses YAML date literals as JS Date objects. Round-tripping
// to ISO strings would mutate the file aesthetically even when no archive
// change happened. We pre-walk the parsed frontmatter and turn pure-date
// Date values (midnight UTC) back into "YYYY-MM-DD" strings; the yaml
// serializer then emits them as bare scalars that gray-matter parses
// identically next time.
function normaliseDates(value) {
  if (value instanceof Date) {
    const iso = value.toISOString();
    if (iso.endsWith("T00:00:00.000Z")) {
      return iso.slice(0, 10);
    }
    return iso;
  }
  if (Array.isArray(value)) return value.map(normaliseDates);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = normaliseDates(v);
    return out;
  }
  return value;
}

function evidenceNeedsArchive(evidence) {
  if (!evidence?.url) return false;
  if (evidence.archive_url) return false;
  return true;
}

async function processFile(path) {
  const raw = await readFile(path, "utf8");
  const parsed = matter(raw);
  const data = parsed.data;
  const updates = Array.isArray(data?.status_updates) ? data.status_updates : [];
  let mutated = false;

  for (const update of updates) {
    const evidence = Array.isArray(update?.evidence) ? update.evidence : [];
    for (const e of evidence) {
      if (!evidenceNeedsArchive(e)) continue;
      console.log(`mirroring ${e.url} in ${path}`);
      const archiveUrl = await archive(e.url);
      if (archiveUrl) {
        e.archive_url = archiveUrl;
        mutated = true;
        console.log(`  → ${archiveUrl}`);
      } else {
        console.warn(`  → no snapshot resolved; leaving archive_url empty`);
      }
    }
  }

  if (!mutated) return false;

  const newFrontmatter = YAML.stringify(normaliseDates(data), {
    lineWidth: 0,
    minContentWidth: 0,
  });
  const out = `---\n${newFrontmatter}---\n${parsed.content.replace(/^\n/, "")}`;
  await writeFile(path, out, "utf8");
  return true;
}

async function main() {
  const files = changedPromiseFiles();
  if (files.length === 0) {
    console.log("no changed promise files; nothing to mirror");
    await setGithubOutput("changed", "false");
    return;
  }
  console.log(`scanning ${files.length} file(s)`);

  let anyChanged = false;
  for (const file of files) {
    try {
      const changed = await processFile(file);
      if (changed) anyChanged = true;
    } catch (err) {
      console.warn(`failed to process ${file}: ${err.message ?? err}`);
    }
  }

  await setGithubOutput("changed", anyChanged ? "true" : "false");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 0; // never block the deploy
});
