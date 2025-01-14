import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(postsDir);
  return filenames.map((name) => ({ slug: name.replace(/\.mdx$/, "") }));
}

type PostParams = Promise<{ slug: string }>;

export default async function Page({ params }: { params: PostParams }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content, frontmatter } = await compileMDX<{ date: string }>({
    source: fileContent,
    options: { parseFrontmatter: true },
  });

  return (
    <article className="prose lg:prose-xl mx-auto px-4">
      <h1>{frontmatter.date}</h1>
      {content}
    </article>
  );
}
