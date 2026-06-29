import type { SanityImageSource } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/types";

export type ArticleCardData = {
  _id: string;
  title: string;
  slug: string;
  mainImage?: SanityImageSource;
  excerpt?: string;
  publishedAt?: string;
  readingTime?: number;
  category?: { title: string; slug: string } | null;
  subcategory?: string | null;
  featured?: boolean;
  author?: { name: string } | null;
};

export type NavCategory = { _id: string; name: string; slug: string };

export type RestaurantCardData = {
  _id: string;
  name: string;
  slug: string;
  mainImage?: SanityImageSource;
  cuisineType?: string;
  priceRange?: string;
  shortTagline?: string;
};

export type ArticleData = {
  _id: string;
  title: string;
  slug: string;
  mainImage?: SanityImageSource;
  excerpt?: string;
  body?: PortableTextBlock[];
  publishedAt?: string;
  metaDescription?: string;
  readingTime?: number;
  category?: { name: string; slug: string } | null;
  tags?: string[];
  author?: {
    name: string;
    photo?: SanityImageSource;
    bio?: string;
    socialLinks?: { platform: string; url: string }[];
  } | null;
};

export type SpotData = {
  _id: string;
  name: string;
  slug: string;
  description?: PortableTextBlock[];
  address?: string;
  location?: { lat: number; lng: number };
  hours?: string;
  gallery?: SanityImageSource[];
  insiderTip?: string;
  bookingLink?: string;
  relatedArticles?: ArticleCardData[];
};

export type WeeklyHours = {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
};

export type Highlight = { icon?: string; title: string; text?: string };

export type PlaceData = SpotData & {
  type?: string;
  tagline?: string;
  highlights?: Highlight[];
  googleRating?: number;
  googleReviewCount?: number;
  mmPick?: boolean;
  openingHours?: WeeklyHours;
  priceInfo?: string;
  admissionInfo?: string[];
  gettingThere?: string[];
  officialWebsite?: string;
  mapCaption?: string;
  shortTagline?: string;
};

export type RestaurantData = SpotData & {
  cuisineType?: string;
  priceRange?: string;
  services?: string[];
  avgBudgetPerPerson?: number;
  reservation?: string;
  ambiance?: string[];
  dontMiss?: string;
  shortTagline?: string;
};

export type NearbySpot = {
  _id: string;
  _type: "place" | "restaurant";
  name: string;
  slug: string;
  location: { lat: number; lng: number };
  shortTagline?: string;
  type?: string;
  cuisineType?: string;
  thumbnail?: SanityImageSource;
};

export type StaticPageData = {
  title: string;
  slug: string;
  body?: PortableTextBlock[];
};

export type EventCategory =
  | "cinema"
  | "music"
  | "art"
  | "walk"
  | "eat-drink"
  | "heritage"
  | "festival"
  | "market";

export type EventData = {
  _id: string;
  title: string;
  slug: string;
  category?: EventCategory;
  schedule?: "oneOff" | "recurring";
  startDate?: string;
  endDate?: string;
  recurrenceText?: string;
  locationName?: string;
  place?: { name: string; slug: string; _type: "place" | "restaurant" } | null;
  price?: string;
  description?: string;
  featured?: boolean;
  mainImage?: SanityImageSource;
  officialWebsite?: string;
};

export type ItineraryStop = {
  name: string;
  stopType?: string;
  duration?: string;
  walkTime?: string;
  description?: string;
  badge?: string;
  place?: { name: string; slug: string; _type: "place" | "restaurant" } | null;
};

export type ItineraryData = {
  _id: string;
  title: string;
  slug: string;
  theme?: string;
  emoji?: string;
  mainImage?: SanityImageSource;
  tagline?: string;
  description?: PortableTextBlock[];
  durationLabel?: string;
  distanceKm?: number;
  difficulty?: "easy" | "moderate" | "challenging";
  startPoint?: string;
  startMetro?: string;
  bestTime?: string;
  whatWeLove?: Highlight[];
  stops?: ItineraryStop[];
  whatYouShouldKnow?: Highlight[];
  tip?: string;
  relatedItineraries?: { _id: string; title: string; slug: string; theme?: string; emoji?: string }[];
};
