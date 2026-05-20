# Kerala Promises — Project Brief & Build Prompt

> Single source of truth for the keralapromises.in build. Commit this to the repo root as `BRIEF.md`. Feed Section 14 to Claude Code as the kickoff prompt.

---

## How to use this document

This file plays three roles:

1. **Human onboarding doc.** Any new contributor reads this first.
2. **AI agent context.** Reference this from `CLAUDE.md` so Claude Code (and any future agent) inherits the full project context every session.
3. **Build prompt.** Section 14 at the bottom is a self-contained prompt to paste into Claude Code at the start of the scaffolding session, *after* you've installed `nutlope/hallmark` in the project.

Install Hallmark first:

```bash
mkdir keralapromises && cd keralapromises
git init
npx skills add nutlope/hallmark
claude
```

Then paste Section 14.

---

## 1. What we're building

**Kerala Promises** (`keralapromises.in`) is a public, evidence-based, non-partisan ledger that tracks every commitment made by the United Democratic Front (UDF) government of Kerala in its 2026 election manifesto, over the full 5-year term from May 2026 to May 2031.

It is **not** a political website. It is **not** journalism. It is **not** activism. It is a *public notepad* — maintained by ordinary citizens so the people of Kerala don't forget what was promised to them.

### Key facts the site is built around

- 2026 Kerala Legislative Assembly election held 9 April 2026; results declared 4 May 2026.
- UDF won 102 of 140 seats — largest mandate since 1977.
- The UDF manifesto was released on 2 April 2026, structured as a set of "Indira guarantees".
- The term ends in May 2031.

### What the site does

- Lists every concrete, measurable promise from the manifesto.
- Records the current status of each promise (Pending / In Progress / Fulfilled / Evaded) with evidence.
- Shows a full timeline of status changes for each promise, with citations.
- Mirrors every evidence URL to the Internet Archive on commit, so citations survive link rot.
- Publishes a JSON API and RSS feed so journalists, students, and other trackers can build on the data.
- Lives on GitHub as a public template repo so other states can fork it.

### What the site does NOT do

- It does not editorialize. No opinion pieces. No analysis. No commentary.
- It does not compare parties. Opposition manifestos are out of scope for MVP.
- It does not host citizen forums, comments, or social features.
- It does not accept anonymous accusations without sources.

---

## 2. Tone, voice, positioning

This is the most important section. The whole project lives or dies on credibility, and credibility is mostly a function of tone.

### Voice rules

- **First person plural.** "We track…", "We are not…". Plural because it's a public notepad, not one person's blog.
- **No adjectives that take a side.** "Failed", "broken", "betrayed", "delivered", "kept their word" — never. Use the four status enums (defined below) and let evidence speak.
- **No exclamation marks. Anywhere. Ever.**
- **No hashtags. No emoji except the four status icons (✓ ◑ ✗ ○).**
- **Good-faith default.** "We want this government to succeed in fulfilling these promises. We are not here to root for failure."
- **Plain language, short sentences.** A 75-year-old in Thrissur and a 22-year-old in Kannur should both read the home page comfortably.

### The disclaimer (place prominently on every page)

> This is not a government or political website. It is an independent public notepad maintained by the people of Kerala. We hold no affiliation with any political party. We track facts, not opinions.

### The "good faith" note (place on About and Methodology pages)

> This tracker was created in good faith. We believe elected governments should be held accountable to the promises they made publicly, and we want the UDF government to succeed in fulfilling them for the people of Kerala. We are not here to root for failure.
>
> We are ordinary people, not journalists. We may miss news, update slowly, or be unaware of developments on the ground. That is exactly why we need your help. If you know that something has been done, started, or abandoned, please tell us via the submission form.

---

## 3. Tech stack

