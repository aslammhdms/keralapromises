# Methodology

This document describes exactly how Kerala Promises records, evaluates, and updates promises. The same prose is served at <https://keralapromises.in/methodology> so that any reader can find it without leaving the site.

Our goal is that two thoughtful people reading this document, and then reading the record, agree on what changed and why. If a status decision on the site cannot be defended against this document, the decision is wrong.

## What we record

We record every concrete, measurable promise made in the UDF 2026 election manifesto, released by the Indian National Congress on 2 April 2026.

A promise is **concrete and measurable** when its fulfilment can be observed in the world: a scheme launched, a department constituted, a coverage ceiling met, a road built. Promises that are aspirational without a measurable outcome ("we will work tirelessly for the people") are not recorded as separate entries; we record the operational promises that follow from them.

We do not record off-manifesto government actions in the main register. These are recorded separately at `/initiatives` so that the record reflects the government's full activity without polluting the accountability ledger with items that were never promised.

## The four statuses

The status taxonomy is closed. There are four values. Anyone reading the site sees one of these four against every promise.

### Pending — ○

No government action yet. This is the default state for every promise at the start of the term. A promise stays `pending` until the conditions for `in_progress` are met.

### In Progress — ◑

A source in our hierarchy confirms that the government has initiated, announced, or is actively pursuing the promise. A formal document is not required at this stage. Examples that move a promise to `in_progress`:

- A cabinet decision approving the scheme.
- A government order constituting a committee to design or implement the promise.
- A budget allocation that names the promise as its purpose.
- A pilot in one or more districts, where the manifesto committed to statewide rollout.

Slow progress is `in_progress`. Difficulty is not failure.

### Fulfilled — ✓

Fulfilment requires one of the following:

1. A formal document — a gazette notification, an enacted bill, a published government order — that operationalises the promise to the level the manifesto committed to.
2. Verified on-ground evidence that the promised benefit is being delivered to the promised beneficiaries, sourced from Tier 1 or Tier 2 of the hierarchy below.

A pilot is not fulfilment. A rebranded existing scheme is not fulfilment. An announcement is not fulfilment.

If a promise contains multiple commitments (for example, "establish a department and allocate ₹100 crore"), `fulfilled` requires all of them.

### Evaded — ✗

`Evaded` is reserved for cases where the government has taken action that makes fulfilment structurally impossible. The door is closed.

Examples that move a promise to `evaded`:

- The state privatises what was promised to be revived.
- The state repeals what was promised to be enacted.
- The state announces, in a Tier 1 or Tier 2 source, that the promise will not be pursued.

**Slow progress is not evasion.** A promise that has not moved in four years is `pending` or `in_progress`. It becomes `evaded` only when an action has been taken that closes the door.

We use this status with great care. Editors require at least two independent admissible sources, including one Tier 1 or Tier 2, before moving a promise to `evaded`.

There is no "Broken", "Failed", "Partial", "Stalled", or "Watered Down". Four states. That is the entire ontology.

## Source hierarchy

Every status change is supported by at least one source from the tiers below. Lower numbers outrank higher: a Tier 1 source resolves a conflict with a Tier 3 source.

### Tier 1 — Government gazette or government order

The gold standard. Statutory publications of the Government of Kerala and government orders issued by departments. Required for any promise moving to `fulfilled` that depends on an instrument of law, regulation, or formal scheme.

### Tier 2 — Kerala state government press release or cabinet statement

Press notes from the Press Information Bureau, the Information and Public Relations Department, or named departments of the Government of Kerala. Cabinet briefings and official statements by ministers in their official capacity.

### Tier 3 — Wire copy (PTI or ANI) carried by a Tier-A publication

Wire copy carried by one of the following publications: Malayala Manorama, Onmanorama, Mathrubhumi, The Hindu, The Indian Express, The News Minute, Deccan Herald, Hindustan Times, The Times of India (Kerala desk).

Wire copy carried only by publications outside this list is not admissible at Tier 3.

### Tier 4 — Long-form journalism

Original reporting from the publications named in Tier 3, with a named reporter and a dateline. Investigative reports, on-ground reporting, and verified interviews carry weight here.

