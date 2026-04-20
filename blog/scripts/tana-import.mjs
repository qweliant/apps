#!/usr/bin/env node
/**
 * Tana `#content outline` → blog MDX transformer.
 *
 * Usage:
 *   pnpm blog:import <path-to-tana-markdown-dump>
 *
 * The caller produces the dump via MCP:
 *   mcp__tana-local__read_node(nodeId, maxDepth=10) → scripts/.tana-cache/<id>.md
 *
 * Prose source: direct non-field children of the outline node.
 * Frontmatter matches the legacy 2b schema already used by content/*.mdx.
 */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const POST_TYPE_ID = "5c421d8f-fbf0-44a3-9a05-dfe9eb164c76";
const PROP_ID_A = "63535e81-2300-473f-bc15-f55b50eb7e60";
const PROP_ID_B = "8649a72f-a448-44f5-bc9e-395ac8057364";

const parseLines = (md) => {
  const lines = md.split("\n");
  const entries = [];
  let i = 0;
  while (i < lines.length) {
    const fence = lines[i].match(/^\s*```(\S*)\s*$/);
    if (fence && entries.length) {
      const lang = fence[1] || "";
      const body = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        body.push(lines[i]);
        i++;
      }
      i++;
      const last = entries[entries.length - 1];
      (last.codeBlocks ||= []).push({ lang, content: body.join("\n") });
      continue;
    }
    const m = lines[i].match(/^(\s*)-\s(.*)$/);
    if (m) entries.push({ depth: m[1].length / 2, text: m[2], codeBlocks: [] });
    i++;
  }
  return entries;
};

const stripNodeId = (t) => t.replace(/\s*<!--\s*node-id:[^>]*-->\s*$/, "").trim();
const stripTodo = (t) => t.replace(/^\[[ xX]\]\s+/, "");
const stripTags = (t) => t.replace(/\s*#\S+/g, "");

const convertHtml = (t) =>
  t
    .replace(/<a\s+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<code>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<\/?(b|strong|i|em)>/gi, "");

const collapseBoldArtifacts = (t) => t.replace(/\*{4,}/g, "");

const escapeBracesOutsideCode = (t) =>
  t
    .split(/(`[^`]*`)/)
    .map((part, idx) => (idx % 2 === 1 ? part : part.replace(/([{}])/g, "\\$1")))
    .join("");

const cleanContent = (t) =>
  escapeBracesOutsideCode(
    collapseBoldArtifacts(
      convertHtml(
        t
          .replace(/\[([^\]]+?)\s*#\S+\]\(tana:[^)]+\)/g, "$1")
          .replace(/\[([^\]]+)\]\(tana:[^)]+\)/g, "$1")
      )
    )
  ).trim();

const slugify = (title) =>
  title
    .replace(/[\/\\:*?"<>|.'`]/g, "")
    .trim()
    .replace(/\s+/g, "_");

const toTree = (lines) => {
  if (!lines.length) return null;
  const root = { text: lines[0].text, children: [], codeBlocks: lines[0].codeBlocks };
  const stack = [{ node: root, depth: lines[0].depth }];
  for (let i = 1; i < lines.length; i++) {
    const { depth, text, codeBlocks } = lines[i];
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    const parent = stack.length ? stack[stack.length - 1].node : root;
    const node = { text, children: [], codeBlocks };
    parent.children.push(node);
    stack.push({ node, depth });
  }
  return root;
};

const normalizeFieldName = (n) =>
  n
    .replace(/<\/?(b|strong|i|em)>/gi, "")
    .replace(/^[^a-zA-Z]+/, "")
    .trim()
    .toLowerCase();

const parseField = (node) => {
  const m = node.text.match(/^\*\*([^*]+?)\*\*:\s*(.*)$/);
  if (!m) return null;
  return {
    name: normalizeFieldName(m[1]),
    inline: stripNodeId(m[2]),
    children: node.children,
  };
};

const fieldContent = (f) => {
  if (f.inline) return cleanContent(f.inline);
  return f.children
    .map((c) => cleanContent(stripNodeId(c.text)))
    .filter(Boolean)
    .join(" ");
};

const normalizeTitle = (text) => {
  let t = stripTodo(stripNodeId(text));
  t = stripTags(t);
  t = t.replace(/\s*\|\s*[^|]+$/, "");
  t = t.replace(/\*\*/g, "");
  return cleanContent(t);
};

const TRUNC_RE = /^\*\[\.\.\.\s*\d+\s+children truncated due to depth limit\]\*$/;
const URL_RE = /^https?:\/\/\S+$/;
const urlToLink = (t) => (URL_RE.test(t) ? `[${t}](${t})` : t);
const demoteH1 = (t) => t.replace(/^#\s+/, "## ");

const decodeEntities = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const renderCodeBlocks = (cbs) =>
  (cbs || [])
    .map((cb) => "```" + cb.lang + "\n" + decodeEntities(cb.content) + "\n```")
    .join("\n\n");

const hasCode = (node) => node.codeBlocks && node.codeBlocks.length > 0;

const renderChildrenAsProse = (children) => {
  const blocks = [];
  let i = 0;
  while (i < children.length) {
    const start = i;
    while (
      i < children.length &&
      children[i].children.length === 0 &&
      !hasCode(children[i]) &&
      !TRUNC_RE.test(children[i].text) &&
      cleanContent(stripNodeId(children[i].text)).length < 60
    ) {
      i++;
    }
    const runLen = i - start;
    if (runLen >= 3) {
      blocks.push(
        children
          .slice(start, i)
          .map((c) => `- ${urlToLink(cleanContent(stripNodeId(c.text)))}`)
          .join("\n")
      );
    } else {
      for (let j = start; j < i; j++) {
        blocks.push(urlToLink(cleanContent(stripNodeId(children[j].text))));
      }
    }
    if (i < children.length) {
      blocks.push(renderNode(children[i], 1));
      i++;
    }
  }
  return blocks.filter(Boolean).join("\n\n");
};

const renderNode = (node, depth) => {
  if (TRUNC_RE.test(node.text)) return "";
  const raw = cleanContent(stripNodeId(node.text));
  const code = renderCodeBlocks(node.codeBlocks);

  if (!raw) {
    if (!node.children.length && !code) return "";
    const body = renderChildrenAsProse(node.children);
    return [code, body].filter(Boolean).join("\n\n");
  }

  if (URL_RE.test(raw)) {
    const link = urlToLink(raw);
    return [link, code].filter(Boolean).join("\n\n");
  }

  const text = demoteH1(raw);
  if (!node.children.length) return [text, code].filter(Boolean).join("\n\n");

  const looksLikeHeading =
    depth === 0 &&
    text.length <= 80 &&
    !/[.,]$/.test(text) &&
    !text.startsWith("#");
  const body = renderChildrenAsProse(node.children);
  return looksLikeHeading
    ? [`## ${text}`, code, body].filter(Boolean).join("\n\n")
    : [text, code, body].filter(Boolean).join("\n\n");
};

const escYaml = (s) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

const FRONTMATTER_FIELDS = new Set([
  "category",
  "status",
  "workflow status",
  "draft",
  "term",
  "thesis",
  "builds on",
  "horizon",
  "details",
  "sources",
  "container",
  "scheduled for",
  "due date",
]);

const parseDateToIso = (raw) => {
  if (!raw) return new Date().toISOString();
  if (!/\b(19|20)\d{2}\b/.test(raw)) return new Date().toISOString();
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d.toISOString();
  return new Date().toISOString();
};

const renderFrontmatter = ({ title, dateIso, objectId }) =>
  [
    "---",
    `title: ${escYaml(title)}`,
    `date: ${escYaml(dateIso)}`,
    `type: ${escYaml(POST_TYPE_ID)}`,
    `pinned: false`,
    `pageCustomization:`,
    `  backgroundColor: ""`,
    `  backgroundImage: ""`,
    `  defaultFont: "ui-sans-serif"`,
    `  freeDrag: false`,
    `properties:`,
    `  ${PROP_ID_A}:`,
    `    objectId: ${escYaml(objectId)}`,
    `    boolean: false`,
    `    date: ${escYaml(dateIso)}`,
    `  ${PROP_ID_B}:`,
    `    objectId: ${escYaml(objectId)}`,
    `    value: ""`,
    `    boolean: false`,
    "---",
  ].join("\n");

const main = () => {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: pnpm blog:import <path-to-tana-markdown-dump>");
    process.exit(1);
  }

  const md = fs.readFileSync(path.resolve(inputPath), "utf8");
  const tree = toTree(parseLines(md));
  if (!tree) {
    console.error("Empty input.");
    process.exit(1);
  }

  const title = normalizeTitle(tree.text);
  if (!title) {
    console.error("Could not parse title from root node.");
    process.exit(1);
  }

  const fields = new Map();
  const prose = [];
  for (const child of tree.children) {
    const f = parseField(child);
    if (f && FRONTMATTER_FIELDS.has(f.name)) fields.set(f.name, f);
    else if (f) continue;
    else prose.push(child);
  }

  const scheduled = fields.get("scheduled for");
  const dateIso = parseDateToIso(scheduled ? fieldContent(scheduled) : "");
  const objectId = randomUUID();

  const body = prose
    .map((n) => renderNode(n, 0))
    .filter(Boolean)
    .join("\n\n");

  const output =
    renderFrontmatter({ title, dateIso, objectId }) +
    "\n\n" +
    `# ${title}\n\n` +
    body +
    "\n";

  const slug = slugify(title);
  const outPath = path.join(process.cwd(), "content", `${slug}.mdx`);
  fs.writeFileSync(outPath, output, "utf8");

  console.log(`Wrote ${outPath}`);
  if (!prose.length) {
    console.warn(
      "No prose found as direct children of the outline. " +
        "This pipeline reads direct children only — it ignores the Draft field. " +
        "Move prose up to the outline's top level or adjust the script."
    );
  }
};

main();
