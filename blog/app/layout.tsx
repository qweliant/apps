import type { Metadata } from "next";
import { Fredoka, Nunito, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Optimal Frequencies",
  description: "A personal blog powered by Next.js",
  alternates: {
    types: {
      "application/rss+xml": [
        {
          title: "Optimal Frequencies",
          url: "https://qwelian.com/blog/index.xml",
        },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${nunito.variable} ${geistMono.variable} antialiased font-nunito`}
      >
        <header className="sticky top-0 z-50 border-b border-[#FF85B3]/20 bg-[var(--background)]/80 backdrop-blur-md">
          <nav className="container mx-auto flex flex-wrap items-center justify-between p-4">
            <Link
              href="/"
              className="font-fredoka text-2xl font-semibold text-[#FF4D94] hover:text-[#FF85B3] transition-colors duration-200 drop-shadow-[0_0_12px_rgba(255,133,179,0.5)]"
            >
              Optimal Frequencies
            </Link>
            <div className="flex space-x-8">
              <Link
                href="/fotos"
                className="text-lg font-semibold text-[#C9A8FF] hover:text-[#FF85B3] transition-colors duration-200"
              >
                Fotos
              </Link>
              <Link
                href="mailto:qwelian@tutanota.com"
                className="text-lg font-semibold text-[#C9A8FF] hover:text-[#FF85B3] transition-colors duration-200"
              >
                Contact
              </Link>
              <Link
                href="/posts"
                className="text-lg font-semibold text-[#C9A8FF] hover:text-[#FF85B3] transition-colors duration-200"
              >
                Archive
              </Link>
              <Link
                href="/about"
                className="text-lg font-semibold text-[#C9A8FF] hover:text-[#FF85B3] transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/posts/rss.xml"
                className="text-lg font-semibold text-[#C9A8FF] hover:text-[#FF85B3] transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-rss"
                >
                  <path d="M4 11a9 9 0 0 1 9 9" />
                  <path d="M4 4a16 16 0 0 1 16 16" />
                  <circle cx="5" cy="19" r="1" />
                </svg>
              </Link>
            </div>
          </nav>
        </header>
        <main className="">{children}</main>
        <footer className="mt-24 text-center relative z-10 pb-8">
          <p className="italic text-[#C9A8FF]">
            Stay passionate, stay chill, and never stop exploring what life can
            be.
          </p>
          <p className="text-[#FF85B3]/60 text-sm mt-1">
            © {new Date().getFullYear()} My Blog. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
