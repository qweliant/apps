import type { NextConfig } from "next";
import withMDX from "@next/mdx";

const mdx = withMDX({
  extension: /\.mdx?$/,
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
