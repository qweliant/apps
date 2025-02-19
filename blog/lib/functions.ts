import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import fs from "fs";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export async function getAllPosts() {
  const postsDir = path.join(process.cwd(), "content");
  const filenames = fs
    .readdirSync(postsDir)
    .filter((name) => name.endsWith(".mdx")); // Only include .mdx files

  // Helper to format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Read and compile all posts
  const posts = await Promise.all(
    filenames.map(async (name) => {
      const slug = name.replace(/\.mdx$/, ""); // Remove the .mdx extension
      const filePath = path.join(postsDir, name); // Construct the file path
      const fileContent = fs.readFileSync(filePath, "utf8"); // Read the file content

      const lines = fileContent.split("\n");
      const contentWithoutFirst20Lines = lines.slice(22).join("\n");

      const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeDocument)
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(contentWithoutFirst20Lines);

      const { frontmatter, content } = await compileMDX<{
        title: string;
        date: string;
      }>({
        source: fileContent,
        options: { parseFrontmatter: true }, // Parse frontmatter for metadata
      });

      return {
        slug,
        content: String(file),
        title: frontmatter?.title || slug.replace(/-/g, " "),
        date: frontmatter?.date ? formatDate(frontmatter.date) : "Unknown Date",
        mdxContent: content,
      };
    })
  );
  return posts
    .filter((post) => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
