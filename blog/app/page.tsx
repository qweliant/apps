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
      "VS code extension that tells you when you are ina server component or client component",
    url: "https://github.com/qweliant/where-am-i-next",
    stack: [SiTypescript],
  },
];


export default async function Home() {
  const posts = await getAllPosts();
  return (
    <div className="min-h-screen flex flex-col items-center p-8 font-[var(--font-geist-sans)]">
      <main className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to My Blog
        </h1>
        <p className="text-center mb-12">
          You can&apos;t tell if it&apos;s a good idea or a rant.
        </p>
      <div className="mb-16">
        <h2 className="text-3xl font-bold mt-20 mb-8">Portfolio</h2>
        <ul className="grid gap-8">
          {projects.map((project) => (
            <li
              key={project.title}
              className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold">
                  {project.title}
                </h3>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm hover:underline"
                >
                  <FaGithub className="text-base" />
                  GitHub
                </a>
              </div>
              <p className="text-sm text-gray-600 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-3 text-xl text-gray-700">
                {project.stack.map((Icon, index) => (
                  <Icon key={index} title={Icon.name} className="hover:text-blue-500 transition-colors" />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
        <div>
          <h2 className="text-2xl font-semibold mb-6">Posts</h2>
          <ul className="grid gap-6">
            {posts.map((post) => (
              <li key={post.slug} className=" shadow-md border rounded-lg p-6">
                <Link
                  href={`/posts/${post.slug}`}
                  className="block hover:underline"
                >
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                </Link>
                <p className="text-sm  italic">{post.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
