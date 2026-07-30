# fineshyt → blog photo bridge

**Status:** draft v1 · **Owner of this file:** blog repo · **Consumers:** fineshyt (`/Users/qwelian/Programs/fineshyt`), blog (`/Users/qwelian/Programs/apps/blog`)

This is a contract, not an implementation. Two codebases build against it
independently. Neither imports the other; neither needs to know the other's
internals. The only shared surface is a directory of files and one JSON
manifest.

---

## 1. Why a manifest and not a folder of images

The blog could just glob a directory — it already has `listPublicAssets()` in
`lib/assets.ts` for exactly that. Three reasons that isn't enough here:

1. **Alt text.** `/fotos` currently derives alt text from filenames
   (`IMG_2168.jpeg` → "IMG 2168"), which is useless to a screen reader.
   fineshyt's vision worker already writes a real `subject` string per photo.
   The manifest is how that crosses the boundary.
2. **Curation intent.** `user_rating`, `manual_match`, and `preference_score`
   are the whole point of fineshyt. Without them the blog can only sort
   alphabetically — the curation is discarded at the border.
3. **Build-tracing.** Directory scanning with a dynamic path defeats Next's
   file tracer: it can't resolve the path statically, so it conservatively
   traces the *entire* directory into the serverless bundle. That is what
   broke the Netlify deploy on 2026-07-28 (1.1 GB function bundle, HTTP 400
   `request body too large`). A manifest is a single read at a fixed path and
   traces cleanly.

---

## 2. Flow

```
fineshyt                    staging dir                     blog
────────                    ───────────                     ────
mix fineshyt.export   ──▶   ~/Exports/fineshyt/<collection>/   ──▶   pnpm blog:photos <dir>
                              ├── manifest.json
                              ├── flora/dsc-2072.webp
                              ├── flora/dsc-2072.thumb.webp
                              └── …
```

**Note the doubled segment.** `photos[].file` is always `<collection>/<slug>.webp`
relative to the staging root, and the default staging root already ends in the
collection name — so the full path is
`~/Exports/fineshyt/flora/flora/dsc-2072.webp`. This is intentional: it keeps
`file` self-describing so a manifest can be relocated or merged without
rewriting paths. Both implementations rely on it. Do not "fix" one side alone.

fineshyt **writes** to a neutral staging directory. The blog **pulls** from a
path passed on the command line. fineshyt never learns the blog's filesystem
location, and the blog never shells out to fineshyt.

This mirrors the existing `blog:import` precedent, which takes a path to a Tana
markdown dump rather than having Tana know about the blog.

**Default staging root:** `~/Exports/fineshyt/`. Overridable on both sides.

---

## 3. Manifest schema v1

Path: `<staging>/manifest.json`

```json
{
  "schema": "fineshyt.export/v1",
  "collection": "flora",
  "exported_at": "2026-07-28T19:04:00Z",
  "source": {
    "app": "fineshyt",
    "preference_model_version": 7
  },
  "derivative": {
    "format": "webp",
    "max_edge": 2400,
    "quality": 80,
    "thumb_max_edge": 600
  },
  "photos": [
    {
      "id": "sha256:9f2a1c…",
      "file": "flora/dsc-2072.webp",
      "thumb": "flora/dsc-2072.thumb.webp",
      "width": 2400,
      "height": 1600,
      "bytes": 284119,
      "alt": "backlit hibiscus stamen, shallow focus against dark ground",
      "taken_at": "2024-06-01",
      "rating": 5,
      "preference_score": 88,
      "chefs_pick": true,
      "tags": ["macro", "botanical"],
      "mood": "quiet, high-contrast",
      "content_type": "macro"
    }
  ]
}
```

### Field reference

