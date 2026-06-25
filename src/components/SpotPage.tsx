import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/image";
import type { ArticleCardData } from "@/lib/types";
import ArticleBody from "./ArticleBody";
import ArticleCard from "./ArticleCard";
import styles from "./SpotPage.module.css";

export type PracticalInfoRow = { label: string; value: string };

export default function SpotPage({
  name,
  typeBadge,
  heroImage,
  gallery = [],
  description,
  practicalInfo,
  mapQuery,
  insiderTip,
  ctaLabel,
  ctaHref,
  relatedArticles = [],
}: {
  name: string;
  typeBadge: string;
  heroImage?: SanityImageSource;
  gallery?: SanityImageSource[];
  description?: PortableTextBlock[];
  practicalInfo: PracticalInfoRow[];
  mapQuery?: string;
  insiderTip?: string;
  ctaLabel: string;
  ctaHref?: string;
  relatedArticles?: ArticleCardData[];
}) {
  return (
    <main>
      <div className={styles.heroWrap}>
        {heroImage ? (
          <Image
            src={urlFor(heroImage).width(1600).height(700).url()}
            alt={name}
            width={1600}
            height={700}
            className={styles.heroImage}
            priority
          />
        ) : (
          <div className={styles.heroPlaceholder} />
        )}
        <span className={styles.badge}>{typeBadge}</span>
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          <h1 className={styles.title}>{name}</h1>

          {description && <ArticleBody value={description} />}

          {gallery.length > 0 && (
            <div className={styles.gallery}>
              {gallery.map((img, i) => (
                <Image
                  key={i}
                  src={urlFor(img).width(500).height(380).url()}
                  alt={`${name} — photo ${i + 1}`}
                  width={500}
                  height={380}
                  className={styles.galleryImage}
                />
              ))}
            </div>
          )}

          {mapQuery && (
            <div className={styles.mapWrap}>
              <iframe
                title={`Map — ${name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                className={styles.map}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}

          {relatedArticles.length > 0 && (
            <section className={styles.related}>
              <h2 className={styles.relatedTitle}>From the blog</h2>
              <div className={styles.relatedGrid}>
                {relatedArticles.map((a) => (
                  <ArticleCard key={a._id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>Practical info</h2>
            <dl className={styles.infoList}>
              {practicalInfo
                .filter((row) => row.value)
                .map((row) => (
                  <div key={row.label} className={styles.infoRow}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
            </dl>
            {ctaHref && (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cta}
              >
                {ctaLabel}
              </a>
            )}
          </div>

          {insiderTip && (
            <div className={styles.tipCard}>
              <p className={styles.tipLabel}>Insider tip</p>
              <p>{insiderTip}</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
