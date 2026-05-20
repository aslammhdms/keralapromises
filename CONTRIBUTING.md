# Contributing to Kerala Promises

Thank you for thinking about contributing. The whole project lives or dies on the quality of its evidence and the discipline of its voice, so please read this document before opening a pull request or an issue.

The voice rules in `BRIEF.md` Section 2 and the source hierarchy in `METHODOLOGY.md` are not suggestions. Pull requests that violate them will be closed with a pointer to the relevant section.

## Three ways to contribute

### 1. Tell us something has changed

If you have read in a Tier 1 to Tier 4 source (see `METHODOLOGY.md`) that a promise has been started, fulfilled, or evaded, the fastest way to tell us is the submission form linked from every page of the site. Fill in the form with the promise ID and a link to the source. Editors triage submissions weekly.

You do not need a GitHub account to use the form. You do not need to know how to write code.

### 2. Open a pull request

If you are comfortable with Git, open a pull request directly. The promise records live in `src/content/promises/`, one MDX file per promise. To add a status update, append an entry to the `status_updates` array in the frontmatter and update `current_status` if the new entry warrants it.

A valid status update entry looks like this:

```yaml
- date: 2026-09-15
  status: in_progress
  summary_en: "Cabinet approved the scheme. Implementation guidelines pending."
  summary_ml: "മന്ത്രിസഭ പദ്ധതിക്ക് അംഗീകാരം നൽകി. നടപ്പാക്കൽ മാർഗ്ഗനിർദ്ദേശങ്ങൾ വരാനുണ്ട്."
  editor: your_github_handle
  evidence:
    - type: gazette
      url: https://kerala.gov.in/gazette/2026/15-09-cabinet.pdf
      archive_url: ""
      publisher: government_of_kerala
      published: 2026-09-15
      excerpt_en: "The Cabinet has approved the scheme..."
```

`archive_url` is filled automatically by the archive-mirror GitHub Action after the pull request merges. You do not need to fill it in yourself.

Open the pull request against `main`. At least one editor must approve before it can merge. Direct commits to `main` are blocked.

### 3. Fix an error in the record

Errors happen. If you find one — a promise mis-categorised, an evidence excerpt misquoted, a translation off, a date wrong — open an issue or a pull request with the correction. The history of the change stays in Git forever, so anyone can see what changed and why.

## What you can submit

- A new status update on an existing promise, with a source from the hierarchy.
- A correction to an existing entry: a fixed quotation, a corrected date, a better translation, a clearer summary.
- A new evidence entry on an existing status update.
- An archive.org URL for an evidence entry whose `archive_url` is empty (rare; usually the Action handles this).
- A typo, layout fix, or accessibility improvement.

## What you should not submit

- A new promise that is not in the UDF 2026 manifesto. We track only manifesto commitments. Off-manifesto government actions are recorded on `/initiatives` (Phase 2), not under promises.
- A status change that interprets a politician's tweet, a party press release, or a media opinion piece as a fact about government action. These are not admissible. See `METHODOLOGY.md` Section "Excluded sources".
- A change that adds an adjective. "Failed", "broken", "betrayed", "delivered", "kept their word" — never. Use the four status enums and let the evidence speak.
- A change to a status that requires a formal document (anything moving to `fulfilled` or `evaded`) without one. Editors will ask for one and the pull request will block until it is provided.
- A new opinion piece, analysis page, or commentary. The site does not editorialise.

## How status changes are reviewed

Editors check four things on every status-change pull request:

1. **Is the source admissible?** Does it match one of the tiers in `METHODOLOGY.md`?
2. **Does the source actually say what the summary claims?** Editors will read the source.
3. **Is the new status the correct one?** Slow progress is `in_progress`, not `evaded`. Cabinet approval is `in_progress`, not `fulfilled` — `fulfilled` requires a gazette or verified on-ground delivery.
4. **Is the language neutral?** The voice rules apply.

If any of these fails, an editor will leave a comment and ask you to revise.

## Conflict of interest

If you work for a political party, a campaign, a government department, an evidence publisher, or an organisation whose work is named in the promise you are editing, please mention this in the pull request description. It does not bar you from contributing. It just goes into the record, so the audit trail is honest.

## Translations

Malayalam translations are welcome. Guidelines:

- Use Malayalam script. Not Manglish.
- Keep numerals Indo-Arabic (123), not Malayalam numerals.
- Translate the meaning of the source, not the syntax of the English. A natural Malayalam sentence is better than a literal one.
- If the source quotation is in English in the original document, keep the English excerpt verbatim and add a Malayalam paraphrase, not a translation, in the body.

## Setting up locally

```bash
npm install
npm run dev
```

The site runs on `http://localhost:4321`. Edit a promise file in `src/content/promises/` and the page reloads.

Before you push, run:

```bash
npm run typecheck
npm run build
```

If either fails, fix it before opening the pull request.

## A note on tone

The hardest part of contributing to this project is not the YAML. It is the tone. Read a few existing promise records and the methodology page before writing your own copy. Match their dryness. If you find yourself adding a word that gives the reader a feeling rather than a fact, take it out.

We are ordinary people, not journalists. We may miss news, update slowly, or be unaware of developments on the ground. That is exactly why we need your help.
