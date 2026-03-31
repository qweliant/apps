import { getAllPosts, markdownToHtml } from "@/lib/functions";
import { Feed } from "feed";

export async function GET() {
  const posts = await getAllPosts();

  const feed = new Feed({
    title: "Optimal Frequencies",
    description: "This is my personal feed get fed!",
    id: "https://qwelian.com",
    link: "https://qwelian.com/posts/atom.xml",
    copyright: "All rights reserved 2024, Qwelian Tanner",
    feedLinks: {
      rss: "https://qwelian.com/posts/rss.xml",
    },
    author: {
      name: "Qwelian Tanner",
      email: "qwelian@tutanota.com",
      link: "https://qwelian.com/about",
    },
  });

  await Promise.all(
    posts.map(async (post) => {
      const html = await markdownToHtml(post.rawContent);
      feed.addItem({
        title: post.title ?? "",
        link: `https://qwelian.com/posts/${post.slug}`,
        date: new Date(post.date),
        description: html,
      });
    })
  );

  return new Response(feed.atom1(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
