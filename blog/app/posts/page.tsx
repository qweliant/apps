import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";

export default async function PostsPage() {
  const postsDir = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(postsDir);

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
      const slug = name.replace(/\.mdx$/, "");
      const filePath = path.join(postsDir, name);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { content, frontmatter } = await compileMDX<{
        // title: string;
        date: string;
      }>({
        source: fileContent,
        options: { parseFrontmatter: true },
      });
      return {
        slug,
        content,
        // title: frontmatter?.title || slug.replace(/-/g, " "),
        date: frontmatter?.date ? formatDate(frontmatter.date) : "Unknown Date",
      };
    })
  );

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto space-y-12">
        <h1 className="flex items-start text-4xl font-extrabold text-center text-gray-800 mb-12">
          Blog Posts
        </h1>
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-lg shadow-lg p-6 space-y-4"
          >
            {/* <h2 className="text-2xl font-bold text-blue-700">{post.title}</h2> */}
            <p className="text-sm text-gray-500 italic">{post.date}</p>
            <div className="prose max-w-none">{post.content}</div>
          </article>
        ))}
      </main>
    </div>
  );
}
