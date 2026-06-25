import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityClient } from "@/sanity/client";
import { placeBySlugQuery, placeSlugsQuery } from "@/sanity/queries";
import type { PlaceData } from "@/lib/types";
import SpotPage, { type PracticalInfoRow } from "@/components/SpotPage";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(placeSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

async function getPlace(slug: string) {
  return sanityClient.fetch<PlaceData | null>(placeBySlugQuery, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlace(slug);
  if (!place) return {};
  return { title: place.name };
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await getPlace(slug);
  if (!place) notFound();

  const practicalInfo: PracticalInfoRow[] = [
    { label: "Hours", value: place.hours ?? "" },
    { label: "Entry price", value: place.priceInfo ?? "" },
    { label: "Address", value: place.address ?? "" },
    { label: "Official website", value: place.officialWebsite ?? "" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: place.name,
    address: place.address,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SpotPage
        name={place.name}
        typeBadge={place.type || "Place"}
        heroImage={place.gallery?.[0]}
        gallery={place.gallery}
        description={place.description}
        practicalInfo={practicalInfo}
        mapQuery={place.address || place.name}
        insiderTip={place.insiderTip}
        ctaLabel="Plan your visit"
        ctaHref={place.bookingLink || place.officialWebsite}
        relatedArticles={place.relatedArticles}
      />
    </>
  );
}
