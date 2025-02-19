import { getAllPosts } from "@/lib/functions";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links = [
    {
      url: "https://qwelian.com", // Replace with your homepage
      lastModified: new Date(),
    },
  ];

  const posts = await getAllPosts();
  posts.forEach((post) => {
    links.push({
      url: `https://qwelian.com/posts/${post.slug}`,
      lastModified: new Date(post.date),
    });
  });
  return links;
}
