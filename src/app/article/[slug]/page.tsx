import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityClient } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  articleBySlugQuery,
  articleSlugsQuery,
  relatedArticlesQuery,
} from "@/sanity/queries";
import type { ArticleCardData, ArticleData } from "@/lib/types";
import { extractHeadings } from "@/lib/portableText";
import ArticleBody from "@/components/ArticleBody";
import ArticleCard from "@/components/ArticleCard";
import TableOfContents from "@/components/TableOfContents";
import SocialShare from "@/components/SocialShare";
import styles from "./article.module.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(articleSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

async function getArticle(slug: string) {
  return sanityClient.fetch<ArticleData | null>(articleBySlugQuery, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const description = article.metaDescription || article.excerpt;
  const imageUrl = article.mainImage ? urlFor(article.mainImage).width(1200).height(630).url() : undefined;

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const headings = extractHeadings(article.body);
  const related = article.category
    ? await sanityClient.fetch<ArticleCardData[]>(relatedArticlesQuery, {
        slug,
        categorySlug: article.category.slug,
      })
    : [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://montmartremoi.com";
  const pageUrl = `${siteUrl}/article/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    datePublished: article.publishedAt,
    author: article.author ? { "@type": "Person", name: article.author.name } : undefined,
    image: article.mainImage ? urlFor(article.mainImage).width(1200).url() : undefined,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className={styles.hero}>
        {article.category && (
          <Link href={`/category/${article.category.slug}`} className={styles.eyebrow}>
            {article.category.name}
          </Link>
        )}
        <h1 className={styles.title}>{article.title}</h1>
        {article.excerpt && <p className={styles.dek}>{article.excerpt}</p>}
        <div className={styles.metaBar}>
          {article.author?.name && <span>{article.author.name}</span>}
          {article.publishedAt && (
            <span>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          {article.readingTime ? <span>{article.readingTime} min read</span> : null}
        </div>
      </header>

      {article.mainImage && (
        <div className={styles.heroImageWrap}>
          <Image
            src={urlFor(article.mainImage).width(1600).height(900).url()}
            alt={article.title}
            width={1600}
            height={900}
            className={styles.heroImage}
            priority
          />
        </div>
      )}

      <div className={styles.layout}>
        <aside className={styles.tocColumn}>
          <TableOfContents headings={headings} />
        </aside>

        <article className={styles.contentColumn}>
          {article.body && <ArticleBody value={article.body} />}
          <SocialShare url={pageUrl} title={article.title} />

          {article.author?.name && (
            <div className={styles.authorBlock}>
              {article.author.photo && (
                <Image
                  src={urlFor(article.author.photo).width(80).height(80).url()}
                  alt={article.author.name}
                  width={80}
                  height={80}
                  className={styles.authorPhoto}
                />
              )}
              <div>
                <p className={styles.authorName}>{article.author.name}</p>
                {article.author.bio && <p className={styles.authorBio}>{article.author.bio}</p>}
              </div>
            </div>
          )}
        </article>

        <div className={styles.spacerColumn} aria-hidden />
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>You might also like</h2>
          <div className={styles.relatedGrid}>
            {related.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
