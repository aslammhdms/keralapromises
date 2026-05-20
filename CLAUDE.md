# Project context for AI agents

Read `BRIEF.md` at the repo root first — it is the single source of truth for this project. Every decision about scope, tone, tech stack, content model, and acceptance criteria flows from it.

## What you must know before doing anything

- This is **Kerala Promises** (`keralapromises.in`), a public, evidence-based, non-partisan ledger of the Kerala UDF government's 2026–2031 manifesto commitments.
- It is **not** a political website, **not** journalism, **not** activism. It is a public notepad. Tone is institutional, sober, conservative.
- Voice rules in `BRIEF.md` Section 2 are non-negotiable: first person plural, no charged adjectives, no exclamation marks, no emoji except the four status icons (✓ ◑ ✗ ○), good-faith default.
- The four status enums are the entire ontology: `pending`, `in_progress`, `fulfilled`, `evaded`. No "broken", "partial", "stalled", etc.
- Evidence comes only from the source hierarchy in `BRIEF.md` Section 5.3. No tweets, no party press releases, no opinion pieces.

## Tech stack (locked — do not substitute)

Astro 5 + TypeScript strict · Tailwind CSS 4 · MDX content collections · Keystatic CMS · Cloudflare Pages · GitHub Actions for archive.org mirroring · Pagefind for search.

No client-side framework. No Node server. No database.

## When in doubt

`BRIEF.md` wins. If something feels under-specified, ask the maintainer — do not invent scope.
