---
description: Sweep Tier-A news for updates to tracked promises and cabinet portfolios, draft the file changes, validate, commit atomically, and open a PR.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, WebSearch, WebFetch, TaskCreate, TaskUpdate, AskUserQuestion
---

You are running the `/refresh-tracker` command for **Kerala Promises** (`keralapromises.in`). This command refreshes the public ledger from Tier-A news, drafts the file changes, validates, commits atomically, and opens a pull request for review.

The full project context lives in `BRIEF.md` at the repo root. **Read it first.** Voice rules in Section 2 and the source hierarchy in Section 5.3 are non-negotiable.

---

## 1. Anchor

- Convert "today" to an absolute ISO date and use it consistently. Do not use relative dates like "yesterday" anywhere in commit messages or status entries.
- Read `BRIEF.md` end-to-end before running searches.
- Read the contents of `src/content/sources/index.json` so you know which publishers are Tier-A on this site's registry.
- Read `src/content/config.ts` to confirm the schemas you'll be writing against.

## 2. Inventory current state

Before searching anything, build a list of work targets:

- `git status` — confirm a clean working tree. If it isn't clean, stop and ask the user.
- `git branch --show-current` — note the branch you started on so you can return to it.
- Glob `src/content/promises/*.mdx` — list every promise. For each: id, current_status, the date of its most recent `status_updates` entry.
- Glob `src/content/cabinet/*.mdx` — list every minister. For each: name, current `portfolio_en`, `portfolio_pending_gazette` flag, and the date implied by `took_office`.

This inventory is your idempotency check. **Do not re-record a status update for an event that is already on the file.** Compare the publication date of any candidate evidence against the dates already in `status_updates` before adding anything.

## 3. Run the news sweep — targeted, parallel, Tier-A only

Budget: roughly one to two searches per non-fulfilled promise, plus a small set for cabinet news. Aim for ~20–25 searches max in a single run.

Per-promise: search for government action on each promise whose `current_status` is `pending` or `in_progress`. Skip promises already `fulfilled` or `evaded`.

Cabinet: one or two searches for portfolio changes, gazette notifications, cabinet reshuffles, or new GOs since the last touch.

Run independent searches in parallel.

**Source discipline (BRIEF §5.3):**
- Tier 1 — government gazette / G.O. (preferred for `fulfilled`).
- Tier 2 — Kerala state press release or official cabinet/department statement.
- Tier 3 — Tier-A news outlet listed in `src/content/sources/index.json`, with named reporter and dateline.
- Tier 4 — Tier-A long-form.

Excluded: party press releases, politicians' tweets, opinion pieces, editorials, social media, anonymous sources, wire copy not carried by a registered Tier-A. If your only hit is from an outlet not in the registry, **flag it but do not record it**.

## 4. Status-flip thresholds (BRIEF §5.2 — quote exactly)

- `pending` → `in_progress` requires a credible Tier-A source confirming the government has initiated or is actively pursuing the promise. A gazette is **not** required.
- `in_progress` → `fulfilled` requires a formal document (gazette notification, bill enacted, official order) **or** verified on-ground evidence that beneficiaries are receiving the benefit, sourced from Tier 1 or Tier 2.
- `evaded` requires evidence that the government has taken action making fulfilment structurally impossible (privatising what was promised to be revived, repealing what was pledged to be enacted). Slow progress is **not** evasion.

**Single-Tier-A facts are recorded cautiously**: add the entry with a `note:` field explaining the single-source caveat. Do not flip status further than the evidence supports.

## 5. Draft the changes

For each verified finding:

