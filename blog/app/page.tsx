/* eslint-disable @next/next/no-img-element -- self-hosted decorative old-web graphics */
import Link from "next/link";
import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { FaGithub, FaPython } from "react-icons/fa";
import {
  SiElixir,
  SiPhoenixframework,
  SiRust,
  SiTypescript,
  SiPostgresql,
  SiMqtt,
  SiBun,
  SiSqlite,
} from "react-icons/si";
import { getAllPosts } from "@/lib/functions";
import Win from "./components/Win";
import Marquee from "./components/Marquee";
import VisitorCounter from "./components/VisitorCounter";
import Newsletter from "./components/Newsletter";
import { listPublicAssets } from "@/lib/assets";

type Project = {
  title: string;
  description: string;
  url: string;
  live?: string;
  stack: IconType[];
};

const projects: Project[] = [
  {
    title: "Ankaa",
    description:
      "Real-time monitoring and alerting for at-home hemodialysis — catches critical events like severe hypotension and blood loss and pages caregivers. Built for NxStage setups with Phoenix LiveView and a Rust sensor layer.",
    url: "https://github.com/qweliant/ankaa",
    stack: [SiElixir, SiPhoenixframework, SiPostgresql, SiRust, SiMqtt],
  },
  {
    title: "Fine Shyt",
    description:
      "Photo-curation AI that learns your eye: each shot gets a CLIP embedding and a Ridge-regression probe trained on your star ratings, so the match score drifts toward what you actually like. Real-time gallery over a TB of RAWs.",
    url: "https://github.com/qweliant/fineshyt",
    live: "https://qweliant.github.io/fineshyt/",
    stack: [SiElixir, SiPhoenixframework, SiPostgresql, FaPython],
  },
  {
    title: "Luminosity",
    description:
      "Local-first reflective journal that traces friction back to unmet needs, value conflicts, and behavior patterns. No accounts, no telemetry — localStorage is the source of truth, with an optional Bun + SQLite backup sidecar.",
    url: "https://github.com/qweliant/luminosity",
    live: "https://luminosityledger.netlify.app/",
    stack: [SiTypescript, SiBun, SiSqlite],
  },
  {
    title: "prosemirror-pretext",
    description:
      "A canvas-based text editor: ProseMirror's document model + Pretext's pure-arithmetic layout, every glyph drawn with ctx.fillText — no contenteditable. Caret and coordinate reads stay flat where DOM editors pay a reflow tax.",
    url: "https://github.com/qweliant/prosemirror-pretext",
    stack: [SiTypescript],
  },
  {
    title: "libraw",
    description:
      "Elixir library for native camera RAW decoding on the BEAM — a Rustler (Rust) NIF wrapping libraw. The decode layer under the photo pipeline.",
    url: "https://github.com/qweliant/libraw",
    stack: [SiElixir, SiRust],
  },
  {
    title: "memento_mori",
    description:
      "A digital time capsule: leave messages for the people you love, unlocked exactly when the time is right.",
    url: "https://github.com/qweliant/memento_mori",
    stack: [SiElixir, SiPhoenixframework],
  },
];

const currently = [
  {
    label: "on my desk",
    title: "History as a System",
    by: "José Ortega y Gasset",
    note: "revisiting for a part three someday",
  },
  {
    label: "on loop",
    title: "HxH we are so back",
    by: "Yoshihiro Togashi",
    note: "`You should enjoy the little detours to the fullest. Because that's where you'll find the things more important than what you want.`",
  },
  {
    label: "on my mind",
    title: "the web as a garden versus a marketplace",
    by: "Engelbart / Bush / Nelson",
    note: "augmenting intelligence vs selling boxes",
  },
];

const seedlings = [
  {
    icon: "🌻",
    title: "Digital IP, Crypto, and the Human Factor",
    note: "ownership, privacy, and governance beyond ideological extremes. i'm four drafts deep though so pray for me",
  },
  {
    icon: "🌱",
    title: "SATIRE: The Black Tubi Pipeline",
    note: "when is satire satire? signifyin', Quan Millz, and black media archetypes",
  },
  {
    icon: "🌱",
    title: "The Commoditization of Health Data",
    note: "23andMe went bankrupt making your genome a liquid asset…",
  },
];

