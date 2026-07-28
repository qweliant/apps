import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import type { Metadata } from "next";
import Link from "next/link";
import PretextEditor from "@/app/components/PretextEditor";
import LatencyBench from "@/app/components/LatencyBench";
import Win from "@/app/components/Win";

// Components available to every post's MDX.
const mdxComponents = { PretextEditor, LatencyBench };

const rehypePrettyCodeOptions = {
  theme: { light: "catppuccin-latte", dark: "catppuccin-mocha" },
  keepBackground: false,
  defaultLang: "plaintext",
};

type PostParams = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "content");
  return fs
    .readdirSync(postsDir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => ({ slug: name.replace(/\.mdx$/, "") }));
}

export async function generateMetadata({
  params,
}: {
  params: PostParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { frontmatter } = await compileMDX<{ title: string; date: string }>({
      source: fileContent,
      options: { parseFrontmatter: true },
    });
    return { title: frontmatter?.title ?? slug };
  } catch {
    return { title: slug };
  }
}

export default async function Page({ params }: { params: PostParams }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { content } = await compileMDX<{ date: string }>({
      source: fileContent,
      components: mdxComponents,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
        },
      },
    });
    return (
      <div className="max-w-2xl mx-auto px-3.5 py-10 min-h-[calc(100vh-200px)]">
        <Win title={<>✦ {slug}.mdx</>}>
          <article className="post-prose prose lg:prose-lg max-w-none">
            {content}
          </article>
          <p
            className="win-note mt-8 pt-4 mb-0"
            style={{ borderTop: "1px dashed var(--rule)" }}
          >
            © {new Date().getFullYear()} Qwelian Tanner · Licensed{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 4.0
            </a>{" "}
            — share &amp; adapt with credit.
          </p>
        </Win>
        <p className="text-center mt-6 font-mono text-xs text-[var(--muted-text)] tracking-widest">
          <Link href="/posts">← archive</Link> · <Link href="/">home</Link>
        </p>
      </div>
    );
  } catch (error) {
    return (
      <div className="text-red-500">
        <p>Error loading the post. Please try again later.</p>
        <>Error: {String(error)}</>
      </div>
    );
  }
}
