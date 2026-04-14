import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Garden — Optimal Frequencies",
  description: "sidequest zone. things that live rent-free.",
};

const currently = [
  {
    label: "on the desk",
    title: "The Undiscovered Self",
    by: "Carl Jung",
    note: "revisiting for a part three someday",
  },
  {
    label: "on loop",
    title: "Frieren: Beyond Journey's End",
    by: "Kanehito Yamada",
    note: "grief at the pace of an elf — i could live in this show",
  },
  {
    label: "on my mind",
    title: "what the web should have been",
    by: "Engelbart / Bush / Nelson",
    note: "augmenting intelligence, not selling boxes",
  },
];

const linkRoll = [
  {
    title: "dougengelbart.org",
    url: "https://www.dougengelbart.org/content/view/138",
    note: "augmenting human intelligence, 1962",
  },
  {
    title: "as we may think — vannevar bush",
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
    title: "heptabase — my vision, the context",
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
    title: "kegel / tilde.town / the friendly web",
    url: "https://tilde.town/",
    note: "proof the old internet is not dead",
  },
];

const shrine = [
  {
    icon: "⚓",
    title: "Eiichiro Oda",
    line: "\"as long as people hunger for freedom, these things will exist.\"",
  },
  {
    icon: "✿",
    title: "Mishima — Temple of the Golden Pavilion",
    line: "can acts of destruction be virtuous? what shines, burns.",
  },
  {
    icon: "✵",
    title: "Carl Jung",
    line: "the undiscovered self — individuation against the mass",
  },
  {
    icon: "♡",
    title: "for mom",
    line: "the silent alarm. safehemo is for you.",
  },
  {
    icon: "☄︎",
    title: "Rocket League",
    line: "cars with wings. i don't need a better reason.",
  },
  {
    icon: "⚘",
    title: "hibiscus + lavender",
    line: "angiosperms keeping the abyss at bay",
  },
];

const marqueeItems = [
  "now watering",
  "one piece theories",
  "mimetic desire",
  "carl jung's shadow",
  "the beam & the actor model",
  "irrigation cities",
  "what shines, burns",
  "hand-embroidered css",
];

function Marquee({ items }: { items: string[] }) {
  const track = items.map((t) => `✦ ${t} `).join(" ");
  return (
    <div className="garden-marquee">
      <div className="garden-marquee-track">
        <span>{track} &nbsp;</span>
        <span aria-hidden>{track} &nbsp;</span>
      </div>
    </div>
  );
}

export default function GardenPage() {
  return (
    <div className="garden-root min-h-screen">
      <section className="max-w-4xl mx-auto px-6 pt-10 pb-6">
        <div className="text-center space-y-2">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#C9A8FF]/70">
            ░░░ welcome to the garden ░░░
          </p>
          <h1 className="font-fredoka text-5xl text-[#FF4D94] drop-shadow-[0_0_20px_rgba(255,77,148,0.45)]">
            the ~sidequest~ zone
          </h1>
          <p className="italic text-[#C9A8FF]">
            not everything needs to be an essay. some things are just little
            flags i&apos;m waving.
          </p>
        </div>
      </section>

      <Marquee items={marqueeItems} />

      <section className="max-w-3xl mx-auto px-6 py-12 grid gap-10">
        <article className="garden-panel">
          <header className="garden-panel-header">✦ currently</header>
          <ul className="p-6 grid sm:grid-cols-3 gap-5">
            {currently.map((c) => (
              <li key={c.label} className="space-y-1">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#C9A8FF]/70">
                  {c.label}
                </p>
                <p className="font-fredoka text-[#FF85B3] leading-snug">
                  {c.title}
                </p>
                <p className="text-xs text-[#C9A8FF]">{c.by}</p>
                <p className="text-xs italic text-[#C9A8FF]/70">{c.note}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="garden-panel">
          <header className="garden-panel-header">⌘ link roll</header>
          <p className="px-6 pt-4 text-xs italic text-[#C9A8FF]/70">
            places that informed the way i think — click around, donate where
            you can, support the weird web.
          </p>
          <ul className="p-6 space-y-3">
            {linkRoll.map((link) => (
              <li
                key={link.url}
                className="flex flex-wrap items-baseline gap-x-3"
              >
                <span className="text-[#C9A8FF]/50 font-mono text-xs">→</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-fredoka text-[#FF85B3] hover:text-[#C9A8FF] underline decoration-dotted underline-offset-4"
                >
                  {link.title}
                </a>
                <span className="text-xs text-[#C9A8FF]/70 italic">
                  — {link.note}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="garden-panel">
          <header className="garden-panel-header">✿ the shrine</header>
          <p className="px-6 pt-4 text-xs italic text-[#C9A8FF]/70">
            people, works, and living things that have earned permanent rent
            in my head.
          </p>
          <ul className="p-6 grid sm:grid-cols-2 gap-4">
            {shrine.map((s) => (
              <li
                key={s.title}
                className="border border-dashed border-[#FF85B3]/40 rounded-md p-4 bg-[#FF85B3]/[0.03]"
              >
                <p className="text-2xl leading-none">{s.icon}</p>
                <p className="font-fredoka text-[#FF85B3] mt-2">{s.title}</p>
                <p className="text-xs text-[#C9A8FF]/80 italic mt-1 leading-relaxed">
                  {s.line}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <div className="text-center pt-4 space-y-2">
          <p className="font-mono text-xs text-[#C9A8FF]/60">
            ▓▒░ under eternal construction ░▒▓
          </p>
          <p className="text-xs text-[#C9A8FF]/60">
            send me a flower or a rant →{" "}
            <a
              href="mailto:qwelian@tutanota.com?subject=garden%20guestbook"
              className="text-[#FF85B3] underline decoration-dotted underline-offset-4"
            >
              qwelian@tutanota.com
            </a>
            {" "}
            <span className="italic">(don&apos;t be wierd about it. unless i know you.)</span>
          </p>
        </div>
      </section>
    </div>
  );
}
