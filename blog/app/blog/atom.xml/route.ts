import { getAllPosts } from "@/lib/functions";
import { Feed } from "feed";

const feed = new Feed({
  title: "Optimal Frequencies",
  description: "This is my personal feed get fed!",
  id: "https://qwelian.com",
  link: "https://qwelian.com",
  copyright: "All rights reserved 2024, Qwelian Tanner",
  feedLinks: {
    atom: "https://qwelian.com/blog/atom",
  },
  author: {
    name: "Qwelian Tanner",
    email: "qwelian@tutanota.com",
    link: "https://qwelian.com/about",
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
  return new Response(feed.atom1(), {
    headers: {
      "Content-Type": "application/atom+xml",
    },
  });
}
