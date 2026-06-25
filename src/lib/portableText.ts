import type { PortableTextBlock } from "@portabletext/types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function blockText(block: PortableTextBlock): string {
  if (!Array.isArray(block.children)) return "";
  return block.children
    .map((child) => (typeof child === "object" && "text" in child ? (child.text as string) : ""))
    .join("");
}

export type Heading = { id: string; text: string };

export function extractHeadings(body: PortableTextBlock[] = []): Heading[] {
  return body
    .filter((block) => block._type === "block" && block.style === "h2")
    .map((block) => {
      const text = blockText(block);
      return { id: slugify(text), text };
    });
}
