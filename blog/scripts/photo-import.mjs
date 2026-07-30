#!/usr/bin/env node
/**
 * fineshyt export → blog photo collection importer.
 *
 * Usage:
 *   pnpm blog:photos <staging-dir> [--prune] [--dry-run]
 *
 * Reads <staging-dir>/manifest.json, validates it against the v1 contract in
 * docs/fineshyt-bridge.md, copies derivatives into public/images/<collection>/,
 * and writes the committed manifest to content/photos/<collection>.json.
 *
 * The committed form differs from the staged form in one way: `file`/`thumb`
 * (paths relative to the staging root) become `src`/`thumb` site-root URLs.
 * Everything else is carried through verbatim.
 *
 * Originals never cross this boundary — the exporter is responsible for
 * derivatives (bridge spec §4). This script does not re-encode anything.
 */
import fs from "node:fs";
import path from "node:path";

const SCHEMA = "fineshyt.export/v1";

const die = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

/** Alt text is a hard requirement (bridge spec §5) — a filename is not alt text. */
const badAlt = (alt, file) => {
  if (typeof alt !== "string" || !alt.trim()) return "missing or empty";
  const stem = path.basename(file).replace(/\.[a-z0-9]+$/i, "");
  if (alt.trim().toLowerCase() === stem.toLowerCase()) return "is just the filename";
  if (/^[a-z0-9_\-. ]+\.(webp|jpe?g|png|tiff?)$/i.test(alt.trim())) return "looks like a filename";
  return null;
};

/**
 * Not a spec violation, so not fatal — but `alt="Flower"` on sixteen different
 * photos is barely better than the filenames this bridge exists to replace.
 * Surfaced on every import so thin data upstream stays visible.
 */
const thinAlt = (alt) => typeof alt === "string" && alt.trim().split(/\s+/).length <= 2;

const validate = (m) => {
  const errs = [];
  if (m.schema !== SCHEMA) {
    die(
      `unsupported schema ${JSON.stringify(m.schema)} — this importer only speaks ${SCHEMA}. ` +
        `Refusing rather than guessing at the shape.`
    );
  }
  if (!m.collection || !/^[a-z0-9][a-z0-9-]*$/.test(m.collection)) {
    errs.push(`collection must be a lowercase slug, got ${JSON.stringify(m.collection)}`);
  }
  if (!Array.isArray(m.photos) || !m.photos.length) errs.push("photos[] is empty or missing");

  const seen = new Set();
  for (const [i, p] of (m.photos ?? []).entries()) {
    const at = `photos[${i}]`;
    if (!p.id?.startsWith("sha256:")) errs.push(`${at}.id must be "sha256:…", got ${JSON.stringify(p.id)}`);
    if (seen.has(p.id)) errs.push(`${at}.id is a duplicate: ${p.id}`);
    seen.add(p.id);
    if (!p.file) errs.push(`${at}.file is required`);
    if (!Number.isInteger(p.width) || !Number.isInteger(p.height)) {
      errs.push(`${at} needs integer width/height (of the derivative)`);
    }
    const alt = badAlt(p.alt, p.file ?? "");
    if (alt) errs.push(`${at}.alt ${alt} — see bridge spec §5 (file: ${p.file})`);
  }
  if (errs.length) {
    console.error(`✗ manifest failed validation (${errs.length} problem${errs.length > 1 ? "s" : ""}):`);
    for (const e of errs) console.error(`  - ${e}`);
    process.exit(1);
  }

  const thin = m.photos.filter((p) => thinAlt(p.alt));
  if (thin.length) {
    const dupes = new Map();
    for (const p of thin) dupes.set(p.alt, (dupes.get(p.alt) ?? 0) + 1);
    console.warn(
      `\n⚠ ${thin.length}/${m.photos.length} photo(s) have alt text of two words or fewer.`
    );
    console.warn("  These pass the spec but read poorly to a screen reader. Most repeated:");
    for (const [alt, n] of [...dupes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)) {
      console.warn(`    ${n}×  "${alt}"`);
    }
    console.warn("  Fix at the source (fineshyt `subject`), not here.\n");
  }
};

