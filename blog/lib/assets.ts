import fs from "fs";
import path from "path";

/**
 * List image files in a public/ subfolder, returned as site-root URLs.
 * Server-only (reads the filesystem at build/request time). Drop a file into
 * the folder and it shows up automatically — no code change needed.
 */
export function listPublicAssets(subdir: string): string[] {
  const dir = path.join(process.cwd(), "public", subdir);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(gif|png|jpe?g|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/${subdir}/${f}`);
  } catch {
    return [];
  }
}
