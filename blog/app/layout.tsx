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
            <Link href="/" className="text-2xl font-bold text-black">
              Optimal Frequencies
            </Link>
            <div className="flex space-x-8">
              <Link
                href="/"
                className="text-lg font-medium hover:underline text-purple-500"
              >
                Home
              </Link>

              <Link
                href="/fotos"
                className="text-lg font-medium hover:underline text-purple-500"
              >
                Fotos
              </Link>
              <Link
                href="mailto:qwelian@tutanota.com"
                className="text-lg font-medium hover:underline text-purple-500"
              >
                Contact
              </Link>
              <Link
                href="/posts"
                className="text-lg font-medium hover:underline text-purple-500"
              >
                Archive
              </Link>
              <Link
                href="/about"
                className="text-lg font-medium hover:underline text-purple-500"
              >
                About
              </Link>
            </div>
          </nav>
        </header>
        <main className="">{children}</main>
        <footer className="mt-12 text-center text-gray-600">
          <p className="italic">
            Stay passionate, stay chill, and never stop exploring what life can
            be.
          </p>
        </footer>
        <footer className="py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} My Blog. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