| Field | Type | Required | Notes |
|---|---|---|---|
| `schema` | string | ✅ | Exactly `"fineshyt.export/v1"`. Importer rejects anything else. |
| `collection` | string | ✅ | Slug. Becomes the blog subdirectory and the `/fotos` filter tab. |
| `exported_at` | ISO 8601 | ✅ | UTC. |
| `source.app` | string | ✅ | `"fineshyt"`. Room for other producers later. |
| `source.preference_model_version` | int | — | Which Ridge model version scored this batch. |
| `derivative.*` | object | ✅ | What the exporter actually produced. The importer does **not** re-encode; it trusts these. |
| `photos[].id` | string | ✅ | `sha256:` + hex digest **of the original source file**, not the derivative. Stable across re-exports and re-encodes. This is the diff key. |
| `photos[].file` | string | ✅ | Path relative to the staging root. Always `<collection>/<slug>.webp`. |
| `photos[].thumb` | string | — | Same convention, `.thumb.webp`. |
| `photos[].width` / `height` | int | ✅ | Of the derivative, not the original. Lets the blog set correct `next/image` dimensions with no probing. |
| `photos[].bytes` | int | — | Derivative size. Sanity-check on import. |
| `photos[].alt` | string | ✅ | Human-readable. **Never a filename.** See §5. |
| `photos[].taken_at` | ISO date | — | EXIF capture date if available. Used for chronological sort. |
| `photos[].rating` | int 1–5 | — | `user_rating`. |
| `photos[].preference_score` | int 0–100 | — | Ridge probe output. |
| `photos[].chefs_pick` | bool | — | `manual_match`. Blog may feature these. |
| `photos[].tags` | string[] | — | `suggested_tags`. Defaults `[]`. |
| `photos[].mood` | string | — | `artistic_mood`. |
| `photos[].content_type` | string | — | `content_type`. |

### Mapping from `Orchestrator.Photos.Photo`

| fineshyt schema field | manifest field |
|---|---|
| `project` | `collection` (batch-level) |
| `subject` | `alt` |
| `artistic_mood` | `mood` |
| `content_type` | `content_type` |
| `suggested_tags` | `tags` |
| `user_rating` | `rating` |
| `manual_match` | `chefs_pick` |
| `preference_score` | `preference_score` |
| `preference_model_version` | `source.preference_model_version` |
| `file_path` | hashed → `id`; never exported verbatim |
| `url`, `technical_score`, `sharpness_score`, `exposure_score`, `clip_embedding` | **not exported** — internal to curation |

**Export filter:** only rows with `curation_status = "complete"`. Never export
`pending`, `failed`, or `rejected` (rejected is a soft-delete).

---

## 4. Derivative rules

The exporter produces web-ready files. **Originals never cross the boundary.**

- **Format:** WebP.
- **Primary:** longest edge ≤ 2400px, quality 80. Never upscale — a source
  smaller than 2400px is re-encoded at native size.
- **Thumb:** longest edge ≤ 600px, quality 75.
- **Strip metadata** except orientation. No GPS, no serial numbers — these go
  on a public site.
- **Naming:** lowercase, non-alphanumerics → `-`, collapse repeats.
  `_DSC3453.jpeg` → `dsc3453.webp`; `DSC_2072.jpeg` → `dsc-2072.webp`.
  Collisions get a `-2` suffix. This rule is normative — where an example
  elsewhere in this doc disagrees, the rule wins.

> **Reality check (found during implementation, 2026-07-29):** the 2400px
> ceiling is currently **unreachable**. `ai_worker/domain/convert.py` does
> `resize_to_long_edge(img, 1440)` upstream, so by the time the exporter runs,
> `file_path` is already a 1440px proxy — and "never upscale" correctly clamps
> every derivative to ≤1440. To actually reach 2400 you must either raise the
> converter's cap or export from `source_path`. Until then `max_edge: 2400` is
> the ceiling, not the output. **Open decision, not a bug.**

Rationale: the blog's `public/images/` reached 956 MB of full-resolution camera
originals (largest single file 51 MB, 6774×4492) because originals were copied
in by hand. fineshyt already owns a RAW/TIFF→JPEG conversion path and computes
sharpness on the full-res source *before* downsizing, so it is the correct
place to emit derivatives. Any design where the blog receives originals
reintroduces this.

---

## 5. Alt text is required

`alt` must be a real description. If `subject` is null/empty for a photo, the
exporter **fails that photo** and reports it rather than emitting a filename or
an empty string. A missing alt is an accessibility regression that's invisible
until someone hits it with a screen reader.

