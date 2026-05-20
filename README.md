# Kerala Promises

A public, evidence-based, non-partisan ledger that tracks every commitment made by the United Democratic Front (UDF) government of Kerala in its 2026 election manifesto, across the full five-year term from May 2026 to May 2031.

Live site: <https://keralapromises.in>

## What this is

A public notepad, maintained by ordinary citizens, so the people of Kerala don't forget what was promised to them.

It is not a government or political website. It is not journalism. It is not activism. We hold no affiliation with any political party. We track facts, not opinions.

This tracker was created in good faith. We want the UDF government to succeed in fulfilling these promises for the people of Kerala. We are not here to root for failure.

## What it does

- Lists every concrete, measurable promise from the manifesto.
- Records the current status of each promise (Pending / In Progress / Fulfilled / Evaded) with evidence.
- Shows a full timeline of status changes for each promise, with citations.
- Mirrors every evidence URL to the Internet Archive on commit, so citations survive link rot.
- Publishes a JSON API and RSS feed so journalists, students, and other trackers can build on the data.

## What it does not do

It does not editorialise. It does not compare parties. It does not host comments or forums. It does not accept anonymous accusations without sources.

## Reading the codebase

- `BRIEF.md` — the single source of truth for scope, tone, content model, and acceptance criteria. Read this first.
- `METHODOLOGY.md` — the source hierarchy, status definitions, conflict-of-interest policy, and correction process.
- `CONTRIBUTING.md` — how to propose a status change, add evidence, or fix an error.
- `CODE_OF_CONDUCT.md` — how we expect contributors to treat one another.
- `CLAUDE.md` — context for AI agents working on the codebase.

## Local development

```bash
npm install
npm run dev
```

Then open <http://localhost:4321>.

To produce a production build (which also runs Pagefind to index the site for search):

```bash
npm run build
npm run preview
```

## Tech

Astro 5, TypeScript (strict), Tailwind CSS 4, MDX content collections, Keystatic for the editing UI, Pagefind for search, Cloudflare Pages for hosting, GitHub Actions for archive.org mirroring. The site is fully static. There is no database and no Node server.

## Licensing

- **Code** (everything that is not content): MIT. See `LICENSE`.
- **Content** (the promise records, evidence summaries, methodology prose): Creative Commons Attribution-ShareAlike 4.0. See `LICENSE`.

This split lets other Indian states fork the project and adapt it without legal friction, while keeping the public-interest record under a copyleft licence.

## How to help

Read `CONTRIBUTING.md`. The short version: if you know that a promise has been delivered, started, or abandoned, tell us through the submission form on the site, or open a pull request with a source from the hierarchy in `METHODOLOGY.md`.