Locked. No improvising.

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **Astro 5** (TypeScript) | Server-rendered, near-zero JS by default, great SEO, content collections perfect for this use case |
| Styling | **Tailwind CSS 4** | Hallmark assumes Tailwind |
| Content authoring | **MDX files in Git + Keystatic** | Editors get a UI; Git provides the audit trail |
| Auth for editors | **GitHub OAuth via Keystatic** | No user database |
| Hosting | **Cloudflare Pages** | Free, fast, DDoS-protected, user already has CF account |
| Domain | **keralapromises.in** via Cloudflare Registrar | At-cost pricing |
| CDN / DNS | Cloudflare | Same provider as hosting |
| Citizen submissions | **Tally form** (Phase 1), Worker + GitHub issue (Phase 2) | Tally is free, fast to ship |
| Archive mirroring | **GitHub Action** that hits `web.archive.org/save/<url>` on PR merge | Critical for 5-year link integrity |
| Search | **Pagefind** | Static, runs at build time, no service to maintain |
| Analytics | **Cloudflare Web Analytics** | Privacy-respecting, no cookies, free |
| Design system | **Hallmark skill** (`nutlope/hallmark`) | Avoids generic AI aesthetic |

No JavaScript framework on the client. No Node server. No database. The site is fully static; dynamic features (citizen tips) are handled by Tally or a single Cloudflare Worker.

---

## 4. Repository structure

```
keralapromises/
├── .github/
│   └── workflows/
│       └── archive-mirror.yml      # archives evidence URLs on PR merge
├── .claude/
│   └── skills/
│       └── hallmark/               # installed via npx skills add
├── src/
│   ├── content/
│   │   ├── config.ts               # Zod schemas for content collections
│   │   ├── promises/               # one MDX file per promise
│   │   │   ├── udf-2026-001-*.mdx
│   │   │   └── ...
│   │   ├── categories/             # health.json, education.json, ...
│   │   ├── sources/                # trusted publisher registry
│   │   └── pages/                  # methodology.mdx, about.mdx, faq.mdx
│   ├── pages/
│   │   ├── index.astro             # home
│   │   ├── promises/
│   │   │   ├── index.astro         # full list
│   │   │   └── [id].astro          # promise detail
│   │   ├── category/[slug].astro
│   │   ├── methodology.astro
│   │   ├── about.astro
│   │   ├── faq.astro
│   │   ├── latest.astro            # all status updates feed
│   │   ├── initiatives.astro       # off-manifesto govt actions (Phase 4)
│   │   ├── rss.xml.ts
│   │   └── api/
│   │       └── promises.json.ts    # public JSON API
│   ├── components/
│   │   ├── PromiseCard.astro
│   │   ├── PromiseDetail.astro
│   │   ├── StatusBadge.astro
│   │   ├── StatusTimeline.astro
│   │   ├── EvidenceCard.astro
│   │   ├── Countdown.astro
│   │   ├── Scorecard.astro
│   │   ├── DisclaimerBanner.astro
│   │   ├── LanguageToggle.astro
│   │   └── ...
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── status.ts               # status calc helpers
│   │   ├── i18n.ts
│   │   └── dates.ts                # days-in-office, days-remaining
│   └── i18n/
│       ├── en.json
│       └── ml.json                 # Phase 3
├── public/
│   ├── og-preview.webp
│   ├── favicon.svg
│   ├── manifesto/
│   │   └── udf-2026.pdf            # the source manifesto, committed
│   └── ...
├── keystatic.config.ts
├── astro.config.mjs
├── tailwind.config.ts
├── wrangler.toml                   # Phase 2 Worker
├── CLAUDE.md                       # points to BRIEF.md
├── BRIEF.md                        # this file
├── METHODOLOGY.md                  # full methodology (mirrored on /methodology)
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE                          # MIT for code, CC-BY-SA 4.0 for content
└── README.md
```

---

## 5. Content model

### 5.1 Promise schema (frontmatter for each MDX file)

