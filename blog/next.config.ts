import type { NextConfig } from "next";
import withMDX from "@next/mdx";
// import rehypeAutolinkHeadings from "rehype-autolink-headings";
// import rehypeSlug from "rehype-slug";

const mdx = withMDX({
  extension: /\.mdx?$/,
  // options: {
  //   rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  // },
});
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"], // Enable MDX alongside TS/TSX
  images: {
    domains: ["images.unsplash.com"],
  },
  experimental: {
    mdxRs: true,
  },
};

export default mdx(nextConfig);
