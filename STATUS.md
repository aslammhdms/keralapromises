# STATUS — Kerala Promises scaffolding

Captured 2026-05-20 at the end of the scaffolding session. This is the maintainer's pickup sheet. It lists what is done, what is pending against the Section 12 acceptance criteria in `BRIEF.md`, and the exact commands to deploy.

Commits on `main` so far:

```
748a8d7 ci(archive): mirror evidence URLs to the Internet Archive
59f3e88 feat(api): JSON API and RSS feed
e6e9b66 feat(pages): promise list, detail, category, latest, prose pages, 404
2f61d43 feat(pages): home page
5951704 feat(design): Newsprint theme tokens and composite components
3ee24bb feat(layout): base layout and presentational components
f2e9565 docs: write methodology, about, and FAQ
df7e3e4 feat(content): seed three flagship placeholder promises
855f5ce feat(content): define content collection schemas
5d58f89 chore: establish repo structure and governance docs
99392a8 chore: scaffold Astro 5 + TypeScript strict project
```

## Acceptance criteria (BRIEF.md Section 12)

Two columns per item: status against the brief, then what is left.

| #  | Criterion | Status | Pending |
|----|-----------|--------|---------|
| 1  | `keralapromises.in` resolves over HTTPS, Cloudflare Pages | **deploy pending** | Connect repo to Cloudflare Pages; point domain |
| 2  | Home page: disclaimer, scorecard, countdown, flagship grid, good-faith note | **done** | – |
| 3  | `/promises` lists every promise, filterable by category and status, searchable | **done** | Pagefind UI is not wired; in-page filter handles category/status/keyword. Add Pagefind UI if the dataset grows past ~150 entries. |
| 4  | Detail page: manifesto excerpt, status, timeline, evidence cards w/ archive links, Edit on GitHub | **done** | Archive links surface "archive copy pending" until the Action runs after a real merge |
| 5  | Methodology, About, FAQ written and reviewed | **drafted; review pending** | Maintainer review pass before launch — the prose is the credibility surface |
| 6  | At least 15 flagship promises with real manifesto content | **3 of 15** | Full manifesto extraction is the next phase; the three placeholders exercise the schema and UI |
| 7  | Tally form wired; submissions land in editor dashboard | **stub URL** | Create the form in Tally, replace `TALLY_FORM_URL` constant in `src/components/SubmitTip.astro` |
| 8  | `/api/promises.json` validates against documented schema | **done** | Schema documented in `/methodology` once the maintainer review pass lands |
| 9  | `/rss.xml` validates as RSS 2.0 | **done** | – |
| 10 | Archive-mirror Action runs successfully on a test PR | **wired, not yet exercised** | Open a test PR that adds an evidence URL with an empty `archive_url`; confirm the bot commit lands |
| 11 | Lighthouse ≥95 on Performance / A11y / Best Practices / SEO over 3G | **untested** | Run after deploy on a representative URL set: `/`, `/promises`, `/promises/<slug>`, `/methodology` |
| 12 | axe-core passes with zero serious issues | **untested** | Run after deploy or via `npx @axe-core/cli http://localhost:4321/` against `npm run preview` |
| 13 | Public GitHub repo with README, LICENSE, METHODOLOGY, CONTRIBUTING, CODE_OF_CONDUCT, BRIEF | **done locally** | Create GitHub repo, push, mark Public |

## Things shipped that weren't on the brief checklist

- **`_headers` and `_redirects`** in `public/` for Cloudflare Pages — cache rules for static assets, JSON, RSS; basic security headers; HSTS preload-ready.
- **`robots.txt`** permitting all and linking the sitemap index.
- **`ProseLayout.astro`** — shared prose styling for methodology / about / FAQ; the Hallmark `.hp-prose` scope lives there.
- **`.hallmark/log.json`** — Hallmark project memory; first entry is the home page build. Next Hallmark run on this repo will rotate macrostructure off Stat-Led automatically.
- **Newsprint token system** in `src/styles/global.css` — locked at Hallmark Step 6. Every colour and font in the component layer references a `--color-*` or `--font-*` token; no hex values are inlined.
- **Tiranga top stripe + `UDF 2026 manifesto tracker` subtitle** in the masthead. Both are scope/identity markers, not visual identity drawn from a party palette.
- **Cabinet content collection (`/cabinet`, `/cabinet/<slug>`)**. Added at the maintainer's request — links each promise to the responsible minister by portfolio mapping. Three placeholders (CM, Health, Welfare) sit in `src/content/cabinet/` with `placeholder: true` so the UI surfaces an amber "Placeholder" badge wherever a stub appears. Names and constituencies fill in from gazette + oath-ceremony records. JSON API gains `responsible_minister` on every promise.