/** Diff by id so a re-export is an update, not a duplicate (bridge spec §7). */
const diff = (incoming, existing) => {
  const prev = new Map((existing?.photos ?? []).map((p) => [p.id, p]));
  const next = new Map(incoming.photos.map((p) => [p.id, p]));
  return {
    added: incoming.photos.filter((p) => !prev.has(p.id)),
    changed: incoming.photos.filter((p) => {
      const o = prev.get(p.id);
      return o && (o.alt !== p.alt || o.width !== p.width || o.height !== p.height || o.rating !== p.rating);
    }),
    orphaned: [...prev.values()].filter((p) => !next.has(p.id)),
  };
};

const main = () => {
  const args = process.argv.slice(2);
  const flags = new Set(args.filter((a) => a.startsWith("--")));
  const stagingDir = args.find((a) => !a.startsWith("--"));
  const prune = flags.has("--prune");
  const dryRun = flags.has("--dry-run");

  if (!stagingDir) die("usage: pnpm blog:photos <staging-dir> [--prune] [--dry-run]");

  const manifestPath = path.join(stagingDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) die(`no manifest.json at ${manifestPath}`);

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (err) {
    die(`manifest.json is not valid JSON: ${err.message}`);
  }
  validate(manifest);

  const { collection } = manifest;
  const outDir = path.join(process.cwd(), "public", "images", collection);
  const committedPath = path.join(process.cwd(), "content", "photos", `${collection}.json`);

  const existing = fs.existsSync(committedPath)
    ? JSON.parse(fs.readFileSync(committedPath, "utf8"))
    : null;
  const d = diff(manifest, existing);

  // Every referenced derivative must actually exist before we touch anything.
  const missing = [];
  for (const p of manifest.photos) {
    for (const rel of [p.file, p.thumb].filter(Boolean)) {
      if (!fs.existsSync(path.join(stagingDir, rel))) missing.push(rel);
    }
  }
  if (missing.length) {
    console.error(`✗ manifest references ${missing.length} file(s) not present in ${stagingDir}:`);
    for (const m of missing.slice(0, 10)) console.error(`  - ${m}`);
    process.exit(1);
  }

  console.log(`collection: ${collection}`);
  console.log(`  + ${d.added.length} added   ~ ${d.changed.length} changed   ? ${d.orphaned.length} orphaned`);
  for (const p of d.orphaned) {
    console.log(`    orphaned: ${p.src ?? p.id}${prune ? " (will delete)" : " (kept — pass --prune to remove)"}`);
  }

  if (dryRun) {
    console.log("\n--dry-run: nothing written.");
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(path.dirname(committedPath), { recursive: true });

  const photos = manifest.photos.map((p) => {
    const { file, thumb, ...rest } = p;
    fs.copyFileSync(path.join(stagingDir, file), path.join(outDir, path.basename(file)));
    if (thumb) fs.copyFileSync(path.join(stagingDir, thumb), path.join(outDir, path.basename(thumb)));
    return {
      ...rest,
      src: `/images/${collection}/${path.basename(file)}`,
      ...(thumb ? { thumb: `/images/${collection}/${path.basename(thumb)}` } : {}),
    };
  });

  if (prune) {
    for (const p of d.orphaned) {
      for (const url of [p.src, p.thumb].filter(Boolean)) {
        const abs = path.join(process.cwd(), "public", url.replace(/^\//, ""));
        if (fs.existsSync(abs)) fs.rmSync(abs);
      }
    }
  }

  const committed = {
    schema: manifest.schema,
    collection,
    exported_at: manifest.exported_at ?? null,
    imported_at: new Date().toISOString(),
    source: manifest.source ?? null,
    derivative: manifest.derivative ?? null,
    photos,
  };
  fs.writeFileSync(committedPath, JSON.stringify(committed, null, 2) + "\n", "utf8");

  console.log(`\n✓ ${photos.length} photo(s) → public/images/${collection}/`);
  console.log(`✓ manifest → content/photos/${collection}.json`);
  console.log("\nReview the diff and commit — this script does not commit for you.");
};

main();
