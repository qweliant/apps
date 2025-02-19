import { getAllPosts } from "@/lib/functions";

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto space-y-12">
        <h1 className="flex items-start text-4xl font-extrabold text-center mb-12">
          Blog Posts
        </h1>
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-lg shadow-lg p-6 space-y-4"
          >
            <p className="text-sm  italic">{post.date}</p>
            <div className="prose max-w-none">{post.content}</div>
          </article>
        ))}
      </main>
    </div>
  );
}