**Promise files** — append a new entry to `status_updates`, do not edit existing entries. Each entry has:
- `date:` the date the event happened (cabinet meeting date, GO date, etc. — not today's date).
- `status:` the new status, only as high as evidence supports.
- `summary_en:` a sober one-paragraph summary. No charged adjectives. No exclamation marks. No emoji.
- `summary_ml:` optional Malayalam translation. If unsure, leave it off rather than guess.
- `editor: editors`
- `evidence:` array of evidence objects, ideally two from different Tier-A publishers. Use `type: longform` for Tier-A news reportage, `type: gazette` / `government_order` for Tier 1, `type: government_press_release` / `cabinet_statement` for Tier 2.

Also update `current_status` at the top of the frontmatter if it changes.

**Cabinet files** — when news reports a portfolio change, gazette publication, reshuffle, or resignation:
- Update `portfolio_en` to the announced allocation.
- Update `portfolios_categories` to match.
- Add the news URL to `source_urls`.
- Only flip `portfolio_pending_gazette: false` when you have a direct `compose.kerala.gov.in` gazette URL on file. Tier-A news reports of gazette publication are **not** sufficient to flip the flag.

## 6. Voice rules to apply to every line you write

From BRIEF §2:
- First person plural ("we track…").
- No adjectives that take a side: never "failed", "broken", "betrayed", "delivered", "kept their word".
- No exclamation marks.
- No emoji except the four status icons (✓ ◑ ✗ ○).
- Good-faith default. We want the government to succeed in fulfilling these promises.
- Plain language, short sentences.

## 7. Validate

After all drafts are written:

```bash
npm run typecheck
```

Then:

```bash
npm run build
```

If either fails, **stop, report the failure, and do not commit**. Fix the schema issue and re-validate before proceeding.

## 8. Commit atomically

One Conventional Commit per logical fact. Group small-but-related new entries (e.g. several entries on the same cabinet decision) but never bundle unrelated promises into one commit.

Commit-message style — match the existing repo log (`git log --oneline`):
- `feat(content): record cabinet approval of <thing>` for new in_progress / fulfilled status updates.
- `fix(content): <thing>` for corrections.
- `feat(cabinet): <thing>` for cabinet file changes.

Every commit body ends with:

```
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

## 9. Branch + PR — do NOT push to main

BRIEF §11 requires status changes to go through pull requests.

- Branch name: `refresh/YYYY-MM-DD` (e.g. `refresh/2026-05-21`). If a branch with that name already exists, append `-2`, `-3`, etc.
- Create the branch **before** the first commit: `git checkout -b refresh/YYYY-MM-DD`.
- All commits land on this branch, not on main.

After commits are made, **pause and confirm with the user before pushing**. Show:
- Branch name and number of commits.
- A short one-line summary of each commit.
- The proposed PR title and body.

Only after the user approves, run:

```bash
git push -u origin refresh/YYYY-MM-DD
gh pr create --title "..." --body "..." --base main
```

PR title: `chore(refresh): YYYY-MM-DD news sweep — <N> updates`.

PR body (use a HEREDOC):

```markdown
## Summary

News sweep for YYYY-MM-DD against the Tier-A registry. Recorded:
- <bullet per fact, linking to evidence URLs>

## Source discipline

- Single-Tier-A facts flagged with `note:` per BRIEF §5.3.
- No status flipped to `fulfilled` without Tier-1/Tier-2 evidence per BRIEF §5.2.

## Test plan

- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] Spot-check the rendered `/latest` and `/rss.xml` for ordering
- [ ] Confirm archive-mirror GitHub Action picks up new evidence URLs

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## 10. After the PR is open

- Print the PR URL.
- Return to the branch the user started on: `git checkout <previous-branch>`.
- Do not merge the PR. Reviewer approval is part of BRIEF §11 and is up to the maintainer.

---

## What this command does NOT do

- It does not extract new manifesto promises. Run `/refresh-tracker --extract` for that (separate flag, separate concerns).
- It does not edit `BRIEF.md`, schemas, source registry, or any page outside `src/content/promises/` and `src/content/cabinet/`.
- It does not push to `main` directly. Ever.
- It does not flip a status to `fulfilled` on a single Tier-A news source.

## On failure

If anything fails — clean tree check, typecheck, build, push, or `gh pr create` — stop and report. Do not try to "recover" by force-pushing, amending, or skipping hooks. The maintainer fixes underlying issues; the command does not paper over them.

## Optional: `--extract`

If the user invokes `/refresh-tracker --extract`, also propose new manifesto promise files for commitments not yet tracked. Same voice rules, same evidence discipline. Each new file starts at `current_status: pending` with one manifesto-type evidence entry dated `2026-04-02` (the UDF 2026 manifesto release date). New files go in the same `refresh/YYYY-MM-DD` branch and PR.
