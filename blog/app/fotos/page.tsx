"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import floraManifest from "@/content/photos/flora.json";
import travelManifest from "@/content/photos/travel.json";

type PhotoCategory = "all" | "flora" | "travel";

interface Photo {
  src: string;
  alt: string;
  category: PhotoCategory;
  width: number;
  height: number;
  thumb?: string;
}

/**
 * Collections come from content/photos/<collection>.json, written by
 * `pnpm blog:photos` from a fineshyt export (see docs/fineshyt-bridge.md).
 * Imported as JSON modules so they inline at build time — no runtime fs read,
 * which is what keeps public/ out of the serverless bundle.
 */
const fromManifest = (
  manifest: { photos: { src: string; alt: string; width: number; height: number; thumb?: string }[] },
  category: Exclude<PhotoCategory, "all">
): Photo[] => manifest.photos.map((p) => ({ ...p, category }));

const floraPhotos = fromManifest(floraManifest, "flora");
const travelPhotos = fromManifest(travelManifest, "travel");
const photos: Photo[] = [...floraPhotos, ...travelPhotos];

const CATEGORY_META: Record<PhotoCategory, { label: string; count: number }> = {
  all: { label: "All", count: photos.length },
  flora: { label: "Flora", count: floraPhotos.length },
  travel: { label: "Travel", count: travelPhotos.length },
};

function CategoryFilter({
  current,
  onChange,
}: {
  current: PhotoCategory;
  onChange: (c: PhotoCategory) => void;
}) {
  const categories: PhotoCategory[] = ["all", "flora", "travel"];
  return (
    <div className="flex justify-center gap-8 font-mono text-xs tracking-[0.25em] uppercase">
      {categories.map((c: PhotoCategory) => {
        const active = current === c;
        const meta = CATEGORY_META[c];
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`relative pb-1 transition-colors ${
              active
                ? "text-[#FF4D94]"
                : "text-[#C9A8FF]/70 hover:text-[#FF85B3]"
            }`}
          >
            {meta.label}
            <span className="ml-1 text-[0.65rem] opacity-60">({meta.count})</span>
            {active && (
              <motion.span
                layoutId="foto-cat-underline"
                className="absolute left-0 right-0 -bottom-0.5 h-px bg-[#FF4D94]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function PhotoColumn({
  items,
  onPhotoClick,
}: {
  items: Photo[];
  onPhotoClick: (p: Photo) => void;
}) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
      {items.map((photo) => (
        <motion.figure
          key={photo.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="break-inside-avoid mb-4 relative overflow-hidden cursor-pointer group"
          onClick={() => onPhotoClick(photo)}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-auto"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
          <figcaption className="absolute bottom-0 left-0 right-0 p-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/0 group-hover:text-white/80 transition-colors duration-300 bg-gradient-to-t from-black/60 to-transparent">
            {photo.category}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

function ImageModal({
  photo,
  onClose,
  onNext,
  onPrevious,
}: {
  photo: Photo;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
        className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        aria-label="previous photo"
      >
        <ChevronLeft size={24} />
      </button>

      <div
        className="relative w-full h-full max-w-6xl max-h-[90vh] mx-12"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority
        />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        aria-label="next photo"
      >
        <ChevronRight size={24} />
      </button>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        aria-label="close"
      >
        <X size={24} />
      </button>
    </motion.div>
  );
}

export default function FotosPage() {
  const [currentCategory, setCurrentCategory] = useState<PhotoCategory>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const filteredPhotos =
    currentCategory === "all"
      ? photos
      : photos.filter((p) => p.category === currentCategory);

  const handleNext = () => {
    if (!selectedPhoto) return;
    const i = photos.findIndex((p) => p.src === selectedPhoto.src);
    setSelectedPhoto(photos[(i + 1) % photos.length]);
  };
  const handlePrevious = () => {
    if (!selectedPhoto) return;
    const i = photos.findIndex((p) => p.src === selectedPhoto.src);
    setSelectedPhoto(photos[(i - 1 + photos.length) % photos.length]);
  };

  return (
    <main className="min-h-screen">
      {/* Hero — a single image, title plate, minimal chrome */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <Image
          src="/images/dsc2366.webp"
          alt="silhouette of a shaved head in profile against a screen of blurred red and green foliage"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />
      </section>

      {/* Artist statement */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C9A8FF]/70 mb-4">
          artist statement
        </p>
        <p className="text-base md:text-lg leading-relaxed text-foreground/90">
          I often find myself alone, immersed in the process of capturing
          images. Photography, for me, isn&apos;t about technical skill so
          much as a way to make sense of things and search for meaning in
          moments that might otherwise go unnoticed. Photos sometimes lack
          an immediate sense of place, but over time they evoke a familiarity
          that prompts reflection. I&apos;ve learned meaning often arrives
          later. Being still and present, even in solitude, reveals beauty in
          the simplest moments.
        </p>
      </section>

      {/* Category filter */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <CategoryFilter
          current={currentCategory}
          onChange={setCurrentCategory}
        />
      </section>

      {/* Masonry grid */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PhotoColumn
              items={filteredPhotos}
              onPhotoClick={setSelectedPhoto}
            />
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <ImageModal
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
