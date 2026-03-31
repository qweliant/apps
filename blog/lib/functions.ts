import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import fs from "fs";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { cache } from "react";

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeDocument)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

export const getAllPosts = cache(async function getAllPosts() {
  const postsDir = path.join(process.cwd(), "content");
  const filenames = fs
    .readdirSync(postsDir)
    .filter((name) => name.endsWith(".mdx"));

  const posts = await Promise.all(
    filenames.map(async (name) => {
      const slug = name.replace(/\.mdx$/, "");
      const filePath = path.join(postsDir, name);
      const fileContent = fs.readFileSync(filePath, "utf8");

      const frontmatterEnd = fileContent.indexOf("---", 3);
      const rawContent =
        frontmatterEnd !== -1
          ? fileContent.slice(frontmatterEnd + 3).trim()
          : fileContent;

      const { frontmatter, content } = await compileMDX<{
        title: string;
        date: string;
      }>({
        source: fileContent,
        options: { parseFrontmatter: true },
      });

      return {
        slug,
        rawContent,
        title: frontmatter?.title || slug.replace(/-/g, " "),
        date: frontmatter?.date ?? "",
        mdxContent: content,
      };
    })
  );

  return posts
    .filter((post) => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});
