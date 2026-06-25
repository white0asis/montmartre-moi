import { createClient } from "next-sanity";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string;
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET as string;
export const sanityApiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-06-01";

if (!sanityProjectId || !sanityDataset) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET env vars."
  );
}

/**
 * Read-only client used by the Next.js frontend (SSG/ISR).
 * `useCdn: true` serves cached content from Sanity's global CDN — fine for
 * published content, since freshness is handled by the revalidation webhook.
 */
export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Privileged client for server-only operations (the Cowork editorial plugin,
 * the revalidation route). Requires SANITY_API_READ_TOKEN / a write token.
 */
export function getSanityWriteClient(token: string) {
  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    useCdn: false,
    token,
  });
}
