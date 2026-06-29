import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityClient } from "@/sanity/client";
import { placeBySlugQuery, placeSlugsQuery, nearbySpotsQuery } from "@/sanity/queries";
import type { NearbySpot, PlaceData } from "@/lib/types";
import SpotPage, { type NearbyItem, type PracticalInfoRow } from "@/components/SpotPage";
import { groupWeeklyHours, hasStructuredHours, isOpenToday } from "@/lib/openingHours";
import { distanceInMeters, walkingTimeLabel } from "@/lib/distance";
import { placeTypeMeta, restaurantTypeMeta } from "@/lib/spotMeta";

export const revalidate = 3600;

const NEARBY_LIMIT = 4;

function prettyUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

async function getNearby(place: PlaceData): Promise<NearbyItem[]> {
  if (!place.location) return [];

  const spots = await sanityClient.fetch<NearbySpot[]>(nearbySpotsQuery);

  return spots
    .filter((spot) => spot._id !== place._id)
    .map((spot) => ({
      spot,
      meters: distanceInMeters(place.location!, spot.location),
    }))
    .sort((a, b) => a.meters - b.meters)
    .slice(0, NEARBY_LIMIT)
    .map(({ spot, meters }) => {
      const meta =
        spot._type === "restaurant"
          ? restaurantTypeMeta(spot.cuisineType)
          : placeTypeMeta(spot.type);
      return {
        href: `/${spot._type}/${spot.slug}`,
        icon: meta.icon,
        name: spot.name,
        categoryLabel: meta.label,
        tagline: spot.shortTagline,
        distanceLabel: walkingTimeLabel(meters),
      };
    });
}

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
    hasStructuredHours(place.openingHours)
      ? { icon: "clock", label: "Hours", rows: groupWeeklyHours(place.openingHours!) }
      : { icon: "clock", label: "Hours", value: place.hours ?? "" },
    place.admissionInfo?.length
      ? { icon: "ticket", label: "Admission", lines: place.admissionInfo }
      : { icon: "ticket", label: "Admission", value: place.priceInfo ?? "" },
    { icon: "pin", label: "Address", value: place.address ?? "" },
    { icon: "train", label: "Getting there", lines: place.gettingThere ?? [] },
    place.officialWebsite
      ? {
          icon: "globe",
          label: "Website",
          link: { href: place.officialWebsite, text: prettyUrl(place.officialWebsite) },
        }
      : { icon: "globe", label: "Website", value: "" },
  ];

  const openToday = isOpenToday(place.openingHours, place.hours);
  const typeMeta = placeTypeMeta(place.type);
  const nearby = await getNearby(place);

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
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: typeMeta.plural },
          { label: place.name },
        ]}
        tagline={place.tagline}
        rating={
          place.googleRating
            ? {
                value: place.googleRating,
                reviewCount: place.googleReviewCount,
                mmPick: place.mmPick,
              }
            : undefined
        }
        heroImage={place.gallery?.[0]}
        gallery={place.gallery}
        description={place.description}
        highlights={place.highlights}
        practicalInfo={practicalInfo}
        openToday={openToday}
        mapQuery={place.address || place.name}
        mapCaption={place.mapCaption}
        insiderTip={place.insiderTip}
        ctaLabel="Plan your visit"
        ctaHref={place.bookingLink || place.officialWebsite}
        relatedArticles={place.relatedArticles}
        nearby={nearby}
      />
    </>
  );
}
