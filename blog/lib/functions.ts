import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import fs from "fs";

export async function getSortedPosts() {
  const contentDir = path.join(process.cwd(), "content");
  const filenames = fs
    .readdirSync(contentDir)
    .filter((filename) => filename.endsWith(".mdx"));

  // Format title utility
  const formatTitle = (slug: string) => {
    return slug
      .replace(/\.mdx$/, "") // Remove .mdx extension
      .replace(/_/g, " ") // Replace underscores with spaces
      .split(" ")
      .map((word) =>
        word.length <= 3 && !word.match(/^[0-9]/)
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  // Extract frontmatter and create posts array
  const posts = await Promise.all(
    filenames.map(async (name) => {
      const filePath = path.join(contentDir, name);
      const fileContent = fs.readFileSync(filePath, "utf8");

      try {
        const { frontmatter } = await compileMDX<{ date: string }>({
          source: fileContent,
          options: { parseFrontmatter: true },
        });

        return {
          slug: name.replace(/\.mdx$/, ""),
          title: formatTitle(name),
          date: new Date(frontmatter.date),
        };
      } catch (error) {
        console.error(`Error processing file ${name}:`, error);
        return null; // Skip the problematic file
      }
    })
  );

  // Sort posts by date (newest first)
  return posts
    .filter((post) => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAllPosts() {
  const postsDir = path.join(process.cwd(), "content");
  const filenames = fs
    .readdirSync(postsDir)
    .filter((name) => name.endsWith(".mdx")); // Only include .mdx files

  // Helper to format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Read and compile all posts
  const posts = await Promise.all(
    filenames.map(async (name) => {
      const slug = name.replace(/\.mdx$/, ""); // Remove the .mdx extension
      const filePath = path.join(postsDir, name); // Construct the file path
      const fileContent = fs.readFileSync(filePath, "utf8"); // Read the file content
      const { content, frontmatter } = await compileMDX<{
        title: string;
        date: string;
      }>({
        source: fileContent,
        options: { parseFrontmatter: true }, // Parse frontmatter for metadata
      });

      return {
        slug,
        content,
        title: frontmatter?.title || slug.replace(/-/g, " "),
        date: frontmatter?.date ? formatDate(frontmatter.date) : "Unknown Date",
      };
    })
  );
  return posts
    .filter((post) => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
