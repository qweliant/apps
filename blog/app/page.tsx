import Link from "next/link";
import path from "path";
import fs from "fs";

export default function Home() {
  const postsDir = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(postsDir);

  const formatTitle = (slug) => {
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

  const posts = filenames.map((name) => ({
    slug: name.replace(/\.mdx$/, ""),
    title: formatTitle(name),
    date: new Date().toLocaleDateString(), // Mock date, replace with actual data if available
  }));

  return (
    <div className="min-h-screen flex flex-col items-center p-8 font-[var(--font-geist-sans)] bg-gray-50">
      <main className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to My Blog
        </h1>
        <p className="text-center text-gray-700 mb-12">
          Exploring ideas, sharing knowledge, and documenting experiences
          through technology and design.
        </p>
        <h2 className="text-2xl font-semibold mb-6">Blog Posts</h2>
        <ul className="grid gap-6">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="bg-white shadow-md border rounded-lg p-6"
            >
              <Link
                href={`/posts/${post.slug}`}
                className="block hover:underline"
              >
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
              </Link>
              <p className="text-sm text-gray-500">Posted on: {post.date}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