```yaml
# src/content/promises/udf-2026-014-health-insurance-25l.mdx
id: udf-2026-014
slug: oommen-chandy-health-insurance-25-lakh
title_en: "Oommen Chandy Health Insurance — ₹25 lakh per household"
title_ml: "ഉമ്മൻ ചാണ്ടി ആരോഗ്യ ഇൻഷുറൻസ് — കുടുംബത്തിന് ₹25 ലക്ഷം"
manifesto: udf-2026
manifesto_page: 14
category: health
flagship: true
target:
  metric: households_covered
  value: "all kerala households"
  deadline: 2031-05-23
beneficiary: all_households
scope: statewide
priority: high
current_status: pending           # pending | in_progress | fulfilled | evaded
status_updates:
  - date: 2026-05-20
    status: pending
    summary_en: "Promise recorded from manifesto. No government action yet."
    summary_ml: "മാനിഫെസ്റ്റോയിൽ നിന്ന് രേഖപ്പെടുത്തി. സർക്കാർ നടപടി ഒന്നുമില്ല."
    editor: editors
    evidence:
      - type: manifesto
        url: https://keralapromises.in/manifesto/udf-2026.pdf
        archive_url: ""              # filled by GH Action
        publisher: indian_national_congress
        published: 2026-04-02
        excerpt_en: "Oommen Chandy Health Insurance scheme providing ₹25 lakh coverage per household."
```

The MDX body (below the frontmatter) contains long-form context: background, related policies, definitions, why this matters. Used on the promise detail page.

### 5.2 Status taxonomy (the four enum values)

| Status | Icon | Definition |
|--------|------|------------|
| `pending` | ○ | No government action yet. Default state at term start. |
| `in_progress` | ◑ | A credible source confirms the government has initiated or is actively pursuing the promise. A gazette is not required. |
| `fulfilled` | ✓ | Requires a formal document (gazette notification, bill enacted, official order) **or** verified on-ground evidence that beneficiaries are receiving the benefit, sourced from Tier 1 or Tier 2. |
| `evaded` | ✗ | The government has taken action that makes fulfilment structurally impossible (e.g. privatising what was promised to be revived, repealing what was pledged to be enacted). *Slow progress is not evasion; evasion means the door is closed.* |

There is no "Broken", "Failed", "Partial", or "Stalled". Four states. That's the entire ontology.

### 5.3 Source hierarchy

A status change is only valid with evidence from one of these tiers. Lower numbers outrank higher.

1. **Government gazette or government order** (G.O.). Gold standard.
2. **Kerala state government press release** or official cabinet/department statement.
3. **PTI / ANI wire copy** carried by a Tier-A publication: *Manorama, Mathrubhumi, The Hindu, Indian Express, The News Minute, Onmanorama, Deccan Herald, Hindustan Times, Times of India* (Kerala desk).
4. **Long-form journalism** from the above publications with named reporter and dateline.

Excluded from evidence: party press releases, politicians' tweets, politicians' interviews, opinion pieces, editorials, social media posts, WhatsApp forwards, anonymous sources. Period.

### 5.4 Categories (initial set)

`health`, `education`, `agriculture`, `infrastructure`, `women_child`, `welfare_pensions`, `industry_jobs`, `technology`, `environment`, `law_order`, `fiscal`, `culture_heritage`, `transport`, `housing`, `tribal_dalit`. Add as the manifesto demands.

### 5.5 Example promises (illustrative — final set comes from manifesto extraction)

```yaml
# udf-2026-001
title_en: "Free KSRTC bus travel for women across Kerala"
category: women_child
target: { metric: scheme_operational, deadline: 2027-05-23 }
flagship: true

# udf-2026-002
title_en: "Dedicated department for senior citizens' welfare and protection"
category: welfare_pensions
target: { metric: department_constituted, deadline: 2027-05-23 }
flagship: true

# udf-2026-003
title_en: "Oommen Chandy Health Insurance — ₹25 lakh per household"
category: health
target: { metric: households_covered, value: all, deadline: 2031-05-23 }
flagship: true
```

---

## 6. Pages to build

### MVP (Phase 1)

1. **`/` — Home.** Disclaimer banner at top. Hero: site name, tagline, the four-state scorecard (counts pulled at build time from content collection). Live countdown (days in office / days remaining). Latest 5 status updates carousel. The 15 flagship promises in a card grid. CTA to "Submit an update" (Tally). The "good faith" note. Footer.