const linkRoll = [
  {
    title: "dougengelbart.org",
    url: "https://www.dougengelbart.org/content/view/138",
    note: "augmenting human intelligence, 1962",
  },
  {
    title: "as we may think by vannevar bush",
    url: "https://www.theatlantic.com/magazine/archive/1945/07/as-we-may-think/303881/",
    note: "the memex, seventy years early",
  },
  {
    title: "mimms museum of technology and art",
    url: "https://mimmsmuseum.org/donate/",
    note: "donate. atlanta needs this to survive",
  },
  {
    title: "internet archive",
    url: "https://archive.org/",
    note: "voyager-for-the-unknown energy",
  },
  {
    title: "heptabase",
    url: "https://medium.com/heptabase/my-vision-the-context-c73e29981685",
    note: "alan chan on the philosophy behind the tools",
  },
  {
    title: "you may already be a sinner",
    url: "https://www.lesswrong.com/posts/Cq45AuedYnzekp3LX/you-may-already-be-a-sinner",
    note: "tversky's hidden-variable blind spot",
  },
  {
    title: "the c10k problem",
    url: "https://www.kegel.com/c10k.html",
    note: "still the reference for concurrency",
  },
  {
    title: "tilde.town / the friendly web",
    url: "https://tilde.town/",
    note: "proof the old internet is not dead",
  },
];

const shrine = [
  {
    icon: "⚓",
    title: "Eiichiro Oda",
    line: '"as long as people hunger for freedom, these things will exist."',
  },
  {
    icon: "✿",
    title: "Mishima and The Golden Pavilion",
    line: "can acts of destruction be virtuous? what shines, burns.",
  },
  {
    icon: "✵",
    title: "Carl Jung",
    line: "the undiscovered self. individuation against the mass!",
  },
  {
    icon: "♡",
    title: "hi mom",
    line: "i made passive alerts for dialysis. safehemo is for people like you.",
  },
  { icon: "☄︎", title: "Rocket League", line: "cars with rockets!" },
  {
    icon: "⚘",
    title: "hibiscus + lavender",
    line: "angiosperms be real floral with it",
  },
];

const updates = [
  { d: "07.27.26", t: "packed the whole broadcast into one dense grid" },
  { d: "07.25.26", t: "merged the garden into the home broadcast" },
  { d: "07.24.26", t: 'ported "I Over Engineered a Journal" tana → mdx' },
  { d: "07.04.26", t: "fresh fotos roll + canvas essay" },
  { d: "02.20.25", t: "site established. hello world ✦" },
];

const marqueeItems = [
  "broadcasting on optimal frequencies",
  "now watering",
  "one piece theories",
  "mimetic desire",
  "carl jung's shadow",
  "the beam & the actor model",
  "irrigation cities",
  "hand-embroidered css",
  "what shines, burns. so watch out",
  "the black tubi pipeline",
  "clip embeddings & vibes",
  "support the weird web",
];

const endorse = [
  { src: "/buttons/stamps/mag-daisy.png", url: "https://www.are.na/", label: "are.na — a visual commonplace book" },
  { src: "/buttons/stamps/mag-rose.png", url: "https://100r.co/", label: "hundred rabbits — off-grid tools & life" },
  { src: "/buttons/stamps/eyes.gif", url: "https://wiby.me/", label: "wiby — search the indie web" },
  { src: "/buttons/stamps/3.gif", url: "https://ferd.ca/", label: "ferd.ca — erlang/elixir essays" },
  { src: "/buttons/stamps/pantone_peach_by_king_lulu_deer-dc6iyjl.png", url: "https://sadgrl.online/", label: "sadgrl — webcore & old-web resources" },
  { src: "/buttons/stamps/furby_stamp_1_by_beepudding-dbfy82u.png", url: "https://neal.fun/", label: "neal.fun — playful web toys" },
];

const anime = ["Bleach", "Akira", "Ghost Stories", "s-CRY-ed", "Anohana", "Neon Genesis Evangelion", "Frieren", "Serial Experiments Lain", "The Big O", "Angel's Egg"];
const manga = ["Shamo", "Homunculus", "Hunter × Hunter", "One Piece", "Air Gear", "Boy's Abyss", "Dorohedoro"];
const sanrio = ["Hello Kitty", "Kuromi", "Cinnamoroll", "Keroppi"];
const movies = ["Spirited Away", "The Color Purple", "The Face of Another", "Women on the Verge of a Nervous Breakdown", "Andrei Rublev", "anything Vincent Price"];
const snacks = ["truffle chips", "cornflake chocolate", "spinach dip", "Reese's", "M&Ms", "cookies", "ice cream"];
const plants = ["bee balm", "st john's wort", "thai hibiscus", "seneca sunflowers", "magnolia grandiflora"];

/**
 * A "stuff i like" panel. Each category carries its own accent from the site
 * palette, threaded to the chips as --accent so the six boxes read as six
 * distinct collections instead of six identical grey lists.
 */
