#!/usr/bin/env node
/**
 * Blog → Buttondown.
 *
 * The blog is canonical (POSSE): a post is published by committing it and
 * shipping the site. This script syndicates that post to Buttondown — either
 * backfilled into the archive, or as a draft for a real send.
 *
 * Usage:
 *   pnpm blog:buttondown --list                 what's already on Buttondown
 *   pnpm blog:buttondown --backfill --dry-run   preview the whole archive import
 *   pnpm blog:buttondown --backfill             import every post (status=imported, never sends)
 *   pnpm blog:buttondown <slug>                 push one post as a DRAFT
 *   pnpm blog:buttondown <slug> --send          create + send it for real
 *   pnpm blog:buttondown --test-mode on|off     redirect all sends to yourself
 *
 * Flags:  --plaintext  bare-text body instead of images-intact rich body
 *         --force      re-push even if the slug already exists on Buttondown
 *
 * Reads BUTTONDOWN_API_KEY from .env (gitignored).
 */
import fs from "node:fs";
import path from "node:path";
import {
  SITE,
  splitFrontmatter,
  fmValue,
  toEmailMarkdown,
  toPlaintext,
  toDescription,
  toSlug,
  riskyImages,
} from "./lib/render-email.mjs";

const API = "https://api.buttondown.com/v1";
const CONTENT = path.join(process.cwd(), "content");
const FANCY = "<!-- buttondown-editor-mode: fancy -->";

// ---------------------------------------------------------------- env + http

const loadEnv = () => {
  const f = path.join(process.cwd(), ".env");
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
};
loadEnv();

const KEY = process.env.BUTTONDOWN_API_KEY;
if (!KEY) {
  console.error("Missing BUTTONDOWN_API_KEY (expected in .env).");
  process.exit(1);
}

