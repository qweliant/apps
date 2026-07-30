/**
 * Pull externally-hosted images into public/images/ at import time.
 *
 * Why: images pasted into Tana land on Firebase Storage behind a `?token=` URL.
 * Those render today and break permanently whenever the token rotates — and
 * because the blog syndicates to email, a rotted URL is a broken image in
 * someone's inbox forever, where we can't fix it after the fact. Self-hosting
 * is the only durable option.
 *
 * Re-encodes to WebP (the house format) if `cwebp` is on PATH; falls back to
 * storing the original bytes if it isn't.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";

const EXT_BY_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MD_IMAGE_RE = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;

const hasCwebp = () => {
  try {
    execFileSync("cwebp", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

/** `Some_Long_Post_Title` → `some-long-post-title` capped for use as a filename. */
const baseName = (slug) =>
  slug
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 32)
    .replace(/-$/, "");

/**
 * @returns {{ body: string, rehosted: string[], failed: {url:string,why:string}[] }}
 */
export const rehostImages = async (body, { slug, imagesDir, urlPrefix = "/images" }) => {
  const urls = [...new Set([...body.matchAll(MD_IMAGE_RE)].map((m) => m[2]))];
  if (!urls.length) return { body, rehosted: [], failed: [] };

  fs.mkdirSync(imagesDir, { recursive: true });
  const webp = hasCwebp();
  const base = baseName(slug);
  const rehosted = [];
  const failed = [];
  let out = body;
  let n = 0;

  for (const url of urls) {
    n += 1;
    let res;
    try {
      // Plenty of hosts (Wikimedia among them) 400 a request with no User-Agent.
      res = await fetch(url, {
        headers: { "User-Agent": "qwelian-blog-import/1.0 (+https://qwelian.com)" },
      });
    } catch (err) {
      failed.push({ url, why: err.message });
      continue;
    }
    if (!res.ok) {
      failed.push({ url, why: `HTTP ${res.status}` });
      continue;
    }
    const type = (res.headers.get("content-type") || "").split(";")[0];
    const srcExt = EXT_BY_TYPE[type];
    if (!srcExt) {
      failed.push({ url, why: `unexpected content-type ${type || "(none)"}` });
      continue;
    }

    const buf = Buffer.from(await res.arrayBuffer());
    let bytes = buf;
    let ext = srcExt;

    if (webp && srcExt !== "webp") {
      try {
        const tmpIn = path.join(os.tmpdir(), `rehost-${process.pid}-${n}.${srcExt}`);
        const tmpOut = path.join(os.tmpdir(), `rehost-${process.pid}-${n}.webp`);
        fs.writeFileSync(tmpIn, buf);
        execFileSync("cwebp", ["-quiet", "-q", "82", "-resize", "1600", "0", tmpIn, "-o", tmpOut]);
        bytes = fs.readFileSync(tmpOut);
        ext = "webp";
        fs.rmSync(tmpIn, { force: true });
        fs.rmSync(tmpOut, { force: true });
      } catch {
        // keep the original bytes; a bigger file beats a broken pipeline
      }
    }

    const name = `${base}-${n}.${ext}`;
    fs.writeFileSync(path.join(imagesDir, name), bytes);
    out = out.split(url).join(`${urlPrefix}/${name}`);
    rehosted.push(`${name} (${(bytes.length / 1024).toFixed(0)}KB${ext === "webp" && srcExt !== "webp" ? `, from ${srcExt}` : ""})`);
  }

  return { body: out, rehosted, failed };
};
