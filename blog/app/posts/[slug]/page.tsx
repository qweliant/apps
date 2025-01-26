import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";

type PostParams = Promise<{ slug: string }>;

export default async function Page({ params }: { params: PostParams }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { content } = await compileMDX<{ date: string }>({
      source: fileContent,
      options: { parseFrontmatter: true },
    });
    return (
      <article className="prose mx-auto px-4 sm:prose-lg lg:prose-xl">
        <div className="space-y-6">
          <article className="border-l-4 pl-4 transition-all transform hover:scale-105 sm:hover:scale-105 sm:border-l-4">
            {content}
          </article>
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
