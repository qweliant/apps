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
 * Frontmatter: pulled from fields (Thesis/Details/Category/Scheduled for).
 */
import fs from "node:fs";
import path from "node:path";

const parseLines = (md) =>
  md.split("\n").flatMap((raw) => {
    const m = raw.match(/^(\s*)-\s(.*)$/);
    if (!m) return [];
    return [{ depth: m[1].length / 2, text: m[2] }];
  });

const stripNodeId = (t) => t.replace(/\s*<!--\s*node-id:[^>]*-->\s*$/, "").trim();
const stripTodo = (t) => t.replace(/^\[[ xX]\]\s+/, "");
const stripTags = (t) => t.replace(/\s*#\S+/g, "");
const stripHtml = (t) => t.replace(/<\/?(b|strong|i|em)>/gi, "");

const cleanContent = (t) =>
  stripHtml(
    t
      .replace(/\[([^\]]+?)\s*#\S+\]\(tana:[^)]+\)/g, "$1")
      .replace(/\[([^\]]+)\]\(tana:[^)]+\)/g, "$1")
  ).trim();

const slugify = (title) =>
  title
    .replace(/[\/\\:*?"<>|]/g, "")
    .trim()
    .replace(/\s+/g, "_");

const toTree = (lines) => {
  if (!lines.length) return null;
  const root = { text: lines[0].text, children: [] };
  const stack = [{ node: root, depth: lines[0].depth }];
  for (let i = 1; i < lines.length; i++) {
    const { depth, text } = lines[i];
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    const parent = stack.length ? stack[stack.length - 1].node : root;
    const node = { text, children: [] };
    parent.children.push(node);
    stack.push({ node, depth });
  }
  return root;
};

const normalizeFieldName = (n) =>
  stripHtml(n).replace(/^[^a-zA-Z]+/, "").trim().toLowerCase();

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
  return cleanContent(t);
};

const TRUNC_RE = /^\*\[\.\.\.\s*\d+\s+children truncated due to depth limit\]\*$/;
const URL_RE = /^https?:\/\/\S+$/;
const urlToLink = (t) => (URL_RE.test(t) ? `[${t}](${t})` : t);
const demoteH1 = (t) => t.replace(/^#\s+/, "## ");

const renderChildrenAsProse = (children) => {
  const blocks = [];
  let i = 0;
  while (i < children.length) {
    const start = i;
    while (
      i < children.length &&
      children[i].children.length === 0 &&
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
  if (!raw) return "";

  if (URL_RE.test(raw)) return urlToLink(raw);

  const text = demoteH1(raw);
  if (!node.children.length) return text;

  const looksLikeHeading =
    depth === 0 &&
    text.length <= 80 &&
    !/[.,]$/.test(text) &&
    !text.startsWith("#");
  const body = renderChildrenAsProse(node.children);
  return looksLikeHeading ? `## ${text}\n\n${body}` : `${text}\n\n${body}`;
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
    if (f && FRONTMATTER_FIELDS.has(f.name)) {
      fields.set(f.name, f);
    } else if (f) {
      // Recognized as a field but not in frontmatter set — still skip from prose.
      continue;
    } else {
      prose.push(child);
    }
  }

  const thesis = fields.get("thesis");
  const details = fields.get("details");
  const description = thesis
    ? fieldContent(thesis)
    : details
      ? fieldContent(details)
      : "";

  const category = fields.get("category");
  const tags = category ? [fieldContent(category)].filter(Boolean) : [];

  const scheduled = fields.get("scheduled for");
  const date = scheduled ? fieldContent(scheduled) : new Date().toISOString();

  const body = prose
    .map((n) => renderNode(n, 0))
    .filter(Boolean)
    .join("\n\n");

  const lines = [
    "---",
    `title: ${escYaml(title)}`,
    `date: ${escYaml(date)}`,
  ];
  if (description) lines.push(`description: ${escYaml(description)}`);
  if (tags.length) lines.push(`tags: [${tags.map(escYaml).join(", ")}]`);
  lines.push("---", "", `# ${title}`, "", body, "");

  const slug = slugify(title);
  const outPath = path.join(process.cwd(), "content", `${slug}.mdx`);
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");

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
