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
import { SITE, splitFrontmatter, fmValue, toPlaintext } from "./lib/render-email.mjs";

const CONTENT = path.join(process.cwd(), "content");

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
  const plain = toPlaintext(body, { permalink });

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
