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
  author?: { name: string } | null;
};

export type NavCategory = { _id: string; name: string; slug: string };

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

export type PlaceData = SpotData & {
  type?: string;
  priceInfo?: string;
  officialWebsite?: string;
};

export type RestaurantData = SpotData & {
  cuisineType?: string;
  priceRange?: string;
  services?: string[];
  avgBudgetPerPerson?: number;
  reservation?: string;
  ambiance?: string[];
  dontMiss?: string;
};

export type StaticPageData = {
  title: string;
  slug: string;
  body?: PortableTextBlock[];
};
