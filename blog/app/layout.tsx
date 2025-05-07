import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <nav className="container mx-auto flex flex-wrap items-center justify-between p-4">
            <Link href="/" className="text-2xl font-bold ">
              Optimal Frequencies
            </Link>
            <div>
              Portfolio
            </div>
            <div className="flex space-x-8">
              <Link
                href="/fotos"
                className="text-lg font-medium hover:underline"
              >
                Fotos
              </Link>
              <Link
                href="mailto:qwelian@tutanota.com"
                className="text-lg font-medium hover:underline "
              >
                Contact
              </Link>
              <Link
                href="/posts"
                className="text-lg font-medium hover:underline "
              >
                Archive
              </Link>
              <Link
                href="/about"
                className="text-lg font-medium hover:underline"
              >
                About
              </Link>
              <Link
                href="/posts/rss.xml"
                className="text-lg font-medium hover:underline"
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
        <footer className="mt-24 text-center relative z-10">
          <p className="italic">
            Stay passionate, stay chill, and never stop exploring what life can
            be.
          </p>
          © {new Date().getFullYear()} My Blog. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
