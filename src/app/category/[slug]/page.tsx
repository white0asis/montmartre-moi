import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityClient } from "@/sanity/client";
import {
  articlesByCategoryQuery,
  categoryBySlugQuery,
  categorySlugsQuery,
} from "@/sanity/queries";
import type { ArticleCardData } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import styles from "./category.module.css";

export const revalidate = 3600;

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, articles] = await Promise.all([
    sanityClient.fetch<CategoryDoc | null>(categoryBySlugQuery, { slug }),
    sanityClient.fetch<ArticleCardData[]>(articlesByCategoryQuery, { slug }),
  ]);

  if (!category) notFound();

  return (
    <main>
      <header className={styles.hero}>
        <h1 className={styles.title}>{category.name}</h1>
        <p className={styles.count}>
          {articles.length} {articles.length === 1 ? "article" : "articles"}
        </p>
      </header>

      {category.editorialIntro && (
        <p className={styles.intro}>{category.editorialIntro}</p>
      )}

      <section className={styles.grid}>
        {articles.length === 0 ? (
          <p className={styles.empty}>No articles published in this category yet.</p>
        ) : (
          articles.map((article) => <ArticleCard key={article._id} article={article} />)
        )}
      </section>
    </main>
  );
}
