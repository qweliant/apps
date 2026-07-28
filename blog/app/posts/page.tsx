import Link from "next/link";
import { getAllPosts } from "@/lib/functions";
import Win from "../components/Win";

export const metadata = {
  title: "Archive — Optimal Frequencies",
  description: "every transmission, newest first.",
};

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-2xl mx-auto px-3.5 py-10">
      <div className="text-center pb-4">
        <p className="lb-lab tracking-[0.34em]">░░░ the archive ░░░</p>
        <h1 className="font-fredoka font-bold text-[clamp(2rem,5vw,3rem)] leading-none my-1 text-[var(--deep-pink)]">
          every transmission
        </h1>
        <p className="italic text-[var(--muted-text)] m-0">{posts.length} essays, newest first.</p>
      </div>

      <Win title={<>✉ transmissions.log</>}>
        <ul className="lb-log" style={{ gap: "12px" }}>
          {posts.map((post, i) => (
            <li key={post.slug}>
              <time>
                {post.date
                  ? new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </time>
              <Link href={`/posts/${post.slug}`} className="win-h text-base leading-snug">
                {i === 0 && (
                  <span className="home-blink text-[var(--deep-pink)] mr-2 text-xs align-middle font-mono">
                    ★NEW
                  </span>
                )}
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </Win>

      <p className="text-center mt-6 font-mono text-xs text-[var(--muted-text)] tracking-widest">
        <Link href="/">← back to the broadcast</Link>
      </p>
    </div>
  );
}