2. **`/promises` — Full list.** All ~80 promises, filterable by category and status, with search (Pagefind). One-line per row on desktop, card layout on mobile.

3. **`/promises/[slug]` — Promise detail.** Headline. Status badge. Manifesto excerpt verbatim with page reference. Long-form context (MDX body). Full status timeline with evidence cards. Related promises. "Edit this on GitHub" link. "Submit an update" link.

4. **`/category/[slug]` — Category landing.** Same as `/promises` but filtered.

5. **`/methodology` — Methodology.** Full source hierarchy, status definitions, conflict-of-interest policy, correction process. Long, careful, conservative writing.

6. **`/about` — About.** Who runs the site, why, how to contribute, contact email, the good-faith note.

7. **`/faq` — FAQ.** Likely 10–15 questions.

8. **`/latest` — All updates.** Reverse-chronological feed of every status update ever made.

9. **`/rss.xml` — RSS feed** of status updates.

10. **`/api/promises.json` — JSON API.** Full dump of promises and current status. Documented schema in `/methodology`.

11. **`/404`** — Bilingual, friendly.

### Phase 2

12. **`/initiatives` — Off-manifesto government actions.** Things the government did that weren't promised. Same evidence rules.

### Phase 3

13. Malayalam locale across all of the above.

---

## 7. Components

- `<DisclaimerBanner />` — sticky top banner, dismissible, reappears on each load. Black background, white text, no decoration.
- `<Scorecard />` — four big numbers + percentage bar. Pulls from `getCollection('promises')` at build time.
- `<Countdown />` — days in office / days remaining. Computed from oath date. Updates on page load (no realtime ticker needed).
- `<PromiseCard />` — title, status badge, category, deadline, last-updated. Used on home grid and list pages.
- `<StatusBadge status="pending|in_progress|fulfilled|evaded" />` — icon + label, colour-coded.
- `<StatusTimeline />` — vertical timeline of every status update with dates and evidence cards.
- `<EvidenceCard />` — source type, publisher, date, excerpt, two links (original + archive.org).
- `<CategoryPill />` — small coloured pill linking to category page.
- `<LanguageToggle />` — EN / മ. (Phase 3 functional; Phase 1 visible-but-disabled to signal intent.)
- `<ShareCard />` — generates OG image with promise title + status for social sharing.
- `<EditOnGitHub />` — deep links to the file on GitHub for transparency.
- `<SubmitTip />` — link/button to the Tally form, contextual (passes promise ID as query param).

---

## 8. Design direction

**Defer all visual decisions to Hallmark.** Do not invent typography, colours, or layout from scratch.

When kicking off the build with Claude Code, use this invocation:

```
/hallmark build the home page for "Kerala Promises", a non-partisan public accountability ledger for Kerala state government's 2026–2031 manifesto promises. Audience: civically engaged Indian readers, 22–75, bilingual (English now, Malayalam later). Tone: institutional, sober, trustworthy, not flashy, not playful. Think: civic-tech meets long-form journalism. References to study (if needed): propublica.org, fountainink.in, electionsdata.org. Avoid: SaaS gradients, hero illustrations of diverse cartoon people, generic shadcn dashboards, blue-and-white blandness.
```

Subsequent pages reuse the macrostructure and tokens locked from the home page build.

### Hard constraints Hallmark must respect

- **Malayalam-friendly typography.** When the language toggle is set to മ., body type must render Malayalam cleanly. Use a stack like `"Noto Sans Malayalam", "Manjari", system-ui, sans-serif` for body, with a serif option for headings if Hallmark proposes one.
- **No emoji except the four status icons** (✓ ◑ ✗ ○) — and even those should be glyph-styled, not full-colour Apple emoji.
- **High contrast.** WCAG AA minimum across every theme Hallmark proposes.
- **Mobile-first.** Kerala is mobile-heavy; the list and detail pages must feel native on a 360px viewport.
- **No splash animations, no scroll-jacking, no parallax.** Civic seriousness over delight.

