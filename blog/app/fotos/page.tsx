"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type PhotoCategory = "all" | "flora" | "travel";

interface Photo {
  src: string;
  alt: string;
  category: PhotoCategory;
}

const floraImages = [
  "_DSC2657.jpeg",
  "_DSC3453.jpeg",
  "_DSC3455.jpeg",
  "_DSC3814.jpg",
  "000015390011.jpeg",
  "DSC_0724.jpeg",
  "DSC_0815.jpeg",
  "DSC_0866.jpeg",
  "DSC_1790.jpeg",
  "DSC_1824.jpeg",
  "DSC_1834.jpeg",
  "DSC_1990.jpeg",
  "DSC_2039.jpeg",
  "DSC_2072.jpeg",
  "DSCF0332.jpeg",
  "Hibiscus.jpeg",
  "orchids.jpeg",
  "Untitled.jpeg",
  "zelia_export.jpeg",
  "zelia.jpeg",
];

const travelImages = [
  "000366550011.jpeg",
  "000554650007.jpeg",
  "000701500014.jpeg",
  "000701500035.jpeg",
  "035330006511-R1-017-7.jpeg",
  "IMG_0515.jpeg",
  "IMG_0615.jpeg",
  "IMG_1968.jpeg",
  "IMG_2114.jpeg",
  "IMG_2160.jpeg",
  "IMG_2168.jpeg",
  "IMG_2251.jpeg",
  "IMG_2278.jpeg",
  "IMG_2317.jpeg",
  "IMG_2326.jpeg",
  "IMG_2345.jpeg",
  "IMG_3556.jpeg",
  "IMG_3559.jpeg",
  "IMG_8178.jpeg",
  "IMG_8572.jpeg",
];

const buildPhotos = (
  category: Exclude<PhotoCategory, "all">,
  filenames: string[]
): Photo[] =>
  filenames.map((name) => ({
    src: `/images/${category}/${name}`,
    alt: `${category} — ${name}`,
    category,
  }));

const photos: Photo[] = [
  ...buildPhotos("flora", floraImages),
  ...buildPhotos("travel", travelImages),
];

const CATEGORY_META: Record<PhotoCategory, { label: string; count: number }> = {
  all: { label: "All", count: photos.length },
  flora: { label: "Flora", count: floraImages.length },
  travel: { label: "Travel", count: travelImages.length },
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
      {categories.map((c) => {
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
            width={0}
            height={0}
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
          src="/images/_DSC2366.jpeg"
          alt="cover"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/70 mb-2">
              — fotos —
            </p>
            <h1 className="font-fredoka text-4xl md:text-6xl text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
              making sense, still and alone
            </h1>
          </div>
        </div>
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
