import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import type { Metadata } from "next";

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
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
        },
      },
    });
    return (
      <article className="post-prose prose lg:prose-lg mx-auto px-6 py-12 max-w-2xl min-h-[calc(100vh-200px)]">
        {content}
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
