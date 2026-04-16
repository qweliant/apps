import Link from "next/link";
import { FaGithub, FaPython } from "react-icons/fa";
import {
  SiElixir,
  SiPhoenixframework,
  SiRust,
  SiTypescript,
  SiPostgresql,
  SiMqtt,
} from "react-icons/si";
import { getAllPosts } from "@/lib/functions";

const projects = [
  {
    title: "Ankaa",
    description:
      "Real-time monitoring system for home dialysis and blood pressure devices using Phoenix LiveView.",
    url: "https://github.com/qweliant/ankaa",
    stack: [SiElixir, SiPhoenixframework, SiPostgresql, SiRust, SiMqtt],
  },
  {
    title: "Fine Shyt",
    description:
      "Photo curation AI that learns your aesthetic taste — rates, clusters, and filters a photo archive using CLIP embeddings and a trained preference model.",
    url: "https://github.com/qweliant/fineshyt",
    stack: [SiElixir, SiPhoenixframework, SiPostgresql, FaPython],
  },
  {
    title: "prosemirror-pretext",
    description:
      "Canvas-based text editor combining ProseMirror's document model with Pretext's layout engine — no contenteditable, every glyph rendered via fillText.",
    url: "https://github.com/qweliant/prosemirror-pretext",
    stack: [SiTypescript],
  },
  {
    title: "Where Am I Next?",
    description:
      "VS Code extension that tells you when you are in a server component or client component.",
    url: "https://github.com/qweliant/where-am-i-next",
    stack: [SiTypescript],
  },
];


export default async function Home() {
  const posts = await getAllPosts();
  return (
    <div className="min-h-screen flex flex-col items-center p-8 font-nunito">
      <main className="max-w-3xl w-full">
        <div className="home-banner">
          ░ est. whenever ░ hand-rolled & hibiscus-adjacent ░ best viewed with a snack ░
        </div>

        <pre className="home-ascii mb-4" aria-hidden>
{`      .     *     .       ✦        .      *
  *      ~  optimal frequencies  ~      .
      .        *    .      ✦       .     *`}
        </pre>

        <h1 className="text-4xl font-semibold text-center mb-2 font-fredoka">
          hi, i&apos;m broadcasting <span className="home-blink text-[#FF4D94]">★</span>
        </h1>
        <p className="text-center mb-2 text-[#C9A8FF]">
          You can&apos;t tell if it&apos;s a good idea or a rant.
        </p>
        <p className="text-center mb-12 text-xs font-mono text-[#C9A8FF]/60 tracking-widest">
          [{" "}
          <Link href="/posts" className="text-[#FF85B3] underline decoration-dotted">essays</Link> ·{" "}
          <Link href="/garden" className="text-[#FF85B3] underline decoration-dotted">garden</Link> ·{" "}
          <Link href="/fotos" className="text-[#FF85B3] underline decoration-dotted">fotos</Link> ]
        </p>
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mt-20 mb-8 font-fredoka">Portfolio</h2>
          <ul className="grid gap-6">
            {projects.map((project) => (
              <li
                key={project.title}
                className="border border-[#FF85B3]/30 rounded-3xl p-6 bg-[#FF85B3]/[0.04] hover:border-[#C9A8FF]/50 hover:bg-[#C9A8FF]/[0.05] hover:shadow-[0_4px_30px_rgba(255,133,179,0.12)] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold font-fredoka text-[#FF4D94]">
                    {project.title}
                  </h3>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[#C9A8FF] hover:text-[#FF85B3] transition-colors"
                  >
                    <FaGithub className="text-base" />
                    GitHub
                  </a>
                </div>
                <p className="text-sm text-[#C9A8FF]/80 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-3 text-xl text-[#C9A8FF]/60">
                  {project.stack.map((Icon, index) => (
                    <Icon key={index} title={Icon.name} className="hover:text-[#FF85B3] transition-colors" />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2 font-fredoka">Posts</h2>
          <p className="text-xs font-mono text-[#C9A8FF]/60 mb-6 tracking-wide">
            ~ in reverse chronological order, like memory ~
          </p>
          <ul className="grid gap-4">
            {posts.map((post, i) => (
              <li key={post.slug} className="border border-[#C9A8FF]/25 rounded-3xl p-6 bg-[#C9A8FF]/[0.03] hover:border-[#FF85B3]/40 hover:bg-[#FF85B3]/[0.04] hover:shadow-[0_4px_20px_rgba(201,168,255,0.1)] transition-all duration-300">
                <Link
                  href={`/posts/${post.slug}`}
                  className="block"
                >
                  <h3 className="text-lg font-semibold mb-1 font-fredoka text-[#FF85B3] hover:text-[#C9A8FF] transition-colors">
                    {i === 0 && (
                      <span className="home-blink text-[#FF4D94] mr-2 text-xs align-middle font-mono">★NEW</span>
                    )}
                    {post.title}
                  </h3>
                </Link>
                <p className="text-sm text-[#A8D8FF]/70 italic">
                  {post.date ? new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 text-center space-y-2">
          <pre className="home-ascii" aria-hidden>
{`  ────  ✦  ────  ✿  ────  ✦  ────`}
          </pre>
          <p className="text-xs font-mono text-[#C9A8FF]/60 tracking-widest">
            thank you for stopping by ♡ you are visitor №{" "}
            <span className="text-[#FF85B3]">
              {String(Math.floor(Math.random() * 900000) + 100000)}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
