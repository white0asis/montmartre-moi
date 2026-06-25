import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityClient } from "@/sanity/client";
import { pageBySlugQuery, pageSlugsQuery } from "@/sanity/queries";
import type { StaticPageData } from "@/lib/types";
import ArticleBody from "@/components/ArticleBody";
import styles from "./page.module.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(pageSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

async function getPage(slug: string) {
  return sanityClient.fetch<StaticPageData | null>(pageBySlugQuery, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  return { title: page.title };
}

export default async function StaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>{page.title}</h1>
      {page.body && <ArticleBody value={page.body} />}
    </main>
  );
}