After the first build, instruct Hallmark to `lock the system` so a `design.md` is emitted and future pages stay consistent.

---

## 9. Bilingual approach

- All UI strings in `src/i18n/en.json` and `src/i18n/ml.json` from day one (even if `ml.json` is initially a copy of `en.json` to be translated later).
- All content frontmatter has `_en` and `_ml` field pairs from day one.
- Phase 1 ships English-only public-facing; the `<LanguageToggle />` is visible but disabled.
- Phase 3 translates 15 flagship promises first, then expands.
- Malayalam translation guideline: use the script people actually read in newspapers (Malayalam script), not Manglish. Numerals stay Indo-Arabic (123), not Malayalam numerals.

---

## 10. SEO & API

### SEO

- Per-page `<title>` and `<meta description>` derived from frontmatter.
- OG image generated per promise via `@vercel/og` or a similar static-build OG generator. Promise OG shows: status icon, title (truncated), category, last-updated.
- `sitemap.xml` generated by `@astrojs/sitemap`.
- `robots.txt` permits all.
- JSON-LD `Dataset` schema on `/promises` and `Article` schema on each promise detail page.
- Canonical URLs.

### JSON API

`GET /api/promises.json` returns:

```json
{
  "version": "1",
  "generated_at": "2026-05-20T08:00:00Z",
  "manifesto": "udf-2026",
  "term_start": "2026-05-09",
  "term_end": "2031-05-23",
  "totals": { "pending": 80, "in_progress": 0, "fulfilled": 0, "evaded": 0 },
  "promises": [ { "id": "...", "title_en": "...", "status": "...", ... } ]
}
```

The schema is documented on `/methodology` and considered a public contract. Breaking changes require a version bump.

`GET /rss.xml` returns the latest 50 status updates as an RSS 2.0 feed.

---

## 11. Audit trail & archive.org

### Audit trail

Every promise file is in Git. Every status change is a commit. Every promise detail page shows an "Edit history on GitHub" link that opens the file's commit log. Direct commits to `main` are blocked; status changes must go through pull requests. `CODEOWNERS` requires at least one reviewer.

### Archive.org mirroring

`.github/workflows/archive-mirror.yml` runs on every push to `main`. For every promise file changed in the diff, it extracts evidence URLs that lack an `archive_url`, calls `https://web.archive.org/save/<url>`, waits for the snapshot, and commits the resulting archive URL back into the file as a follow-up commit. Failure to archive is logged but does not block the deploy.

---

## 12. MVP acceptance criteria

The MVP is shippable when **all** of the following are true:

1. ☐ keralapromises.in resolves over HTTPS, served from Cloudflare Pages.
2. ☐ The home page renders the disclaimer banner, scorecard, countdown, flagship grid, and good-faith note.
3. ☐ `/promises` lists every promise loaded from `src/content/promises/`, filterable by category and status, searchable via Pagefind.
4. ☐ Each promise has a detail page with manifesto excerpt, current status, status timeline, evidence cards with archive.org links, and an "Edit on GitHub" link.
5. ☐ `/methodology`, `/about`, `/faq` are written and reviewed.
6. ☐ At least the 15 flagship promises are loaded with real manifesto-sourced content.
7. ☐ The Tally form is wired up; submissions land in a dashboard the editors check weekly.
8. ☐ `/api/promises.json` validates against the documented schema.
9. ☐ `/rss.xml` validates as RSS 2.0.
10. ☐ The archive-mirror GitHub Action runs successfully on a test PR.
11. ☐ Lighthouse scores ≥95 on Performance / Accessibility / Best Practices / SEO on a cold load over a throttled 3G connection.
12. ☐ The site passes axe-core accessibility checks with zero serious issues.
13. ☐ The repo is public on GitHub with a README, LICENSE, METHODOLOGY, CONTRIBUTING, CODE_OF_CONDUCT, and this BRIEF committed.

---

## 13. Out of scope (Phase 1)

