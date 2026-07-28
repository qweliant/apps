#!/usr/bin/env node
/**
 * Retrofit footnotes onto existing blog posts — same treatment the Tana
 * pipeline gives new posts: inline markdown links keep their link, gain a
 * <sup> reference, and a "## Notes" section of bare URLs is appended.
 *
 * Usage:
 *   pnpm blog:footnote <slug>            # one post
 *   pnpm blog:footnote --all             # every post that has links + no footnotes
 *   pnpm blog:footnote <slug> --refresh-meta
 *
 * Idempotent: skips posts that already have a footnote section.
 * Links inside ``` fenced code blocks and image links (![](...)) are left alone.
 */
import fs from "node:fs";
import path from "node:path";
import { fetchMeta } from "./lib/url-meta.mjs";

const CONTENT = path.join(process.cwd(), "content");

const escapeLabel = (t) =>
  t.replace(/[<>{}]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "{": "&#123;", "}": "&#125;" }[c]));

// URLs from old posts can contain stray " / < / & — escape for use in an href attribute
const escapeUrl = (u) =>
  u
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const makeFootnotes = (refreshMeta = false) => {
  const byUrl = new Map();
  const order = [];
  return {
    register(url) {
      if (byUrl.has(url)) return byUrl.get(url);
      const entry = { n: order.length + 1, url, meta: null };
      byUrl.set(url, entry);
      order.push(url);
      return entry;
    },
    async fetchAll() {
      await Promise.all(
        order.map(async (url) => {
          byUrl.get(url).meta = await fetchMeta(url, refreshMeta);
        })
      );
    },
    peek: (url) => byUrl.get(url),
    entries: () => order.map((u) => byUrl.get(u)),
  };
};

const renderNotes = (footnotes) => {
  const items = footnotes.entries();
  if (!items.length) return "";
  const lis = items
    .map(({ n, url, meta }) => {
      const label = meta?.title
        ? `${meta.title}${meta.siteName ? ` — ${meta.siteName}` : ""}`
        : url;
      return `  <li id="fn-${n}">${escapeLabel(label)}. <a href="${escapeUrl(url)}">${escapeLabel(url)}</a></li>`;
    })
    .join("\n");
  return `## Notes\n\n<ol>\n${lis}\n</ol>`;
};

const mdLinkRe = /(!?)\[([^\]]+?)\]\((https?:\/\/[^)\s]+)\)/g;

const addFootnotes = async (body, footnotes) => {
  // split out fenced code blocks so links inside them are never touched
  const parts = body.split(/(```[\s\S]*?```)/g);
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) continue; // code block
    for (const m of parts[i].matchAll(mdLinkRe)) {
      if (m[1] === "!") continue; // image
      footnotes.register(m[3]);
    }
  }
  await footnotes.fetchAll();
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) continue;
    parts[i] = parts[i].replace(mdLinkRe, (match, bang, text, url) => {
      if (bang === "!") return match;
      const e = footnotes.peek(url);
      return e ? `[${text}](${url})<sup><a href="#fn-${e.n}">${e.n}</a></sup>` : match;
    });
  }
  return parts.join("");
};

const splitFrontmatter = (raw) => {
  const m = raw.match(/^(---\n[\s\S]*?\n---\n?)/);
  return m ? { fm: m[1], body: raw.slice(m[1].length) } : { fm: "", body: raw };
};

const processFile = async (slug, refreshMeta) => {
  const file = path.join(CONTENT, `${slug}.mdx`);
  if (!fs.existsSync(file)) {
    console.warn(`skip ${slug} (no such file)`);
    return;
  }
  const raw = fs.readFileSync(file, "utf8");
  if (/id="fn-\d/.test(raw) || /\n##\s+Notes\b/.test(raw)) {
    console.log(`— ${slug} (already has footnotes)`);
    return;
  }
  const { fm, body } = splitFrontmatter(raw);
  const footnotes = makeFootnotes(refreshMeta);
  const newBody = await addFootnotes(body, footnotes);
  if (!footnotes.entries().length) {
    console.log(`— ${slug} (no links)`);
    return;
  }
  const out = fm + newBody.replace(/\s+$/, "") + "\n\n" + renderNotes(footnotes) + "\n";
  fs.writeFileSync(file, out, "utf8");
  console.log(`✓ ${slug} — ${footnotes.entries().length} footnotes`);
};

const main = async () => {
  const args = process.argv.slice(2);
  const refreshMeta = args.includes("--refresh-meta");
  const all = args.includes("--all");
  const slugArg = args.find((a) => !a.startsWith("--"));

  let slugs;
  if (all) {
    slugs = fs
      .readdirSync(CONTENT)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } else if (slugArg) {
    slugs = [slugArg.replace(/\.mdx$/, "")];
  } else {
    console.error("Usage: pnpm blog:footnote <slug> | --all [--refresh-meta]");
    process.exit(1);
  }

  for (const s of slugs) await processFile(s, refreshMeta);
};

main();
