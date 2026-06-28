import fs from "node:fs";
import path from "node:path";

const CACHE_DIR = path.join(process.cwd(), "scripts", ".tana-cache");
const CACHE_FILE = path.join(CACHE_DIR, "url-meta.json");

const decodeEntities = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

let cache = null;

const loadCache = () => {
  if (cache) return;
  try {
    if (fs.existsSync(CACHE_FILE)) {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
    } else {
      cache = {};
    }
  } catch (err) {
    console.warn("Failed to load url-meta cache, starting fresh:", err.message);
    cache = {};
  }
};

const saveCache = () => {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } catch (err) {
    console.warn("Failed to write url-meta cache:", err.message);
  }
};

const matchMeta = (html, property) => {
  const re1 = new RegExp(
    `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`,
    "i",
  );
  const re2 = new RegExp(
    `<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`,
    "i",
  );
  const m = html.match(re1) || html.match(re2);
  return m ? decodeEntities(m[1].trim()) : "";
};

export async function fetchMeta(targetUrl, forceRefresh = false) {
  loadCache();

  if (!forceRefresh && Object.prototype.hasOwnProperty.call(cache, targetUrl)) {
    return cache[targetUrl];
  }

  try {
    console.log(`  → fetching ${targetUrl}`);
    const response = await fetch(targetUrl, {
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "Tana-MDX-Importer/1.0" },
      redirect: "follow",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();

    let title = matchMeta(html, "og:title");
    if (!title) {
      const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (t) title = decodeEntities(t[1].trim().replace(/\s+/g, " "));
    }
    const siteName = matchMeta(html, "og:site_name");

    const result = {
      title: title || null,
      siteName: siteName || null,
      url: targetUrl,
    };
    cache[targetUrl] = result;
    saveCache();
    return result;
  } catch (err) {
    console.warn(`  ↳ failed: ${err.message}`);
    cache[targetUrl] = null;
    saveCache();
    return null;
  }
}
