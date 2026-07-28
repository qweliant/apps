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
  // lib/assets.ts reads public/ with a dynamic subdir, which the file tracer
  // can't resolve — so it drags all ~1GB of public/ into the serverless bundle
  // and blows past Netlify's function upload limit. Those reads only happen at
  // build time (/ is prerendered); public/ is served from the CDN at runtime.
  outputFileTracingExcludes: {
    "*": ["public/**"],
  },
  images: {
    domains: ["images.unsplash.com"],
  },
  experimental: {
    mdxRs: true,
  },
};

export default mdx(nextConfig);