const api = async (endpoint, { method = "GET", body } = {}) => {
  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers: {
      Authorization: `Token ${KEY}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const err = new Error(`${method} ${endpoint} → ${res.status}\n${JSON.stringify(data, null, 2)}`);
    err.status = res.status;
    throw err;
  }
  return data;
};

/** Walk every page of a list endpoint. */
const apiList = async (endpoint) => {
  const all = [];
  let page = 1;
  for (;;) {
    const sep = endpoint.includes("?") ? "&" : "?";
    const d = await api(`${endpoint}${sep}page=${page}`);
    all.push(...(d.results || []));
    if (!d.next) break;
    page += 1;
  }
  return all;
};

// ------------------------------------------------------------------- content

const listSlugs = () =>
  fs
    .readdirSync(CONTENT)
    .filter((n) => n.endsWith(".mdx"))
    .map((n) => n.replace(/\.mdx$/, ""));

/** Build the Buttondown email payload for one post file. */
const buildEmail = (fileSlug, { plaintext = false, status }) => {
  const raw = fs.readFileSync(path.join(CONTENT, `${fileSlug}.mdx`), "utf8");
  const { fm, body } = splitFrontmatter(raw);
  const title = fmValue(fm, "title") || fileSlug.replace(/_/g, " ");
  const date = fmValue(fm, "date");
  const permalink = `${SITE}/posts/${fileSlug}`;

  const rich = toEmailMarkdown(body, { permalink });
  const plain = toPlaintext(body, { permalink });

  const footer = [
    "",
    "---",
    "",
    `*[Read it on the web](${permalink}) — links and footnotes intact.*`,
    "",
    "*CC BY 4.0 — Qwelian Tanner. Share and adapt with credit.*",
    "",
  ].join("\n");

  const plainFooter = [
    "",
    "— — —",
    "",
    "Read it on the web (with links + footnotes intact):",
    permalink,
    "",
    "CC BY 4.0 — Qwelian Tanner. Share and adapt with credit.",
    "",
  ].join("\n");

  const emailBody = plaintext
    ? `<!-- buttondown-editor-mode: plaintext -->\n${plain}${plainFooter}`
    : `${FANCY}\n${rich}${footer}`;

  return {
    payload: {
      subject: title,
      body: emailBody,
      slug: toSlug(fileSlug),
      description: toDescription(plain),
      // Deliberately NOT setting canonical_url: Buttondown turns it into a 302
      // off-site, which makes the archive a list of links rather than an archive.
      // The "read it on the web" footer carries the POSSE pointer instead.
      archival_mode: "enabled",
      status,
      metadata: { source: "blog", file_slug: fileSlug },
    },
    // Buttondown rejects a past publish_date on create ("publish_date_invalid"),
    // but accepts it on PATCH — so backdating is a second step.
    publishDate: date ? new Date(date).toISOString() : null,
    meta: { title, date, permalink, risky: riskyImages(rich), chars: emailBody.length },
  };
};

// -------------------------------------------------------------------- output

const c = { dim: "\x1b[2m", red: "\x1b[31m", yellow: "\x1b[33m", green: "\x1b[32m", bold: "\x1b[1m", off: "\x1b[0m" };
const log = (...a) => console.log(...a);

// -------------------------------------------------------------------- actions

const cmdList = async () => {
  const emails = await apiList("/emails");
  if (!emails.length) return log("No emails on Buttondown yet.");
  log(`${emails.length} email(s) on Buttondown:\n`);
  for (const e of emails.sort((a, b) => (a.publish_date || "").localeCompare(b.publish_date || ""))) {
    log(
      `  ${(e.publish_date || "").slice(0, 10)}  ${c.bold}${e.status.padEnd(9)}${c.off}  ${e.subject}\n` +
        `      ${c.dim}${e.absolute_url}${c.off}`
    );
  }
};

const cmdTestMode = async (want) => {
  const [nl] = (await api("/newsletters")).results;
  if (want === undefined) return log(`test_mode is currently: ${nl.test_mode}`);
  const updated = await api(`/newsletters/${nl.id}`, { method: "PATCH", body: { test_mode: want } });
  log(`test_mode → ${updated.test_mode}`);
  if (want) log(`${c.yellow}All sends now redirect to ${nl.email_address} with a [TEST MODE] subject prefix.${c.off}`);
};

const cmdPush = async (fileSlugs, { status, plaintext, dryRun, force }) => {
  const existing = dryRun ? [] : await apiList("/emails");
  const bySlug = new Map(existing.map((e) => [e.slug, e]));

  let created = 0;
  let skipped = 0;
  for (const fileSlug of fileSlugs) {
    const { payload, publishDate, meta } = buildEmail(fileSlug, { plaintext, status });

    if (!force && bySlug.has(payload.slug)) {
      log(`${c.dim}skip${c.off}   ${payload.slug} ${c.dim}(already on Buttondown)${c.off}`);
      skipped += 1;
      continue;
    }

    for (const r of meta.risky) log(`  ${c.yellow}! ${r.why}${c.off}\n    ${c.dim}${r.url.slice(0, 110)}${c.off}`);

    if (dryRun) {
      log(
        `${c.dim}would create${c.off} ${c.bold}${payload.slug}${c.off}\n` +
          `      subject: ${payload.subject}\n` +
          `      date:    ${publishDate || "(none)"}\n` +
          `      status:  ${payload.status}\n` +
          `      body:    ${meta.chars} chars\n` +
          `      desc:    ${payload.description.slice(0, 90)}`
      );
      created += 1;
      continue;
    }

    let res = await api("/emails", { method: "POST", body: payload });
    if (publishDate) {
      res = await api(`/emails/${res.id}`, { method: "PATCH", body: { publish_date: publishDate } });
    }
    log(
      `${c.green}created${c.off} ${res.slug}  ${c.dim}status=${res.status}  ` +
        `${(res.publish_date || "").slice(0, 10)}  ${res.absolute_url}${c.off}`
    );
    created += 1;
  }

  log(`\n${dryRun ? "[dry run] " : ""}${created} created, ${skipped} skipped.`);
};

// ----------------------------------------------------------------------- cli

const main = async () => {
  const args = process.argv.slice(2);
  const has = (f) => args.includes(f);
  const valueOf = (f) => {
    const i = args.indexOf(f);
    return i === -1 ? undefined : args[i + 1];
  };

  if (has("--list")) return cmdList();

  if (has("--test-mode")) {
    const v = valueOf("--test-mode");
    if (v === undefined) return cmdTestMode();
    return cmdTestMode(v === "on" || v === "true");
  }

  const dryRun = has("--dry-run");
  const plaintext = has("--plaintext");
  const force = has("--force");

  if (has("--backfill")) {
    const slugs = listSlugs().sort((a, b) => {
      const d = (s) => new Date(fmValue(splitFrontmatter(fs.readFileSync(path.join(CONTENT, `${s}.mdx`), "utf8")).fm, "date")).getTime() || 0;
      return d(a) - d(b);
    });
    log(`Backfilling ${slugs.length} post(s) as status=imported (archive only — this never sends).\n`);
    return cmdPush(slugs, { status: "imported", plaintext, dryRun, force });
  }

  const slug = args.find((a) => !a.startsWith("--") && a !== valueOf("--test-mode"));
  if (!slug) {
    console.error("Give a post slug, or --backfill / --list / --test-mode. Slugs:\n  " + listSlugs().join("\n  "));
    process.exit(1);
  }
  if (!fs.existsSync(path.join(CONTENT, `${slug}.mdx`))) {
    console.error(`No such post: ${slug}`);
    process.exit(1);
  }

  const send = has("--send");
  if (send) {
    const [nl] = (await api("/newsletters")).results;
    const subs = await apiList("/subscribers");
    log(
      `${c.red}${c.bold}This will SEND to ${subs.length} subscriber(s). test_mode=${nl.test_mode}.${c.off}\n` +
        `${c.dim}Ctrl-C now if that isn't what you want. Sending in 5s…${c.off}`
    );
    await new Promise((r) => setTimeout(r, 5000));
  }

  const status = valueOf("--status") || (send ? "about_to_send" : "draft");
  return cmdPush([slug], { status, plaintext, dryRun, force });
};

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