There is deliberately **no fallback chain**. An earlier draft allowed
`subject` + `content_type` as a middle rung; that collapses to bare
`content_type` when `subject` is blank, and the real values there are
`"abstract"`, `"still_life"`, `"other"` — category labels, not descriptions.
That would reintroduce exactly what this section exists to prevent. It is
`subject`, or fail the photo.

**Passing §5 is not the same as being good.** The importer additionally warns
(non-fatal) when alt text is two words or fewer. Against the first real export,
51 of 92 photos tripped this — `"Flower"` alone appeared 16 times. That is a
data-quality problem in fineshyt's `subject` column, not something the bridge
can fix, but it must not pass silently.

---

## 6. Responsibilities

### fineshyt side
- [ ] `mix fineshyt.export --collection <name> [--out <dir>] [--min-rating N]`
- [ ] Select rows: `curation_status = "complete"`, matching `project`, optional rating floor
- [ ] Generate derivatives per §4
- [ ] Compute `sha256` of each original
- [ ] Write `manifest.json` per §3
- [ ] Exit non-zero if any photo fails §5

### blog side
- [ ] `pnpm blog:photos <staging-dir>` (`scripts/photo-import.mjs`)
- [ ] Validate `schema` string; refuse unknown versions
- [ ] Copy derivatives → `public/images/<collection>/`
- [ ] Write `content/photos/<collection>.json` (the manifest, minus staging paths)
- [ ] Diff by `id`: report added / removed / changed, never silently drop
- [ ] `/fotos` reads the committed manifest instead of hardcoded arrays

### Shared
- [ ] Agree §3 before either side writes code. **This file is the agreement.**

---

## 6a. Resolving `collection` against `project`

`collection` is specced as a slug; fineshyt's `project` is free text
(`"Flowers"`, `"KFG ppl"`). The exporter matches by slugifying `project` — so
`--collection flowers` resolves to project `"Flowers"` — and errors on ambiguity
rather than silently picking one.

---

## 7. Idempotency

Re-running an export must be safe. `id` is the sha256 of the *original*, so a
re-encode at different quality yields the same `id` and the importer treats it
as an update, not a new photo. Removing a photo from a collection in fineshyt
and re-exporting means its `id` vanishes from the manifest — the importer
reports the orphan but **does not delete** the file without `--prune`.

> **Hazard.** `id` currently hashes `file_path`, per §3's mapping table.
> fineshyt also has a `source_path` column, empty on every row today. If it is
> ever backfilled and someone "corrects" the hash to use it, **every `id`
> changes** and the importer sees a full set of deletions plus a full set of
> additions rather than an update. If that migration happens, it needs a
> deliberate id-rewrite on both sides, not a one-line change.

### Field conventions

- Optional fields are emitted as explicit `null`, not omitted.
- `derivative` publishes `quality` (primary) but not thumb quality; 75 is
  applied per §4 and not currently round-tripped.
- `taken_at` is a **date**, truncated from fineshyt's `captured_at` datetime.

---

## Appendix A — event log (deferred, not v1)

Not part of the bridge. Recorded here so the option stays open.

A third service pooling fineshyt + luminosity + blog into an "ideation trace"
is tracked in Tana as *The Ideation Trace Dashboard* (`#system_design`), status
🟡 In Backlog, horizon 𝝮 Maybe/Someday. Deliberately not being built now.

The one cheap thing that keeps it possible: have each app append a line to a
shared JSONL log on publish.

```jsonl
{"ts":"2026-07-28T19:04Z","source":"fineshyt","kind":"photo.published","ref":"flora/dsc2072","tags":["macro"]}
{"ts":"2026-07-28T19:12Z","source":"blog","kind":"post.published","ref":"canvas-all-the-way-down"}
```

Nothing reads it. The dashboard's hard problem is not the LiveView — it's that
the history doesn't exist yet, and each week without it is a week that can't be
reconstructed. ~10 lines per app now; the reader can wait years.

Note: `luminosity_relay` is a WebRTC websocket pub/sub broker, not an event
store. It is not a head start on this.

---

## Appendix B — non-goals for v1

- No network. Staging is a local directory; no HTTP between the apps.
- No originals in the blog repo, ever.
- No blog→fineshyt direction. One-way.
- No automatic publishing. Import stages a diff; a human commits it.
