import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

// Map each Sanity document _type to the route(s) that need revalidating.
// Configure this same URL as a webhook in sanity.io/manage:
//   Project fjsrjd09 -> API -> Webhooks -> add
//   URL: https://<your-domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
//   Dataset: production, Trigger on: Create / Update / Delete, Filter: _type in ["article","place","restaurant","category","author","page"]
const ROUTES_BY_TYPE: Record<string, (slug?: string) => string[]> = {
  article: (slug) => ["/", ...(slug ? [`/article/${slug}`] : [])],
  place: (slug) => (slug ? [`/place/${slug}`] : []),
  restaurant: (slug) => (slug ? [`/restaurant/${slug}`] : []),
  category: (slug) => ["/", ...(slug ? [`/category/${slug}`] : [])],
  author: () => ["/"],
  page: (slug) => (slug ? [`/${slug}`] : []),
};

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const type = body?._type as string | undefined;
  const slug = body?.slug?.current as string | undefined;

  if (!type || !ROUTES_BY_TYPE[type]) {
    return NextResponse.json({ revalidated: false, reason: "unknown type" });
  }

  const paths = ROUTES_BY_TYPE[type](slug);
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true, paths, now: Date.now() });
}
