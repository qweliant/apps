import type { NextConfig } from "next";
import withMDX from "@next/mdx";

const mdx = withMDX({
  extension: /\.mdx?$/,
});
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"], // Enable MDX alongside TS/TSX
  
};

export default mdx(nextConfig);
