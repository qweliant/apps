"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Photo category types and data
type PhotoCategory = "all" | "flora" | "travel";

interface Photo {
  src: string;
  alt: string;
  category: PhotoCategory;
  blurDataUrl?: string; // For blur placeholder
}

const photos: Photo[] = [
  // Flora category
  {
    src: "/images/flora/DSC_0724.jpeg",
    alt: "Flora Image", // Replace with descriptive alt text
    category: "flora",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/flora/DSC_1990.jpeg",
    alt: "Flora Image", // Replace with descriptive alt text
    category: "flora",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/flora/DSC_2039.jpeg",
    alt: "Flora Image",
    category: "flora",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/flora/DSC_2072.jpeg",
    alt: "Flora Image",
    category: "flora",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/flora/DSCF0332.jpeg",
    alt: "Flora Image", // Replace with descriptive alt text
    category: "flora",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/flora/Hibiscus.jpeg",
    alt: "Flora Image",
    category: "flora",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/flora/orchids.jpeg",
    alt: "Flora Image",
    category: "flora",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/flora/Untitled.jpeg",
    alt: "Flora Image",
    category: "flora",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/flora/zelia_export.jpeg",
    alt: "Flora Image", // Replace with descriptive alt text
    category: "flora",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/flora/zelia???.jpeg",
    alt: "Flora Image",
    category: "flora",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },

  // Travel category
  {
    src: "/images/travel/000366550011.jpeg",
    alt: "Travel Image", // Replace with descriptive alt text
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/000554650007.jpeg",
    alt: "Travel Image", // Replace with descriptive alt text
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/000701500014.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/000701500035.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/035330006511-R1-017-7.jpeg",
    alt: "Travel Image", // Replace with descriptive alt text
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_0515.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_0615.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_1968.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_2114.jpeg",
    alt: "Travel Image", // Replace with descriptive alt text
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_2160.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_2168.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_2251.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_2278.jpeg",
    alt: "Travel Image", // Replace with descriptive alt text
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_2317.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_2326.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_2345.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_3556.jpeg",
    alt: "Travel Image", // Replace with descriptive alt text
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_3559.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_8178.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/travel/IMG_8572.jpeg",
    alt: "Travel Image",
    category: "travel",
    blurDataUrl: "data:image/jpeg;base64,/9j...",
  },
];

// Modal component
const ImageModal = ({
  photo,
  onClose,
  onNext,
  onPrevious,
}: {
  photo: Photo;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
    onClick={onClose}
  >
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
        className="absolute left-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
      >
        <ChevronLeft size={24} />
      </button>

      <div
        className="relative w-full h-full max-w-6xl max-h-[90vh]"
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
        className="absolute right-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
      >
        <ChevronRight size={24} />
      </button>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all"
      >
        <X size={24} />
      </button>
    </div>
  </motion.div>
);

// Category filter component
const CategoryFilter = ({
  currentCategory,
  onCategoryChange,
}: {
  currentCategory: PhotoCategory;
  onCategoryChange: (category: PhotoCategory) => void;
}) => {
  const categories: PhotoCategory[] = ["all", "flora", "travel"];

  return (
    <div className="flex justify-center gap-4 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full transition-all ${
            currentCategory === category
              ? "bg-foreground text-background"
              : "bg-background text-foreground border border-foreground hover:bg-foreground hover:text-background"
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
};

// Photo grid component with lazy loading and blur effect
const PhotoGrid = ({
  category,
  onPhotoClick,
}: {
  category: PhotoCategory;
  onPhotoClick: (photo: Photo) => void;
}) => {
  const filteredPhotos = photos.filter((photo) =>
    category === "all" ? true : photo.category === category
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {filteredPhotos.map((photo, index) => (
        <motion.div
          key={photo.src}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="relative aspect-square overflow-hidden group cursor-pointer"
          onClick={() => onPhotoClick(photo)}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={photo.blurDataUrl}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
        </motion.div>
      ))}
    </div>
  );
};

// Update FadeInSection to actually be used in the layout
const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

// Page transitions wrapper
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const [showMore, setShowMore] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentCategory, setCurrentCategory] = useState<PhotoCategory>("all");
  const heroRef = useRef(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Add scroll indicator animation
  const [scrollIndicatorRef, scrollIndicatorInView] = useInView({
    threshold: 0.1,
  });

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex((p) => p.src === selectedPhoto.src);
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };

  const handlePreviousPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex((p) => p.src === selectedPhoto.src);
    const previousIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[previousIndex]);
  };

  const handleExploreMoreClick = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setShowMore(true);
  };

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background">
        {/* Hero Section - Adjusted to 90vh to ensure scroll indicator visibility */}
        <motion.section
          ref={heroRef}
          className="relative h-[90vh] overflow-hidden"
          style={{ opacity: heroOpacity }}
        >
          <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
            <Image
              src="/images/_DSC2366.jpeg"
              alt="Featured landscape"
              fill
              priority
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j..."
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
          </motion.div>

          {/* Title and explore more in a container */}
          <div className="absolute inset-0 flex flex-col items-center justify-between py-20">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl text-white text-center tracking-wide"
            >
              Fotos
            </motion.h1>

            <div className="space-y-8 text-center">
              {/* Scroll indicator */}
              <motion.div
                ref={scrollIndicatorRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: scrollIndicatorInView ? 1 : 0 }}
                className="flex flex-col items-center space-y-2"
              >
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => {
                    handleExploreMoreClick();
                  }}
                  className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-full backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300"
                >
                  Explore More
                </motion.button>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center"
                >
                  <motion.div className="w-1 h-1 bg-white rounded-full" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <AnimatePresence>
          {showMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* About Photography Section - Now using FadeInSection */}
              <section
                ref={aboutRef}
                className="px-4 py-24 md:px-16 bg-background"
              >
                <div className="max-w-4xl mx-auto">
                  <FadeInSection>
                    <h2 className="text-4xl font-bold mb-8 text-foreground">
                      About My Photography
                    </h2>
                    <p className="text-lg leading-relaxed text-foreground opacity-90">
                      Through my lens, I capture the subtle interplay of light
                      and shadow, seeking to reveal the extraordinary in the
                      ordinary. My work focuses on finding beauty in both
                      natural landscapes and urban environments.
                    </p>
                  </FadeInSection>
                </div>
              </section>

              {/* Category Filter - Now using FadeInSection */}
              <section className="py-8 bg-background">
                <FadeInSection>
                  <CategoryFilter
                    currentCategory={currentCategory}
                    onCategoryChange={setCurrentCategory}
                  />
                </FadeInSection>
              </section>

              {/* Photo Grid Section */}
              <section className="py-16 bg-background">
                <PhotoGrid
                  category={currentCategory}
                  onPhotoClick={handlePhotoClick}
                />
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal remains unchanged */}
        <AnimatePresence>
          {selectedPhoto && (
            <ImageModal
              photo={selectedPhoto}
              onClose={() => setSelectedPhoto(null)}
              onNext={handleNextPhoto}
              onPrevious={handlePreviousPhoto}
            />
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
}
