import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { ArticleCardData } from "@/lib/types";
import styles from "./ArticleCard.module.css";

export default function ArticleCard({
  article,
  size = "regular",
}: {
  article: ArticleCardData;
  size?: "large" | "regular";
}) {
  return (
    <article className={`${styles.card} ${size === "large" ? styles.large : ""}`}>
      <Link href={`/article/${article.slug}`} className={styles.imageLink}>
        {article.mainImage ? (
          <Image
            src={urlFor(article.mainImage).width(800).height(size === "large" ? 600 : 480).url()}
            alt={article.title}
            width={800}
            height={size === "large" ? 600 : 480}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </Link>
      <div className={styles.body}>
        {article.category && (
          <Link href={`/category/${article.category.slug}`} className={styles.eyebrow}>
            {article.category.title}
          </Link>
        )}
        <h3 className={styles.title}>
          <Link href={`/article/${article.slug}`}>{article.title}</Link>
        </h3>
        {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}
        <div className={styles.meta}>
          {article.author?.name && <span>{article.author.name}</span>}
          {article.readingTime ? <span>{article.readingTime} min read</span> : null}
        </div>
      </div>
    </article>
  );
}
