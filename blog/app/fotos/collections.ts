import floraManifest from "@/content/photos/flora.json";
import travelManifest from "@/content/photos/travel.json";

/**
 * One fineshyt project == one collection. Adding a collection is two lines:
 * import its manifest, add a row here. Order is display order.
 *
 * `content/photos/flowers.json` exists and is committed, but is deliberately
 * NOT listed — it's awaiting a rating pass in fineshyt. A manifest on disk is
 * staged, not published; this array is the thing that makes it public.
 */
export const COLLECTIONS = [
  { slug: "flora", label: "Flora", emblem: "❀", accent: "var(--mint)", manifest: floraManifest },
  { slug: "travel", label: "Travel", emblem: "✈", accent: "var(--bluebell)", manifest: travelManifest },
] as const;

export type CollectionSlug = (typeof COLLECTIONS)[number]["slug"];
export type Category = "all" | CollectionSlug;

export interface Photo {
  id?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  thumb?: string;
  category: CollectionSlug;
  categoryLabel: string;
  accent: string;
  rating?: number | null;
  chefs_pick?: boolean | null;
  tags?: string[] | null;
  taken_at?: string | null;
}

export const photos: Photo[] = COLLECTIONS.flatMap((c) =>
  (c.manifest.photos as Omit<Photo, "category" | "categoryLabel" | "accent">[]).map((p) => ({
    ...p,
    category: c.slug,
    categoryLabel: c.label,
    accent: c.accent,
  }))
);

export const TABS: { slug: Category; label: string; emblem: string; accent: string; count: number }[] = [
  { slug: "all", label: "All", emblem: "✦", accent: "var(--sakura)", count: photos.length },
  ...COLLECTIONS.map((c) => ({
    slug: c.slug as Category,
    label: c.label,
    emblem: c.emblem,
    accent: c.accent,
    count: c.manifest.photos.length,
  })),
];
