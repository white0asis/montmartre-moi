import { sanityClient } from "@/sanity/client";
import { groq } from "next-sanity";

export type NavCategory = { _id: string; name: string; slug: string };

const navCategoriesQuery = groq`*[_type == "category"] | order(name asc){
  _id, name, "slug": slug.current
}`;

// Cached across a single request via Next's data cache; revalidated by the
// Sanity webhook whenever a category document changes.
export async function getNavCategories(): Promise<NavCategory[]> {
  return sanityClient.fetch(navCategoriesQuery, {}, { cache: "force-cache" });
}
