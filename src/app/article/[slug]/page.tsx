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
import Breadcrumb from "@/components/Breadcrumb";
import TableOfContents from "@/components/TableOfContents";
import SocialShare from "@/components/SocialShare";
import PlanYourWalkCard from "@/components/PlanYourWalkCard";
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

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          ...(article.category
            ? [{ label: article.category.name, href: `/category/${article.category.slug}` }]
            : []),
        ]}
      />

      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{article.title}</h1>
          {article.excerpt && <p className={styles.dek}>{article.excerpt}</p>}
          {article.author?.name && (
            <div className={styles.byline}>
              {article.author.photo ? (
                <Image
                  src={urlFor(article.author.photo).width(46).height(46).url()}
                  alt={article.author.name}
                  width={46}
                  height={46}
                  className={styles.bylineAvatarPhoto}
                />
              ) : (
                <span className={styles.bylineAvatar}>{article.author.name.charAt(0)}</span>
              )}
              <div className={styles.bylineInfo}>
                <span className={styles.bylineName}>{article.author.name}</span>
                <span className={styles.bylineMeta}>
                  {article.publishedAt &&
                    new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  {article.publishedAt && article.readingTime ? " · " : ""}
                  {article.readingTime ? `${article.readingTime} min read` : null}
                </span>
              </div>
            </div>
          )}
        </div>

        {article.mainImage && (
          <figure className={styles.headerPhoto}>
            <Image
              src={urlFor(article.mainImage).width(900).height(675).url()}
              alt={article.title}
              width={900}
              height={675}
              className={styles.headerPhotoImg}
              priority
            />
          </figure>
        )}
      </header>

      <div className={styles.layout}>
        <article className={styles.contentColumn}>
          {article.body && <ArticleBody value={article.body} />}

          {(article.tags?.length || 0) > 0 && (
            <div className={styles.tags}>
              {article.tags!.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <SocialShare url={pageUrl} title={article.title} />

          {article.author?.name && (
            <div className={styles.authorBlock}>
              {article.author.photo ? (
                <Image
                  src={urlFor(article.author.photo).width(64).height(64).url()}
                  alt={article.author.name}
                  width={64}
                  height={64}
                  className={styles.authorPhoto}
                />
              ) : (
                <span className={styles.authorAvatar}>{article.author.name.charAt(0)}</span>
              )}
              <div>
                <p className={styles.authorEyebrow}>Written by</p>
                <p className={styles.authorName}>{article.author.name}</p>
                {article.author.bio && <p className={styles.authorBio}>{article.author.bio}</p>}
              </div>
            </div>
          )}
        </article>

        <aside className={styles.sidebar}>
          <TableOfContents headings={headings} />
          <PlanYourWalkCard variant="compact" />
        </aside>
      </div>

      <section className={styles.walkSection}>
        <PlanYourWalkCard variant="banner" />
      </section>

      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedHeader}>
            <h2 className={styles.relatedTitle}>
              <span className={styles.relatedArrow}>→</span>Keep reading
            </h2>
            {article.category && (
              <Link href={`/category/${article.category.slug}`} className={styles.relatedAll}>
                All articles →
              </Link>
            )}
          </div>
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
