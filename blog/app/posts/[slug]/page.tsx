import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import type { Metadata } from "next";

const rehypePrettyCodeOptions = {
  theme: "catppuccin-mocha",
  keepBackground: true,
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
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
        },
      },
    });
    return (
      <article className="prose lg:prose-xl mx-auto px-4 min-h-[calc(100vh-200px)] overflow-hidden">
        <div className="space-y-6">
          <article className="border-l-4 pl-4">{content}</article>
        </div>
      </article>
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
