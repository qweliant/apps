import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FaGolang } from "react-icons/fa6";
import {
  SiElixir,
  SiPhoenixframework,
  SiRust,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiReact,
  SiPostgresql,
  SiSqlite,
  SiMqtt,
  SiWails
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
    title: "Blog Engine",
    description:
      "Custom markdown-based blog platform with static rendering, built in Next.js.",
    url: "https://github.com/qweliant/apps/tree/main/blog",
    stack: [SiNextdotjs, SiTailwindcss, SiTypescript],
  },
  {
    title: "2B (Second Brain)",
    description:
      "Personal knowledge system and research scratchpad. Written in TypeScript and forked from liha to enable markdown saves to my blog.",
    url: "https://github.com/qweliant/2b",
    stack: [SiTypescript, SiReact, SiSqlite, FaGolang, SiWails],
  },
  {
    title: "Tapfunds",
    description:
      "Experimental platform for account info and democratic collective finance.",
    url: "https://github.com/tapfunds/tf",
    stack: [SiNextdotjs, SiTypescript, FaGolang, SiPostgresql],
  },
  {
    title: "Where Am I Next?",
    description:
      "VS code extension that tells you when you are in a server component or client component",
    url: "https://github.com/qweliant/where-am-i-next",
    stack: [SiTypescript],
  },
];


export default async function Home() {
  const posts = await getAllPosts();
  return (
    <div className="min-h-screen flex flex-col items-center p-8 font-nunito">
      <main className="max-w-3xl w-full">
        <h1 className="text-4xl font-semibold text-center mb-4 font-fredoka">
          Welcome to My Blog
        </h1>
        <p className="text-center mb-12 text-[#C9A8FF]">
          You can&apos;t tell if it&apos;s a good idea or a rant.
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
          <h2 className="text-2xl font-semibold mb-6 font-fredoka">Posts</h2>
          <ul className="grid gap-4">
            {posts.map((post) => (
              <li key={post.slug} className="border border-[#C9A8FF]/25 rounded-3xl p-6 bg-[#C9A8FF]/[0.03] hover:border-[#FF85B3]/40 hover:bg-[#FF85B3]/[0.04] hover:shadow-[0_4px_20px_rgba(201,168,255,0.1)] transition-all duration-300">
                <Link
                  href={`/posts/${post.slug}`}
                  className="block"
                >
                  <h3 className="text-lg font-semibold mb-1 font-fredoka text-[#FF85B3] hover:text-[#C9A8FF] transition-colors">{post.title}</h3>
                </Link>
                <p className="text-sm text-[#A8D8FF]/70 italic">{post.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
