"use client";
import { useState, useEffect, useCallback } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Win from "../components/Win";
import { photos, TABS, type Category, type Photo } from "./collections";

/** Star row for the fineshyt rating that rode across in the manifest. */
function Stars({ n }: { n: number }) {
  return (
    <span className="foto-stars" aria-label={`rated ${n} of 5`}>
      {"★★★★★".slice(0, n)}
      <span aria-hidden>{"☆☆☆☆☆".slice(0, 5 - n)}</span>
    </span>
  );
}

function CollectionTabs({
  current,
  onChange,
}: {
  current: Category;
  onChange: (c: Category) => void;
}) {
  return (
    <div className="foto-tabs">
      {TABS.map((t) => {
        const active = current === t.slug;
        return (
          <button
            key={t.slug}
            onClick={() => onChange(t.slug)}
            aria-pressed={active}
            className={`foto-tab${active ? " is-active" : ""}`}
            style={{ "--accent": t.accent } as CSSProperties}
          >
            <span className="foto-tab-emblem" aria-hidden>
              {t.emblem}
            </span>
            {t.label}
            <span className="foto-tab-count">{t.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function PhotoGrid({
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
          transition={{ duration: 0.5 }}
          className="foto-cell"
          style={{ "--accent": photo.accent } as CSSProperties}
        >
          {/* a real button: the grid was previously unreachable by keyboard */}
          <button
            type="button"
            className="foto-frame"
            onClick={() => onPhotoClick(photo)}
            aria-label={`Open larger: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-auto block"
              loading="lazy"
            />
            <span className="foto-veil" aria-hidden />
            {photo.chefs_pick ? (
              <span className="foto-pick" aria-hidden>
                ★ pick
              </span>
            ) : null}
            <figcaption className="foto-cap">{photo.alt}</figcaption>
          </button>
        </motion.figure>
      ))}
    </div>
  );
}

function Lightbox({
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
  // The lightbox previously trapped users with no keyboard exit at all.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrevious();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="foto-lb"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
    >
      <div className="foto-lb-win" onClick={(e) => e.stopPropagation()}>
        <div className="win-bar">
          <span className="win-title">
            <span style={{ color: photo.accent }} aria-hidden>
              ▣
            </span>
            <span className="foto-lb-name">{photo.categoryLabel}</span>
          </span>
          <span className="win-btns">
            <i aria-hidden>_</i>
            <i aria-hidden>□</i>
            <button type="button" onClick={onClose} aria-label="Close" className="foto-lb-x">
              <X size={11} />
            </button>
          </span>
        </div>

        <div className="foto-lb-body">
          <button type="button" className="foto-nav left" onClick={onPrevious} aria-label="Previous photo">
            <ChevronLeft size={22} />
          </button>

          <div className="foto-lb-stage">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="foto-lb-img"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>

          <button type="button" className="foto-nav right" onClick={onNext} aria-label="Next photo">
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="foto-lb-meta">
          <p className="foto-lb-alt">{photo.alt}</p>
          <div className="foto-lb-facts">
            {typeof photo.rating === "number" ? <Stars n={photo.rating} /> : null}
            {photo.taken_at ? <span className="k">{photo.taken_at}</span> : null}
            {photo.tags?.length ? (
              <span className="foto-lb-tags">
                {photo.tags.slice(0, 5).map((t) => (
                  <span key={t} className="clq">
                    {t}
                  </span>
                ))}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FotosPage() {
  const [currentCategory, setCurrentCategory] = useState<Category>("all");
  const [selected, setSelected] = useState<Photo | null>(null);

  const visible =
    currentCategory === "all" ? photos : photos.filter((p) => p.category === currentCategory);

  // Navigate within the filtered set — stepping into hidden photos was disorienting.
  const step = useCallback(
    (delta: number) => {
      if (!selected) return;
      const i = visible.findIndex((p) => p.src === selected.src);
      if (i === -1) return;
      setSelected(visible[(i + delta + visible.length) % visible.length]);
    },
    [selected, visible]
  );

  return (
    <div className="max-w-[1180px] mx-auto px-3.5 pb-14">
      <section className="pt-4 pb-3">
        <Win title={<>◈ fotos.exe</>} bodyClassName="win-body foto-intro-body">
          <div className="foto-hero">
            <Image
              src="/images/dsc2366.webp"
              alt="silhouette of a shaved head in profile against a screen of blurred red and green foliage"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <p className="foto-statement">
            I often find myself alone, immersed in the process of capturing images. Photography, for
            me, isn&apos;t about technical skill so much as a way to make sense of things and search
            for meaning in moments that might otherwise go unnoticed. Photos sometimes lack an
            immediate sense of place, but over time they evoke a familiarity that prompts reflection.
            I&apos;ve learned meaning often arrives later. Being still and present, even in solitude,
            reveals beauty in the simplest moments.
          </p>
        </Win>
      </section>

      <section className="pb-4">
        <Win title={<>▤ collections</>}>
          <CollectionTabs current={currentCategory} onChange={setCurrentCategory} />
        </Win>
      </section>

      <section className="pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <PhotoGrid items={visible} onPhotoClick={setSelected} />
          </motion.div>
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {selected && (
          <Lightbox
            photo={selected}
            onClose={() => setSelected(null)}
            onNext={() => step(1)}
            onPrevious={() => step(-1)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
