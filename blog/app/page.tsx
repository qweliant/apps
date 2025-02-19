import Link from "next/link";

import { getSortedPosts } from "@/lib/functions";

export default async function Home() {
  const posts = await getSortedPosts();
  return (
    <div className="min-h-screen flex flex-col items-center p-8 font-[var(--font-geist-sans)]">
      <main className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to My Blog
        </h1>
        <p className="text-center mb-12">
          For when you can&apos;t tell if it&apos;s a good idea or a rant.
        </p>
        <h2 className="text-2xl font-semibold mb-6">Posts</h2>
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
