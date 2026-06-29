import { groq } from "next-sanity";

/* ---------- shared projections ---------- */

const cardFields = groq`
  _id,
  title,
  "slug": slug.current,
  mainImage,
  excerpt,
  publishedAt,
  "readingTime": round(length(pt::text(body)) / 5 / 200),
  "category": category->{"title": name, "slug": slug.current},
  subcategory,
  featured,
  "author": author->{name}
`;

/* ---------- Homepage ---------- */

export const homepageQuery = groq`{
  "categories": *[_type == "category"] | order(name asc) [0...6]{
    _id, name, "slug": slug.current, shortDescription,
    "articleCount": count(*[_type == "article" && references(^._id)])
  },
  "editorsPicks": *[_type == "article" && featured == true] | order(publishedAt desc) [0...3]{
    ${cardFields}
  },
  "recent": *[_type == "article"] | order(publishedAt desc) [0...6]{
    ${cardFields}
  }
}`;

/* ---------- Category page ---------- */

export const categoryBySlugQuery = groq`*[_type == "category" && slug.current == $slug][0]{
  _id, name, "slug": slug.current, shortDescription, editorialIntro
}`;

export const articlesByCategoryQuery = groq`*[_type == "article" && category->slug.current == $slug] | order(publishedAt desc){
  ${cardFields}
}`;

export const categorySlugsQuery = groq`*[_type == "category" && defined(slug.current)].slug.current`;

// Restaurant documents have no `category` reference of their own — there's
// only one category they're relevant to ("Eat & Drink"), so the category
// page fetches all of them directly rather than filtering by a field that
// doesn't exist on the schema yet.
export const allRestaurantsQuery = groq`*[_type == "restaurant" && defined(slug.current)] | order(name asc){
  _id,
  name,
  "slug": slug.current,
  cuisineType,
  priceRange,
  shortTagline,
  "mainImage": gallery[0]
}`;

/* ---------- Article page ---------- */

export const articleBySlugQuery = groq`*[_type == "article" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  mainImage,
  excerpt,
  body,
  publishedAt,
  metaDescription,
  "readingTime": round(length(pt::text(body)) / 5 / 200),
  "category": category->{name, "slug": slug.current},
  tags,
  "author": author->{name, photo, bio, socialLinks}
}`;

export const relatedArticlesQuery = groq`*[_type == "article" && slug.current != $slug && category->slug.current == $categorySlug] | order(publishedAt desc) [0...3]{
  ${cardFields}
}`;

export const articleSlugsQuery = groq`*[_type == "article" && defined(slug.current)].slug.current`;

/* ---------- Place / Restaurant pages (shared template) ---------- */

export const placeBySlugQuery = groq`*[_type == "place" && slug.current == $slug][0]{
  _id, name, "slug": slug.current, type, tagline, description, highlights,
  googleRating, googleReviewCount, mmPick,
  address, location, mapCaption, shortTagline,
  hours, openingHours, priceInfo, admissionInfo, gettingThere,
  officialWebsite, bookingLink, gallery, insiderTip,
  "relatedArticles": relatedArticles[]->{${cardFields}}
}`;

export const restaurantBySlugQuery = groq`*[_type == "restaurant" && slug.current == $slug][0]{
  _id, name, "slug": slug.current, cuisineType, priceRange, description, address, location,
  hours, services, avgBudgetPerPerson, reservation, ambiance, dontMiss, bookingLink,
  gallery, insiderTip,
  "relatedArticles": relatedArticles[]->{${cardFields}}
}`;

export const placeSlugsQuery = groq`*[_type == "place" && defined(slug.current)].slug.current`;
export const restaurantSlugsQuery = groq`*[_type == "restaurant" && defined(slug.current)].slug.current`;

// All places + restaurants with coordinates, used to compute "Nearby" client-side
// (Sanity/GROQ has no built-in geo-distance function on the free tier query layer).
export const nearbySpotsQuery = groq`*[(_type == "place" || _type == "restaurant") && defined(location)]{
  _id, _type, name, "slug": slug.current, location, shortTagline,
  type, cuisineType, "thumbnail": gallery[0]
}`;

/* ---------- Events ---------- */

export const eventsQuery = groq`*[_type == "event"]{
  _id,
  title,
  "slug": slug.current,
  category,
  schedule,
  startDate,
  endDate,
  recurrenceText,
  locationName,
  "place": place->{name, "slug": slug.current, _type},
  price,
  description,
  featured,
  mainImage,
  officialWebsite
}`;

/* ---------- Itineraries ---------- */

export const itinerariesQuery = groq`*[_type == "itinerary"] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  theme,
  emoji,
  mainImage,
  tagline,
  durationLabel,
  distanceKm,
  difficulty,
  "stopCount": count(stops)
}`;

export const itineraryBySlugQuery = groq`*[_type == "itinerary" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  theme,
  emoji,
  mainImage,
  tagline,
  description,
  durationLabel,
  distanceKm,
  difficulty,
  startPoint,
  startMetro,
  bestTime,
  whatWeLove,
  stops[]{
    name,
    stopType,
    duration,
    walkTime,
    description,
    badge,
    "place": place->{name, "slug": slug.current, _type}
  },
  whatYouShouldKnow,
  tip,
  "relatedItineraries": relatedItineraries[]->{_id, title, "slug": slug.current, theme, emoji}
}`;

export const itinerarySlugsQuery = groq`*[_type == "itinerary" && defined(slug.current)].slug.current`;

/* ---------- Static pages (About, Contact) ---------- */

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  title, "slug": slug.current, body
}`;

export const pageSlugsQuery = groq`*[_type == "page" && defined(slug.current)].slug.current`;
