# Publishing flow

The blog is canonical. Buttondown is syndication (POSSE: Publish on your Own Site,
Syndicate Elsewhere). Committing to GitHub publishes the post; Buttondown is a
**second, explicit step** — it does not happen automatically.

## The flow

```
1. write            content/<Slug>.mdx          (or `pnpm blog:import` from Tana)
2. publish          git commit && push           → site builds, RSS/Atom update
3. syndicate        pnpm blog:buttondown <slug>  → creates a Buttondown DRAFT
4. send             review the draft in Buttondown, press send
```

Step 3 never sends on its own. It creates a draft so you get a real preview
(images, links, footnotes) before anything leaves the building.

## Commands

| Command | What it does |
|---|---|
| `pnpm blog:buttondown --list` | what's currently on Buttondown |
| `pnpm blog:buttondown <slug>` | push one post as a **draft** |
| `pnpm blog:buttondown <slug> --dry-run` | preview the payload, write nothing |
| `pnpm blog:buttondown <slug> --send` | create **and send** (5s abort window) |
| `pnpm blog:buttondown --backfill` | import every post to the archive, `status=imported` |
| `pnpm blog:buttondown --test-mode on\|off` | redirect all sends to yourself |
| `pnpm blog:newsletter <slug> \| pbcopy` | old paste-into-the-composer path, plaintext |

Flags: `--plaintext` (bare-text body, no images), `--force` (re-push an existing
slug), `--status <s>` (override; e.g. `imported`).

Re-running is safe: existing slugs are skipped unless you pass `--force`.

## Testing

`test_mode` redirects every send to the newsletter's own address
(`qweliantanner@gmail.com`) and prefixes the subject with `[TEST MODE]`.

```sh
pnpm blog:buttondown --test-mode          # check current value
pnpm blog:buttondown --test-mode on
pnpm blog:buttondown <slug> --send        # lands in your inbox only
pnpm blog:buttondown --test-mode off      # ⚠️ remember this
```

**test_mode is currently ON.** Real sends will not reach subscribers until you
turn it off. `--send` prints the current value before it fires.

## Why the body is built the way it is

`scripts/lib/render-email.mjs` flattens MDX into an email body. The non-obvious parts:

- **All URLs are made absolute.** An email client has no origin, so
  `/images/foo.png` renders as a broken image in every inbox. Root-relative
  `src`/`href` and markdown links get `https://qwelian.com` prefixed, and
  in-page footnote anchors (`#fn-1`) are rewritten to point at the live post.
- **Rich mode by default.** The body is prefixed with
  `<!-- buttondown-editor-mode: fancy -->` so images render. `--plaintext`
  switches to the bare Doctorow-style body, which drops images to alt text.
- **`<iframe>` becomes a linked poster frame.** Every email client strips
  iframes, so an embedded YouTube video would silently vanish. It's replaced
  with the `img.youtube.com` thumbnail linking to the video.
- **MDX/JSX components** have no email equivalent and become a
  "read it on the web" pointer.

## Buttondown gotchas found the hard way

- **`publish_date` in the past is rejected on create** (`publish_date_invalid`)
  but accepted on `PATCH`. Backdating is therefore create-then-patch.
- **`canonical_url` becomes a 302**, not a `rel=canonical` hint. Setting it makes
  every archive entry bounce to qwelian.com, which turns the archive into a list
  of links. We deliberately leave it empty and put the "read it on the web"
  pointer in the body footer instead.
- **`status: "imported"`** is archive-only and never sends — that's what the
  backfill uses. Creating with `about_to_send` sends immediately.
- Slugs are `^[a-zA-Z0-9_-]+$`, max 100 chars, so long filenames get truncated
  at a word boundary. The archive slug and the blog slug therefore differ.

## Images

**Deploy before you syndicate.** Email bodies point at `https://qwelian.com/images/…`,
so an image that hasn't shipped yet is a 404 in the archive and in every inbox.
Step 2 (push, site builds) has to land before step 3.

All post images are now self-hosted under `public/images/`. The Firebase Storage
URLs that came in through the Tana/fineshyt import were rehosted on 2026-07-30 —
they carried a `?token=` that would have broken permanently on rotation. They were
re-encoded to WebP at q82/1600px on the way in (4.7MB → 402KB).

If a future import reintroduces external image URLs, the same treatment applies:
download, `cwebp -q 82 -resize 1600 0`, drop in `public/images/`, repoint the MDX.
`--dry-run` warns when it sees a Firebase token URL.

WebP is the house format and we do not care about Outlook on Windows, which is the
only mainstream client that won't decode it.

## Credentials

`BUTTONDOWN_API_KEY` lives in `.env`, which is gitignored (`.gitignore:41`,
`.env*`). It is read only by `scripts/buttondown.mjs` at the command line —
never import it into anything under `app/`, and never prefix it with
`NEXT_PUBLIC_`, which would ship it to the browser.
