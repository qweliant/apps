#!/usr/bin/env node
/**
 * Post → plaintext newsletter, Doctorow-style (bare links, no tracking markup).
 *
 * Usage:
 *   pnpm blog:newsletter <slug>     # a specific post (filename without .mdx)
 *   pnpm blog:newsletter            # the newest post by date
 *   pnpm blog:newsletter --list     # list available slugs
 *
 * Prints a paste-ready email to stdout:  pnpm blog:newsletter <slug> | pbcopy
 * Then paste into Buttondown's composer (buttondown.com/qwelian) and send.
 */
import fs from "node:fs";
import path from "node:path";

const SITE = "https://qwelian.com";
const CONTENT = path.join(process.cwd(), "content");

const splitFrontmatter = (raw) => {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fm: "", body: raw };
  return { fm: m[1], body: raw.slice(m[0].length) };
};

const fmValue = (fm, key) => {
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

const toPlaintext = (body) => {
  let t = body;

  // drop the leading "# Title" (the subject carries it)
  t = t.replace(/^\s*#\s+.*\n+/, "");

  // remove web-only footnote reference superscripts:  <sup><a href="#fn-1">1</a></sup>
  t = t.replace(/<sup>\s*<a[^>]*>[\s\S]*?<\/a>\s*<\/sup>/gi, "");

  // list items → dashes (do before generic tag strip)
  t = t.replace(/<li[^>]*>/gi, "\n- ").replace(/<\/li>/gi, "");

  // real HTML links → bare:  <a href="URL">TEXT</a>
  t = t.replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, url, text) => {
    text = text.trim();
    return !text || text === url ? url : `${text} (${url})`;
  });

  // MDX/JSX components (capitalized tags) → a pointer to the web version
  t = t.replace(/<[A-Z][A-Za-z0-9]*(?:\s[^>]*)?\/>/g, "\n[interactive element — read it on the web]\n");
  t = t.replace(/<[A-Z][A-Za-z0-9]*(?:\s[^>]*)?>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g, "\n[interactive element — read it on the web]\n");

  // images → drop (keep alt text if any as a note)
  t = t.replace(/!\[([^\]]*)\]\([^)]+\)/g, (_, alt) => (alt ? `[image: ${alt}]` : ""));

  // markdown links → bare:  [text](url)
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
    text.trim() === url.trim() ? url : `${text} (${url})`
  );

  // fenced code: drop the ``` lines, keep the code
  t = t.replace(/^```.*$/gm, "");

  // headings → plain lines
  t = t.replace(/^#{1,6}\s+/gm, "");

  // emphasis / inline code markers
  t = t
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");

  // blockquote markers → plain
  t = t.replace(/^>\s?/gm, "");

  // unescape MDX-escaped punctuation from the import pipeline
  t = t.replace(/\\([{}[\]])/g, "$1");

  // strip any remaining HTML tags
  t = t.replace(/<\/?[a-zA-Z][^>]*>/g, "");

  t = decodeEntities(t);

  // tidy whitespace
  t = t
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return t;
};

const listSlugs = () =>
  fs
    .readdirSync(CONTENT)
    .filter((n) => n.endsWith(".mdx"))
    .map((n) => n.replace(/\.mdx$/, ""));

const newestSlug = () => {
  let best = null;
  for (const slug of listSlugs()) {
    const { fm } = splitFrontmatter(fs.readFileSync(path.join(CONTENT, `${slug}.mdx`), "utf8"));
    const d = new Date(fmValue(fm, "date")).getTime();
    if (!best || (isFinite(d) && d > best.d)) best = { slug, d: isFinite(d) ? d : 0 };
  }
  return best?.slug;
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.includes("--list")) {
    console.error("Available slugs:\n" + listSlugs().map((s) => `  ${s}`).join("\n"));
    return;
  }

  const slug = args.find((a) => !a.startsWith("--")) || newestSlug();
  if (!slug) {
    console.error("No posts found in content/.");
    process.exit(1);
  }
  const file = path.join(CONTENT, `${slug}.mdx`);
  if (!fs.existsSync(file)) {
    console.error(`No such post: ${slug}\nTry: pnpm blog:newsletter --list`);
    process.exit(1);
  }

  const raw = fs.readFileSync(file, "utf8");
  const { fm, body } = splitFrontmatter(raw);
  const title = fmValue(fm, "title") || slug.replace(/_/g, " ");
  const permalink = `${SITE}/posts/${slug}`;
  const plain = toPlaintext(body);

  const out = [
    `Subject: ${title}`,
    ``,
    `— — —`,
    ``,
    plain,
    ``,
    `— — —`,
    ``,
    `Read it on the web (with links + footnotes intact):`,
    permalink,
    ``,
    `You're getting this because you subscribed at ${SITE} / buttondown.com/qwelian.`,
    `Buttondown adds the unsubscribe link automatically.`,
    ``,
    `CC BY 4.0 — Qwelian Tanner. Share and adapt with credit.`,
    ``,
  ].join("\n");

  process.stdout.write(out);
  // status goes to stderr so `| pbcopy` stays clean
  console.error(`\n[newsletter] ${slug} → ${plain.length} chars. Pipe to pbcopy to copy, then paste into Buttondown.`);
};

main();
