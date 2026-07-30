/**
 * Post body → email body.
 *
 * Two renderers share one set of MDX-flattening rules:
 *   toEmailMarkdown()  rich mode — keeps images, sent as Buttondown "fancy"
 *   toPlaintext()      bare mode — Doctorow-style, no markup, images dropped
 *
 * The hard requirement for the rich mode is ABSOLUTE URLs. An email client has
 * no origin to resolve against, so `/images/foo.png` renders as a broken image
 * in every inbox. Everything root-relative gets rewritten to SITE-prefixed.
 */

export const SITE = "https://qwelian.com";

export const splitFrontmatter = (raw) => {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fm: "", body: raw };
  return { fm: m[1], body: raw.slice(m[0].length) };
};

export const fmValue = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, "m"));
  return m ? m[1].replace(/\\"/g, '"') : "";
};

const decodeEntities = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/** youtube.com/embed/<id>?si=... → the bare video id */
const youtubeId = (url) => {
  const m = url.match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
};

/**
 * Email clients strip <iframe> unconditionally, so an embedded video would just
 * vanish. Swap in the poster frame as a linked image — it looks like a player
 * and still lands the reader on the video.
 */
const iframesToThumbnails = (t) =>
  t.replace(/<iframe[^>]*src="([^"]+)"[^>]*>[\s\S]*?<\/iframe>|<iframe[^>]*src="([^"]+)"[^>]*\/?>/gi, (full, a, b) => {
    const src = a || b || "";
    const id = youtubeId(src);
    if (!id) return `\n[embedded media — watch it on the web]\n`;
    const watch = `https://www.youtube.com/watch?v=${id}`;
    return `\n[![Watch on YouTube](https://img.youtube.com/vi/${id}/hqdefault.jpg)](${watch})\n\n▶ ${watch}\n`;
  });

/** Rewrite every root-relative reference to an absolute one. */
const absolutize = (t, permalink) => {
  // markdown images + links:  ](/foo)  →  ](SITE/foo)   — leaves //cdn and http(s) alone
  t = t.replace(/\]\(\/(?!\/)/g, `](${SITE}/`);
  // in-page footnote anchors only resolve on the post page
  t = t.replace(/\]\(#([^)]+)\)/g, `](${permalink}#$1)`);
  // raw HTML attributes
  t = t.replace(/(\s(?:src|href)=")\/(?!\/)/gi, `$1${SITE}/`);
  t = t.replace(/(\shref=")#/gi, `$1${permalink}#`);
  return t;
};

/** MDX/JSX components (capitalized tags) have no email equivalent. */
const stripComponents = (t, permalink, label) => {
  const note = `\n${label}\n`;
  t = t.replace(/<([A-Z][A-Za-z0-9]*)(?:\s[^>]*)?\/>/g, note);
  t = t.replace(/<([A-Z][A-Za-z0-9]*)(?:\s[^>]*)?>[\s\S]*?<\/\1>/g, note);
  return t;
};

/**
 * Rich email body: markdown, images intact, everything absolute.
 * Returned WITHOUT the editor-mode header — the caller adds it.
 */
export const toEmailMarkdown = (body, { permalink }) => {
  let t = body;

  // the subject line carries the title
  t = t.replace(/^\s*#\s+.*\n+/, "");

  t = iframesToThumbnails(t);
  t = stripComponents(t, permalink, `_[interactive element — [read it on the web](${permalink})]_`);
  t = absolutize(t, permalink);

  // unescape MDX-escaped punctuation from the import pipeline
  t = t.replace(/\\([{}[\]])/g, "$1");

  t = t
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return t;
};

/** Bare plaintext body — no markup at all, images reduced to alt text. */
export const toPlaintext = (body, { permalink } = { permalink: SITE }) => {
  let t = body;

  t = t.replace(/^\s*#\s+.*\n+/, "");

  // drop web-only footnote superscripts:  <sup><a href="#fn-1">1</a></sup>
  t = t.replace(/<sup>\s*<a[^>]*>[\s\S]*?<\/a>\s*<\/sup>/gi, "");

  t = t.replace(/<iframe[^>]*src="([^"]+)"[^>]*>[\s\S]*?<\/iframe>|<iframe[^>]*src="([^"]+)"[^>]*\/?>/gi, (f, a, b) => {
    const id = youtubeId(a || b || "");
    return id ? `\nhttps://www.youtube.com/watch?v=${id}\n` : "\n[embedded media — see the web version]\n";
  });

  // list items → dashes (before the generic tag strip)
  t = t.replace(/<li[^>]*>/gi, "\n- ").replace(/<\/li>/gi, "");

  // real HTML links → bare
  t = t.replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, url, text) => {
    text = text.trim();
    return !text || text === url ? url : `${text} (${url})`;
  });

  t = stripComponents(t, permalink, "\n[interactive element — read it on the web]\n");

  // images → alt text only
  t = t.replace(/!\[([^\]]*)\]\([^)]+\)/g, (_, alt) => (alt ? `[image: ${alt}]` : ""));

  // markdown links → bare
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
    text.trim() === url.trim() ? url : `${text} (${url})`
  );

  t = t.replace(/^```.*$/gm, "");
  t = t.replace(/^#{1,6}\s+/gm, "");
  // unescape first, so the import pipeline's \_ and \* become real markers
  t = t.replace(/\\([{}[\]_*#`])/g, "$1");
  t = t
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    // _italic_ only at word boundaries, so snake_case identifiers survive
    .replace(/(^|[\s(["'])_([^_\n]+)_(?=$|[\s).,;:!?\]"'])/gm, "$1$2")
    .replace(/`([^`]+)`/g, "$1");
  t = t.replace(/^>\s?/gm, "");
  t = t.replace(/<\/?[a-zA-Z][^>]*>/g, "");
  t = decodeEntities(t);

  t = t
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return t;
};

/** Preheader / SEO blurb: first real sentence-ish chunk of prose. */
export const toDescription = (plain, max = 200) => {
  const first = plain.replace(/\s+/g, " ").trim();
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" "));
  return (stop > 80 ? cut.slice(0, stop) : cut).replace(/[,;:.\s]+$/, "") + "…";
};

/** Buttondown slug rules: ^[a-zA-Z0-9_-]+$, max 100 chars. */
export const toSlug = (filenameSlug) => {
  let s = filenameSlug
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/_/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  if (s.length > 100) {
    s = s.slice(0, 100);
    const lastDash = s.lastIndexOf("-");
    if (lastDash > 60) s = s.slice(0, lastDash);
  }
  return s.replace(/-+$/, "");
};

/** Images that some inboxes can't decode (notably Outlook/Windows + WebP). */
export const riskyImages = (mdBody) => {
  const out = [];
  const re = /!\[[^\]]*\]\(([^)\s]+)/g;
  let m;
  while ((m = re.exec(mdBody))) {
    const url = m[1];
    if (/\.webp(\?|$)/i.test(url)) out.push({ url, why: "WebP — not rendered by Outlook on Windows" });
    if (/firebasestorage\.googleapis\.com/.test(url)) out.push({ url, why: "Firebase token URL — breaks if the token is rotated" });
  }
  return out;
};
