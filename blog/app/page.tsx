import Link from "next/link";
import path from "path";
import fs from "fs";

export default function Home() {
  const postsDir = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(postsDir);

  const formatTitle = (slug: string) => {
    return slug
      .replace(/\.mdx$/, "") // Remove .mdx extension
      .replace(/_/g, " ") // Replace underscores with spaces
      .split(" ")
      .map((word) =>
        // Don't capitalize certain words unless they're at the start
        word.length <= 3 && !word.match(/^[0-9]/)
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  const posts = filenames.map((name: string) => ({
    slug: name.replace(/\.mdx$/, ""),
    title: formatTitle(name),
  }));

  return (
    <div className="min-h-screen flex flex-col p-8 sm:p-20 font-[var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <div className="flex space-x-6"></div>
        <h1 className="text-4xl font-bold mt-8">Welcome to My Website</h1>
        <div>
          <p>
            I believe technology has the potential to level barriers of access
            to information and provide transparency for complex collaboration
            that can shift our zero-sum thinking to one of collective
            stewardship.
          </p>
        </div>
        <h1>Blog Posts</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