## Excluded sources

The following are not admissible as evidence for a status change. Editors will close pull requests that rely on them.

- Party press releases, including those of the Indian National Congress, the Communist Party of India (Marxist), and any other party.
- Tweets, Facebook posts, Instagram posts, WhatsApp forwards, and other social media output from any source, including politicians and government departments.
- Opinion pieces, editorials, and op-eds.
- Interviews with politicians, except where they make a categorical statement of government action that is independently confirmed in a Tier 1, 2, 3, or 4 source within seven days.
- Anonymous sources.
- Television panel discussions and political talk shows.
- Republished material on personal websites, blogs, or newsletters.

The exclusion list reflects what is operationally useful, not a judgement of the value of these formats. They are excluded because they cannot be falsified by another reader.

## How we evaluate evidence

For every status change, editors check four things:

1. **Admissibility.** Does the source sit in the hierarchy?
2. **Faithfulness.** Does the source actually say what the summary claims it says? Editors read the source and quote the relevant excerpt verbatim in the evidence entry.
3. **Status fit.** Is the new status the correct one given the evidence? `Fulfilled` requires a formal document or verified delivery. `Evaded` requires action that closes the door, not absence of progress.
4. **Conflict.** If two admissible sources disagree, the higher tier wins. If two sources at the same tier disagree, both are recorded and the status held at the more conservative reading.

## Archiving and link rot

Every evidence URL is mirrored to the Internet Archive at the moment its status update is merged to `main`. The archive URL is recorded in the evidence entry alongside the original URL.

If a source publication takes a story offline, the archive copy stands. We do not edit history to reflect a takedown. Removed sources are noted in the timeline with a short editor's note.

## Corrections

We make mistakes. When we do, we correct them in full view.

- Factual errors, mis-attributions, mis-quotations, and mis-categorised promises are corrected in a new pull request that references the original. The history of the change stays in Git.
- The promise detail page links to its full Git history. Any reader can see what changed, when, and by whom.
- We do not silently rewrite past entries. We add corrections and mark the prior text as superseded.

If you find an error, open an issue or a pull request, or write to `corrections@keralapromises.in`.

## Conflict of interest

Editors who work for, or have worked in the last five years for, a political party, a government department, an evidence-publishing organisation, or a body whose work is named in a promise must declare the relationship publicly on their first edit to that promise.

Declarations are visible on the editor's profile page on the site and on every pull request they open.

The conflict does not bar contribution; it makes the audit trail honest. A second editor without the conflict reviews the pull request before merge.

## How submissions are triaged

Citizens submit tips through the form linked from every page of the site. Editors triage the submissions weekly:

1. **Admissibility.** Submissions without a source from the hierarchy are returned to the submitter with a request for a source.
2. **Verification.** Editors read the cited source and check the claim against the four evaluation criteria.
3. **Pull request.** A verified submission becomes a pull request, with the submitter credited unless they have asked to remain anonymous.
4. **Review.** A second editor reviews. On merge, the archive.org mirror Action runs.

Submitters do not need a GitHub account. Submitters can ask to remain anonymous in the public record; in that case the pull request lists the editor of record, not the submitter.

## Term boundaries

We track the UDF 2026 manifesto over the term of the 14th Kerala Legislative Assembly, from 9 May 2026 to 23 May 2031. Promises with deadlines before 23 May 2031 are evaluated against their stated deadline. Promises with deadlines that fall after the end of the term are evaluated at the end of the term against their state at that point.

If the term ends early — through dissolution, resignation, or coalition change — we record the term end as the date of the change and note the surrounding political circumstance, sourced from Tier 1 or Tier 2. The accountability record stands regardless.

## Versioning this document

This document is the standard against which the site is judged. We do not change it lightly. Material changes — adding or removing a status, changing what counts as evidence, altering the conflict-of-interest rules — require:

1. A public proposal as a GitHub issue, open for at least 14 days.
2. A pull request that updates this document.
3. An entry in the changelog at the bottom of this document.

Minor changes — typos, examples, clearer prose — can be merged by any editor without a 14-day notice.

## Changelog

- 2026-05-20 — Initial methodology committed to the repository.
