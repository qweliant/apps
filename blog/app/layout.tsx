import type { Metadata } from "next";
import { Fredoka, Nunito, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import MusicPlayer from "./components/MusicPlayer";

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

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Optimal Frequencies",
  description:
    "Essays, projects, and a garden — ad-free, no trackers, CC BY 4.0.",
  referrer: "no-referrer",
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
        className={`${fredoka.variable} ${nunito.variable} ${geistMono.variable} ${lora.variable} antialiased font-nunito`}
      >
        <header className="lb-topbar">
          <nav className="container mx-auto flex flex-wrap items-center justify-between gap-y-2 px-4 py-2.5">
            <Link
              href="/"
              className="font-fredoka text-xl sm:text-2xl font-semibold text-[var(--bar-ink)] hover:text-[var(--deep-pink)] transition-colors duration-200"
            >
              ✦ Optimal Frequencies
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
              <Link
                href="/#garden"
                className="lb-navlink"
              >
                Garden
              </Link>
              <Link
                href="/fotos"
                className="lb-navlink"
              >
                Fotos
              </Link>
              <Link
                href="mailto:qwelian@tutanota.com"
                className="lb-navlink"
              >
                Contact
              </Link>
              <Link
                href="/posts"
                className="lb-navlink"
              >
                Archive
              </Link>
              <Link
                href="/about"
                className="lb-navlink"
              >
                About
              </Link>
              <Link
                href="/posts/rss.xml"
                className="lb-navlink"
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
        <main className="lb-desktop">{children}</main>
        <MusicPlayer />
        <footer className="mt-24 text-center relative z-10 pb-8">
          <p className="italic text-[var(--lavender)]">
            Stay passionate, stay chill, and never stop exploring what life can
            be.
          </p>
          <p className="text-[var(--muted-text)] text-sm mt-1">
            © {new Date().getFullYear()} Qwelian Tanner ·{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 4.0
            </a>{" "}
            — share &amp; adapt with credit.
          </p>
        </footer>
      </body>
    </html>
  );
}
