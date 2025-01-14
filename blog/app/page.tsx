import Link from "next/link";
import path from "path";
import fs from "fs";

export default function Home() {
  const postsDir = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(postsDir);

  const posts = filenames.map((name: string) => ({
    slug: name.replace(/\.mdx$/, ""),
    title: name.replace(/\.mdx$/, "").replace(/-/g, " "), // Simplistic title
  }));

  return (
    <div className="min-h-screen flex flex-col p-8 sm:p-20 font-[var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <div className="flex space-x-6"></div>
        <h1 className="text-4xl font-bold mt-8">Welcome to My Website</h1>
        <h1>Blog Posts</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </main>
      <div className="flex items-center justify-center">
        <footer className="mt-12 text-center text-gray-500 text-sm ">
          <p>© {new Date().getFullYear()} My Website. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