## Things deliberately deviated from the brief

These are notes for the maintainer; flip them back if you disagree.

- **Latest updates as a list, not a carousel.** Brief Section 6 item 1 says "carousel"; Section 8 forbids splash animations and scroll-jacking. A reverse-chronological list is faster, accessible, and shows all five updates without interaction.
- **`@astrojs/cloudflare` adapter removed.** Brief Section 14 item 1 lists it; on a fully static site (`output: "static"`) it produces a Worker bundle that fails on Windows with a missing-chunks error and adds no value. Re-add when a Phase 2 Worker (citizen-tip intake, BRIEF Section 3) ships.
- **`manifesto_page` is optional on the schema.** Brief Section 5.1 shows it as required; the three placeholder promises don't have verified page numbers yet, and inventing them would violate the evidence discipline. The promise detail UI shows "page reference pending verification" when the field is absent.
- **TERM_START moved from 2026-05-09 (brief Section 10 example JSON) to 2026-05-18** — the actual UDF oath ceremony date per the maintainer's correction. Term_end stays at 2031-05-23 per the brief. The countdown, JSON API, and cabinet `took_office` all reflect 2026-05-18.

## What to run next (the deploy path)

```bash
# 1. Push to GitHub
gh repo create keralapromises/keralapromises --public --source . --remote origin --push

# 2. Connect Cloudflare Pages
#    Dashboard: Workers & Pages → Create application → Pages → Connect to Git
#    Pick the keralapromises repository.
#    Framework preset: Astro
#    Build command:    npm run build
#    Output directory: dist
#    Node version:     22  (set NODE_VERSION=22 in env vars)

# 3. Point the domain (Cloudflare → Pages → Custom domains → Add)
#    keralapromises.in   → CNAME to <project>.pages.dev (automatic if registrar is Cloudflare)

# 4. Create the Tally form, then replace TALLY_FORM_URL in:
#    src/components/SubmitTip.astro

# 5. Open a small test PR that adds a real evidence URL with archive_url: ""
#    and confirm .github/workflows/archive-mirror.yml runs and writes
#    archive_url back via a follow-up commit.

# 6. Run Lighthouse and axe locally before announcing
npm run build && npm run preview
# in a second shell:
npx lighthouse http://localhost:4321/ --preset=mobile --quiet
npx @axe-core/cli http://localhost:4321/
```

## Phase 2+ ideas captured but not built (per Section 13)

`/initiatives` page (off-manifesto government actions), Malayalam locale across all pages, OG image generator for individual promises, Keystatic CMS UI wiring, citizen-tip Worker that opens GitHub issues, Lighthouse and axe runs in CI.

None of these blocks Phase 1.

## File map (skimmable)

- `src/content/` — promises, categories, sources, prose pages
- `src/components/` — Hallmark-themed UI (StatusBadge, Scorecard, Countdown, PromiseCard, EvidenceCard, StatusTimeline, primitives)
- `src/layouts/` — BaseLayout, ProseLayout
- `src/pages/` — every route in Section 6 Phase 1
- `src/pages/api/promises.json.ts` — public JSON API
- `src/pages/rss.xml.ts` — RSS 2.0 feed
- `src/lib/` — `status.ts` (scorecard + latest updates), `dates.ts` (term math), `i18n.ts`
- `src/styles/global.css` — Newsprint token system (Hallmark stamp at the top)
- `.github/workflows/archive-mirror.yml` + `scripts/mirror-evidence.mjs` — archive.org mirror
- `public/_headers`, `public/_redirects`, `public/robots.txt` — Cloudflare Pages config
- `BRIEF.md` — source of truth (do not edit without versioning)
- `METHODOLOGY.md` — same prose as `/methodology`, for GitHub readers
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE`, `README.md` — governance