Do not build any of this until Phase 1 is shipped:

- Citizen accounts / login
- Comments on promises
- Email notifications / newsletter
- Opposition manifesto tracking
- LDF 2021 retrospective scorecard
- Mobile app
- Analytics dashboards beyond Cloudflare Web Analytics
- Embeddable widgets
- AI-generated summaries of evidence

These are all reasonable Phase 2+ ideas. They are explicitly off the table for v1.

---

## 14. The Claude Code kickoff prompt

> Paste everything inside the box below as your first message in Claude Code, after running `npx skills add nutlope/hallmark` in the empty repo.

---

You are scaffolding the codebase for **Kerala Promises** (`keralapromises.in`), a public, non-partisan ledger that tracks the Kerala UDF government's 2026 election manifesto promises over the 2026–2031 term. The full project brief is in `BRIEF.md` at the repo root — read it before doing anything else and follow it strictly. The tech stack is locked: Astro 5 + TypeScript, Tailwind CSS 4, MDX content collections, Keystatic CMS, Cloudflare Pages, GitHub Actions for archive.org mirroring. Do not substitute any of these.

Your task in this session is to produce a working Phase 1 MVP per the acceptance criteria in Section 12 of the brief. Specifically:

1. Initialize the Astro project with TypeScript strict mode, Tailwind 4, MDX, sitemap, Pagefind, and Cloudflare adapter.
2. Create the repo structure exactly as Section 4 of the brief specifies.
3. Define the content collections in `src/content/config.ts` with Zod schemas matching Section 5.1 of the brief.
4. Wire up Keystatic per `keystatic.config.ts`, with GitHub OAuth and field schemas matching the content collections.
5. Build the components listed in Section 7, deferring all visual decisions to Hallmark.
6. Build the pages listed in Section 6 for Phase 1 (items 1–11).
7. Create three real example promises from the illustrative list in Section 5.5 to populate the site during development. Mark each as `current_status: pending` with one manifesto-type evidence entry. The actual full manifesto extraction is a separate phase — do not invent promises beyond these three placeholders.
8. Implement the archive-mirror GitHub Action per Section 11.
9. Write the methodology, about, and FAQ pages per the voice rules in Section 2 and the source hierarchy in Section 5.3. These are the highest-stakes pages on the site for credibility; write them carefully and conservatively.
10. Set up the Cloudflare Pages deployment configuration. Do not deploy — leave that as a manual step for the maintainer.

For the design pass, use Hallmark. Invoke it with:

```
/hallmark build the home page for "Kerala Promises", a non-partisan public accountability ledger for Kerala state government's 2026–2031 manifesto promises. Audience: civically engaged Indian readers, 22–75, bilingual (English now, Malayalam later). Tone: institutional, sober, trustworthy, not flashy, not playful. Think civic-tech meets long-form journalism. Avoid SaaS gradients, hero illustrations of cartoon people, generic shadcn dashboards, blue-and-white blandness.
```

After the home page is built and the user approves the visual direction, run `lock the system` so Hallmark emits a portable `design.md` and the rest of the pages stay consistent.

Strict rules for this session:

- Read `BRIEF.md` end-to-end before writing any code. If anything in this prompt contradicts the brief, the brief wins.
- Voice and tone rules in Section 2 of the brief are non-negotiable. Apply them to every word of copy you write — including button labels, error messages, and 404 page text.
- Do not use emoji except the four status icons (✓ ◑ ✗ ○).
- Do not invent promises beyond the three placeholders. Do not editorialize on the three placeholders' status. They are `pending`.
- Do not add any feature listed in Section 13 (Out of Scope).
- Commit in small, semantic chunks with clear messages. Use Conventional Commits.
- At the end of the session, write a `STATUS.md` listing what's done, what's pending against the Section 12 acceptance criteria, and the exact next commands the maintainer should run to deploy.

Begin by reading `BRIEF.md`, then propose the first 5 commits you intend to make. Wait for approval before writing code.

---

*End of brief. Last updated 2026-05-20.*