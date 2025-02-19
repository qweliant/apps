import { getAllPosts } from "@/lib/functions";
import { MetadataRoute } from "next";

async function getBlogsSitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const blogPostEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://qwelian.com/posts/${post.slug}/index.html`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.9,
  }));
  const newestBlogDate = posts[0].date;
  const blogIndexEntry: MetadataRoute.Sitemap[0] = {
    url: `https://qwelian.com/posts/index.html`,
    lastModified: newestBlogDate,
    changeFrequency: "weekly",
    priority: 0.5,
  };
  const result = [blogIndexEntry, ...blogPostEntries];
  return result;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogsSitemap = await getBlogsSitemap();

  return [
    {
      url: `https://qwelian.com/index.html`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...blogsSitemap,
  ];
}