function FaveWin({
  emblem,
  name,
  accent,
  items,
}: {
  emblem: string;
  name: string;
  accent: string;
  items: string[];
}) {
  return (
    <Win
      title={
        <>
          <span
            className="fave-emblem"
            style={{ "--accent": accent } as CSSProperties}
            aria-hidden
          >
            {emblem}
          </span>
          <span className="fave-name">{name}</span>
          <span className="fave-count">{items.length}</span>
        </>
      }
    >
      <div
        className="lb-cliques fave-cliques"
        style={{ "--accent": accent } as CSSProperties}
      >
        {items.map((it) => (
          <span key={it} className="clq">
            {it}
          </span>
        ))}
      </div>
    </Win>
  );
}

export default async function Home() {
  const posts = await getAllPosts();
  const blinkies = listPublicAssets("buttons/blinkies");
  const stamps = listPublicAssets("buttons/stamps");
  // stamps used in the "i endorse" box (left rail) shouldn't repeat in the wall
  const wallStamps = stamps.filter((s) => !endorse.some((e) => e.src === s));

  return (
    <div className="max-w-[1180px] mx-auto px-3.5 pb-10">
      {/* ── top strip ── */}
      <div className="blinky-strip pt-4 pb-2.5">
        {blinkies.length ? (
          blinkies.map((src) => <img key={src} src={src} alt="" />)
        ) : (
          <>
            <span className="blinky">★ made with ♥ not AI ★</span>
            <span className="blinky b2">best viewed with a snack</span>
            <span className="blinky b3">hibiscus-adjacent</span>
            <span className="blinky b4">the weird web lives</span>
            <span className="blinky">eternal construction</span>
          </>
        )}
      </div>

      <div className="text-center pt-1.5 pb-0.5">
        <p className="lb-lab tracking-[0.34em]">░░░ optimal frequencies ░░░</p>
        <h1 className="font-fredoka font-bold text-[clamp(2.4rem,6vw,4rem)] leading-none my-1 text-[var(--deep-pink)]">
          hi, i&apos;m broadcasting{" "}
          <span className="home-blink text-[var(--deep-pink)]">★</span>
        </h1>
        <p className="italic text-[var(--muted-text)] m-0">
          you can&apos;t tell if it&apos;s a good idea or a rant.
        </p>
        <p className="text-xs font-mono text-[var(--muted-text)] tracking-widest mt-2">
          [{" "}
          <Link
            href="/posts"
            className="text-[var(--sakura)] underline decoration-dotted"
          >
            essays
          </Link>{" "}
          ·{" "}
          <Link
            href="#garden"
            className="text-[var(--sakura)] underline decoration-dotted"
          >
            garden
          </Link>{" "}
          ·{" "}
          <Link
            href="/fotos"
            className="text-[var(--sakura)] underline decoration-dotted"
          >
            fotos
          </Link>{" "}
          ]
        </p>
      </div>

      <div className="my-4">
        <Marquee items={marqueeItems} />
      </div>

      {/* ── content-centered: wide main column + furniture rails ── */}
      <div className="lb-columns">
        {/* MAIN CONTENT (center, wide) — source-first so it leads on mobile */}
        <div className="lb-col lb-main">
          <Win title={<>✦ welcome.html</>}>
            <p className="m-0 text-[var(--foreground)]">
              well met friends, this is{" "}
              <b className="text-[var(--sakura)]">optimal frequencies</b>. i am
              thankful for your presence. i like coding, anime, and plants. this
              site is a place to put the thoughts about things. feel free to
              poke around ♥
            </p>
          </Win>

          <Win
            title={<>✉ latest transmissions</>}
            bodyClassName="win-body win-scroll"
          >
            <ul className="grid gap-2 list-none m-0 p-0">
              {posts.map((post, i) => (
                <li
                  key={post.slug}
                  className="border border-dashed border-[color:var(--rule)] rounded-md p-3 bg-[var(--slot-bg)]"
                >
                  <Link href={`/posts/${post.slug}`} className="block">
                    <h3 className="win-h text-sm text-[var(--sakura)] leading-snug">
                      {i === 0 && (
                        <span className="home-blink text-[var(--deep-pink)] mr-2 text-xs align-middle font-mono">
                          ★NEW
                        </span>
                      )}
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-[0.68rem] text-[var(--bluebell)] italic mt-0.5">
                    {post.date
                      ? new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          </Win>

          <Win id="garden" title={<>✦ currently</>}>
            <ul className="lb-cur">
              {currently.map((c) => (
                <li key={c.label}>
                  <span className="k">{c.label}</span>
                  <span className="t">{c.title}</span>
                  <span className="by">{c.by}</span>
                  <span className="n">{c.note}</span>
                </li>
              ))}
            </ul>
          </Win>

          <FaveWin emblem="◐" name="anime" accent="var(--bluebell)" items={anime} />

          <FaveWin emblem="▤" name="manga" accent="var(--lavender)" items={manga} />

          <FaveWin emblem="▷" name="movies" accent="var(--deep-pink)" items={movies} />

          <Win title={<>⌱ seedlings</>}>
            <p className="win-note">
              not essays, yet they are things i keep turning
              over.
            </p>
            <ul className="lb-seed">
              {seedlings.map((s) => (
                <li key={s.title}>
                  <span className="ic">{s.icon}</span>
                  <div>
                    <div className="t">{s.title}</div>
                    <div className="n">{s.note}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Win>

          <Win title={<>⌘ link roll</>} bodyClassName="win-body win-scroll">
            <p className="win-note">
              places that informed the way i think. click around, donate where
              you can.
            </p>
            <ul className="lb-roll">
              {linkRoll.map((link) => (
                <li key={link.url}>
                  <span className="ar">→</span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.title}
                  </a>
                  <span className="n">— {link.note}</span>
                </li>
              ))}
            </ul>
          </Win>

          <Win title={<>✿ the shrine</>} bodyClassName="win-body win-scroll">
            <p className="win-note">
              people, works, and living things that have earned permanent rent
              in my head.
            </p>
            <ul className="lb-shrine">
              {shrine.map((s) => (
                <li key={s.title}>
                  <div className="ic">{s.icon}</div>
                  <div className="t">{s.title}</div>
                  <div className="l">{s.line}</div>
                </li>
              ))}
            </ul>
          </Win>
        </div>

        {/* left rail — identity + projects box */}
        <div className="lb-col lb-rail-l">
          <Win title={<>✎ about.txt</>}>
            <p className="text-sm m-0 text-[var(--foreground)]">
              engineer, gardener, one piece truther. i build local-first tools,
              grow hibiscus, and write essays you can&apos;t quite categorize.
            </p>
            <p className="win-note mt-2 mb-0">
              <Link href="/about">→ more about me</Link>
            </p>
          </Win>

          <Win title={<>◆ projects</>} bodyClassName="win-body win-scroll">
            <ul className="lb-projlist">
              {projects.map((project) => (
                <li key={project.title}>
                  <div className="top">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="name"
                    >
                      {project.title}
                    </a>
                    <span className="links">
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ↗ live
                        </a>
                      )}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaGithub className="inline align-[-1px]" /> code
                      </a>
                    </span>
                  </div>
                  <p className="desc">{project.description}</p>
                  <div className="stack">
                    {project.stack.map((Icon, i) => (
                      <Icon key={i} title={Icon.name} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Win>

          <Win title={<>✦ i endorse</>}>
            <p className="lb-lab mb-2">stamps → places worth your time</p>
            <div className="lb-stampwall">
              {endorse.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                >
                  <img src={s.src} alt={s.label} />
                </a>
              ))}
            </div>
            <p className="win-note mt-2 mb-0">hover to see where they go ♥</p>
          </Win>

          <FaveWin emblem="♡" name="sanrio" accent="var(--sakura)" items={sanrio} />

          <FaveWin emblem="❀" name="plants" accent="var(--mint)" items={plants} />
        </div>

        {/* right rail — old-web furniture */}
        <div className="lb-col lb-rail-r">
          <Win title={<>✉ subscribe</>}>
            <Newsletter />
          </Win>

          <FaveWin emblem="◍" name="snacks" accent="var(--peach)" items={snacks} />

          <Win title={<>✎ updates</>}>
            <ul className="lb-log">
              {updates.map((u) => (
                <li key={u.d}>
                  <time>{u.d}</time>
                  <span>{u.t}</span>
                </li>
              ))}
            </ul>
          </Win>

          <Win title={<>✧ stamps</>} bodyClassName="win-body">
            <div className="lb-stampwall">
              {wallStamps.map((src) => (
                <img key={src} src={src} alt="" />
              ))}
            </div>
          </Win>

          <Win title={<>✧ counter</>}>
            <VisitorCounter />
          </Win>

          <Win title={<>♡ guestbook</>}>
            <div className="text-center text-sm">
              <p className="win-h text-base mb-1">send a flower or a rant</p>
              <p className="m-0">
                <a href="mailto:qwelian@tutanota.com?subject=guestbook">
                  qwelian@tutanota.com
                </a>
              </p>
              <p className="win-note mt-1.5 mb-0">
                (don&apos;t be wierd about it. unless i know you.)
              </p>
            </div>
          </Win>
        </div>
      </div>

      <div className="text-center mt-8 font-mono text-xs text-[var(--muted-text)] tracking-widest space-y-1">
        <p className="lb-constr m-0">▓▒░ under eternal construction ░▒▓</p>
        <p className="m-0">thank you for tuning in ♡</p>
      </div>
    </div>
  );
}
