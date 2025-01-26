import Link from "next/link";
import path from "path";
import fs from "fs";

import { compileMDX } from "next-mdx-remote/rsc";

export default async function Home() {
  async function getSortedPosts() {
    const contentDir = path.join(process.cwd(), "content");
    const filenames = fs
      .readdirSync(contentDir)
      .filter((filename) => filename.endsWith(".mdx"));

    // Format title utility
    const formatTitle = (slug: string) => {
      return slug
        .replace(/\.mdx$/, "") // Remove .mdx extension
        .replace(/_/g, " ") // Replace underscores with spaces
        .split(" ")
        .map((word) =>
          word.length <= 3 && !word.match(/^[0-9]/)
            ? word
            : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
    };

    // Extract frontmatter and create posts array
    const posts = await Promise.all(
      filenames.map(async (name) => {
        const filePath = path.join(contentDir, name);
        const fileContent = fs.readFileSync(filePath, "utf8");

        try {
          const { frontmatter } = await compileMDX<{ date: string }>({
            source: fileContent,
            options: { parseFrontmatter: true },
          });

          return {
            slug: name.replace(/\.mdx$/, ""),
            title: formatTitle(name),
            date: new Date(frontmatter.date),
          };
        } catch (error) {
          console.error(`Error processing file ${name}:`, error);
          return null; // Skip the problematic file
        }
      })
    );

    // Sort posts by date (newest first)
    return posts
      .filter((post) => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  const posts = await getSortedPosts();
  return (
    <div className="min-h-screen flex flex-col items-center p-8 font-[var(--font-geist-sans)]">
      <main className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to My Blog
        </h1>
        <p className="text-center mb-12">
          Exploring ideas, sharing knowledge, and documenting experiences
          through technology and design.
        </p>
        <h2 className="text-2xl font-semibold mb-6">Blog Posts</h2>
        <ul className="grid gap-6">
          {posts.map((post) => (
            <li key={post.slug} className=" shadow-md border rounded-lg p-6">
              <Link
                href={`/posts/${post.slug}`}
                className="block hover:underline"
              >
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
              </Link>
              <p className="text-sm ">
                Posted on: {post.date.toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
