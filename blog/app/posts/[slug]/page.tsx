import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";

type PostParams = Promise<{ slug: string }>;

export default async function Page({ params }: { params: PostParams }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content } = await compileMDX<{ date: string }>({
    source: fileContent,
    options: { parseFrontmatter: true },
  });

  return (
    <article className="prose lg:prose-xl mx-auto px-4">{content}</article>
  );
}
