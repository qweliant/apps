import { getAllPosts } from "@/lib/functions";
import { Feed } from "feed";

const feed = new Feed({
  title: "Optimal Frequencies",
  description: "This is my personal feed get fed!",
  id: "https://qwelian.com",
  link: "https://qwelian.com/blog/rss.xml",
  copyright: "All rights reserved 2024, Qwelian Tanner",
  author: {
    name: "Qwelian Tanner",
    email: "qwelian@tutanota.com",
    link: "https://qwelian.com/about",
  },
  feedLinks: {
    atom: "https://qwelian.com/blog/atom",
  },
});

export async function GET() {
  const posts = await getAllPosts();
  posts.forEach((post) => {
    feed.addItem({
      title: `${post.title ?? ""}`,
      link: `https://qwelian.com/posts/${post.slug}`,
      date: new Date(post.date),
    });
  });
  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
