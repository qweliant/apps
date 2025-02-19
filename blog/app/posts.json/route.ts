import { getAllPosts } from "@/lib/functions";

export async function GET() {
  const posts = await getAllPosts();

  return new Response(JSON.stringify(posts), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
