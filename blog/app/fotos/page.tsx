"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Full-Screen Hero Section with Local Image */}
      <section className="relative w-full h-screen">
        <div className="absolute inset-0 bg-cover bg-center">
          <Image
            src="/images/_DSC3814.jpg" // Path to your local image
            alt="Featured Image"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-wider text-center">
              Optimal Lighitng
            </h1>
          </div>
        </div>

        {/* Load More Button */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => setShowAbout(true)}
            className="bg-transparent text-white text-lg font-medium border-2 border-white px-6 py-2 hover:bg-white hover:text-black transition-all"
          >
            Load More
          </button>
        </div>
      </section>

      {/* Parallax Scrolling Section - About Photography */}
      {showAbout && (
        <section className="relative h-screen">
          <div
            className="parallax bg-cover bg-center"
            style={{ backgroundImage: 'url("/images/_DSC3814.jpg")' }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="text-center text-white px-6 py-8">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                  About My Photography
                </h2>
                <p className="text-lg">
                  Photography is a way for me to capture moments that speak to
                  me, whether it&apos;s the beauty of nature or the stories
                  behind my camera collection. I strive to create timeless
                  images that convey the essence of life&apos;s fleeting
                  moments.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid Section */}
      <section className="bg-black text-white p-8 md:p-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
          Gallery
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Example images */}
          <div className="bg-gray-300 h-64 flex items-center justify-center">
            <span>Image 1</span>
          </div>
          <div className="bg-gray-300 h-64 flex items-center justify-center">
            <span>Image 2</span>
          </div>
          <div className="bg-gray-300 h-64 flex items-center justify-center">
            <span>Image 3</span>
          </div>
          <div className="bg-gray-300 h-64 flex items-center justify-center">
            <span>Image 4</span>
          </div>
        </div>
      </section>
    </div>
  );
}
