import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityClient } from "@/sanity/client";
import { restaurantBySlugQuery, restaurantSlugsQuery } from "@/sanity/queries";
import type { RestaurantData } from "@/lib/types";
import SpotPage, { type PracticalInfoRow } from "@/components/SpotPage";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(restaurantSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

async function getRestaurant(slug: string) {
  return sanityClient.fetch<RestaurantData | null>(restaurantBySlugQuery, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);
  if (!restaurant) return {};
  return { title: restaurant.name };
}

const RESERVATION_LABEL: Record<string, string> = {
  required: "Required",
  recommended: "Recommended",
  no: "Not needed",
};

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);
  if (!restaurant) notFound();

  const practicalInfo: PracticalInfoRow[] = [
    { label: "Cuisine", value: restaurant.cuisineType ?? "" },
    { label: "Price range", value: restaurant.priceRange ?? "" },
    {
      label: "Budget / person",
      value: restaurant.avgBudgetPerPerson ? `€${restaurant.avgBudgetPerPerson}` : "",
    },
    {
      label: "Reservation",
      value: restaurant.reservation ? RESERVATION_LABEL[restaurant.reservation] ?? restaurant.reservation : "",
    },
    { label: "Ambiance", value: restaurant.ambiance?.join(", ") ?? "" },
    { label: "Don't miss", value: restaurant.dontMiss ?? "" },
    { label: "Hours", value: restaurant.hours ?? "" },
    { label: "Address", value: restaurant.address ?? "" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    address: restaurant.address,
    servesCuisine: restaurant.cuisineType,
    priceRange: restaurant.priceRange,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SpotPage
        name={restaurant.name}
        typeBadge="Restaurant"
        heroImage={restaurant.gallery?.[0]}
        gallery={restaurant.gallery}
        description={restaurant.description}
        practicalInfo={practicalInfo}
        mapQuery={restaurant.address || restaurant.name}
        insiderTip={restaurant.insiderTip}
        ctaLabel="Reserve a table"
        ctaHref={restaurant.bookingLink}
        relatedArticles={restaurant.relatedArticles}
      />
    </>
  );
}
