"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Camera info for the carousel
const cameraInfo = [
  {
    name: "Nikon FM2",
    description:
      "Released in 1982, the Nikon FM2 is known for its mechanical precision and reliability.",
    image: "/images/nikon-fm2.jpg",
  },
  {
    name: "Nikon D850",
    description:
      "Introduced in 2017, the D850 is a versatile full-frame DSLR, ideal for high-resolution photography.",
    image: "/images/nikon-d850.jpg",
  },
  {
    name: "Yashica Mat-124G",
    description:
      "A classic twin-lens reflex camera released in 1970. Beloved for medium-format photography.",
    image: "/images/yashica-mat.jpg",
  },
];

// Explicit type for children prop
type ParallaxSectionProps = {
  children: React.ReactNode;
};

const ParallaxSection = ({ children }: ParallaxSectionProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

// Explicit type for children prop
type FadeInSectionProps = {
  children: React.ReactNode;
};

const FadeInSection = ({ children }: FadeInSectionProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

const CameraCard = ({
  camera,
  index,
}: {
  camera: {
    name: string;
    description: string;
    image: string;
  };
  index: number;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={
        inView
          ? { opacity: 1, x: 0 }
          : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
      }
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="bg-gray-900 rounded-lg p-6 shadow-xl"
    >
      <div className="relative h-64 mb-4">
        <Image
          src={camera.image}
          alt={camera.name}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <h3 className="text-2xl font-bold mb-2">{camera.name}</h3>
      <p className="text-gray-300">{camera.description}</p>
    </motion.div>
  );
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative h-screen overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <Image
            src="/images/_DSC3814.jpg"
            alt="Featured Image"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-bold text-center text-white drop-shadow-lg"
          >
            Your Photo Blog
          </motion.h1>
        </div>
      </motion.section>

      {/* Camera Collection Section */}
      <section className="px-4 py-24 md:px-16 bg-black">
        <FadeInSection>
          <h2 className="text-4xl font-bold text-center mb-16">
            My Camera Collection
          </h2>
        </FadeInSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cameraInfo.map((camera, index) => (
            <CameraCard key={camera.name} camera={camera} index={index} />
          ))}
        </div>
      </section>

      {/* About Photography Section */}
      <ParallaxSection>
        <section className="relative px-4 py-24 md:px-16 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <FadeInSection>
              <h2 className="text-4xl font-bold text-center mb-8">
                About My Photography
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                Welcome to my photography blog where I explore the beauty of the
                world through my lens. Each camera in my collection has a story
                to tell, capturing moments that transcend time.
              </p>
            </FadeInSection>
          </div>
        </section>
      </ParallaxSection>

      {/* Footer */}
      <footer className="text-center py-8 bg-black">
        <p className="text-gray-500">
          © {new Date().getFullYear()} Your Photo Blog
        </p>
      </footer>
    </main>
  );
}
