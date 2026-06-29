import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import { sanityClient } from "@/sanity/client";
import {
  allRestaurantsQuery,
  articlesByCategoryQuery,
  categoryBySlugQuery,
  categorySlugsQuery,
} from "@/sanity/queries";
import type { ArticleCardData, RestaurantCardData } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import RestaurantCard from "@/components/RestaurantCard";
import Breadcrumb from "@/components/Breadcrumb";
import PlanYourWalkCard from "@/components/PlanYourWalkCard";
import styles from "./category.module.css";

// Restaurant documents don't carry a `category` reference (see allRestaurantsQuery),
// so they can't be filtered by slug like articles. This is the one category page
// where they're relevant, so it's special-cased here rather than adding a field
// that would otherwise always point at the same single category.
const RESTAURANTS_CATEGORY_SLUG = "restaurants-and-cafes";

export const revalidate = 3600;

const PAGE_SIZE = 9;

type CategoryDoc = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  editorialIntro?: string;
};

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(categorySlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await sanityClient.fetch<CategoryDoc | null>(categoryBySlugQuery, { slug });
  if (!category) return {};
  return {
    title: category.name,
    description: category.shortDescription,
  };
}

function buildHref(sub: string | undefined, limit?: number) {
  const qs = new URLSearchParams();
  if (sub) qs.set("sub", sub);
  if (limit && limit !== PAGE_SIZE) qs.set("limit", String(limit));
  const query = qs.toString();
  return query ? `?${query}` : "?";
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string; limit?: string }>;
}) {
  const { slug } = await params;
  const { sub, limit: limitParam } = await searchParams;

  const isRestaurantsCategory = slug === RESTAURANTS_CATEGORY_SLUG;

  const [category, allArticles, restaurants] = await Promise.all([
    sanityClient.fetch<CategoryDoc | null>(categoryBySlugQuery, { slug }),
    sanityClient.fetch<ArticleCardData[]>(articlesByCategoryQuery, { slug }),
    isRestaurantsCategory
      ? sanityClient.fetch<RestaurantCardData[]>(allRestaurantsQuery)
      : Promise.resolve<RestaurantCardData[]>([]),
  ]);

  if (!category) notFound();

  // The editorial pick is the most recent article flagged `featured` within
  // this category — pulled out of the grid so it isn't shown twice.
  const featuredPick = allArticles.find((a) => a.featured);
  const rest = allArticles.filter((a) => a._id !== featuredPick?._id);

  // Subcategory chips are derived from whatever editors have actually tagged
  // on articles in this category — no separate taxonomy to keep in sync.
  const subcategories = Array.from(
    new Set(rest.map((a) => a.subcategory).filter((s): s is string => Boolean(s)))
  ).sort((a, b) => a.localeCompare(b));

  const filtered = sub ? rest.filter((a) => a.subcategory === sub) : rest;
  const limit = Math.max(PAGE_SIZE, Number(limitParam) || PAGE_SIZE);
  const visible = filtered.slice(0, limit);
  const hasMore = filtered.length > visible.length;

  return (
    <main>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: category.name }]} />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <h1 className={styles.title}>{category.name}</h1>
            {category.editorialIntro && <p className={styles.intro}>{category.editorialIntro}</p>}
          </div>
          <div className={styles.heroStat}>
            <span className={styles.statNumber}>{allArticles.length}</span>
            <span className={styles.statLabel}>
              {allArticles.length === 1 ? "guide & review" : "guides & reviews"} in this section
            </span>
          </div>
        </div>
      </section>

      {subcategories.length > 1 && (
        <nav aria-label="Filter by subcategory" className={styles.filterBar}>
          <Link href={buildHref(undefined)} className={!sub ? styles.chipActive : styles.chip}>
            All
          </Link>
          {subcategories.map((s) => (
            <Link
              key={s}
              href={buildHref(s)}
              className={sub === s ? styles.chipActive : styles.chip}
            >
              {s}
            </Link>
          ))}
        </nav>
      )}

      {featuredPick && !sub && (
        <section className={styles.featured}>
          <Link href={`/article/${featuredPick.slug}`} className={styles.featuredCard}>
            <div className={styles.featuredImageWrap}>
              {featuredPick.mainImage ? (
                <Image
                  src={urlFor(featuredPick.mainImage).width(900).height(680).url()}
                  alt={featuredPick.title}
                  width={900}
                  height={680}
                  className={styles.featuredImage}
                />
              ) : (
                <div className={styles.featuredPlaceholder} />
              )}
              <span className={styles.featuredBadge}>Editor&rsquo;s pick</span>
            </div>
            <div className={styles.featuredBody}>
              <span className={styles.featuredEyebrow}>
                {featuredPick.subcategory ?? category.name}
              </span>
              <h2 className={styles.featuredTitle}>{featuredPick.title}</h2>
              {featuredPick.excerpt && (
                <p className={styles.featuredExcerpt}>{featuredPick.excerpt}</p>
              )}
              <div className={styles.featuredMeta}>
                {featuredPick.author?.name && <span>{featuredPick.author.name}</span>}
                {featuredPick.readingTime ? <span>{featuredPick.readingTime} min read</span> : null}
              </div>
            </div>
          </Link>
        </section>
      )}

      {restaurants.length > 0 && (
        <section className={styles.restaurantsSection}>
          <h2 className={styles.restaurantsTitle}>The directory</h2>
          <div className={styles.grid}>
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}

      {restaurants.length > 0 && allArticles.length > 0 && (
        <h2 className={`${styles.restaurantsTitle} ${styles.guidesTitle}`}>Guides & reviews</h2>
      )}

      <section className={styles.grid}>
        {visible.length === 0 ? (
          restaurants.length === 0 && (
            <p className={styles.empty}>No articles published in this category yet.</p>
          )
        ) : (
          visible.map((article) => (
            <ArticleCard key={article._id} article={article} eyebrow={article.subcategory ?? undefined} />
          ))
        )}
      </section>

      {hasMore && (
        <div className={styles.loadMoreWrap}>
          <Link href={buildHref(sub, limit + PAGE_SIZE)} className={styles.loadMore}>
            Load more reviews <span aria-hidden="true">↓</span>
          </Link>
        </div>
      )}

      <section className={styles.walkSection}>
        <PlanYourWalkCard variant="banner" />
      </section>
    </main>
  );
}
