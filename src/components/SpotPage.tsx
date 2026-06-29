import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/image";
import type { ArticleCardData, Highlight } from "@/lib/types";
import ArticleBody from "./ArticleBody";
import ArticleCard from "./ArticleCard";
import Breadcrumb, { type BreadcrumbItem } from "./Breadcrumb";
import MapStopList from "./MapStopList";
import styles from "./SpotPage.module.css";

export type IconName = "clock" | "ticket" | "pin" | "train" | "globe";

export type PracticalInfoRow = {
  icon?: IconName;
  label: string;
  /** Simple one-line value (legacy usage, still used by the restaurant page). */
  value?: string;
  /** Several plain lines stacked under the label (e.g. admission tiers). */
  lines?: string[];
  /** Two-column rows, e.g. grouped weekly opening hours. */
  rows?: { left: string; right: string; highlight?: boolean }[];
  /** A single link line, rendered with a trailing arrow. */
  link?: { href: string; text: string };
};

export type RatingInfo = { value: number; reviewCount?: number; mmPick?: boolean };

export type NearbyItem = {
  href: string;
  icon: string;
  name: string;
  categoryLabel: string;
  tagline?: string;
  distanceLabel: string;
};

function InfoIcon({ name }: { name: IconName }) {
  switch (name) {
    case "clock":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "ticket":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z"
            strokeLinejoin="round"
          />
          <path d="M13 6v12" strokeDasharray="2 2" />
        </svg>
      );
    case "pin":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s-7-7.2-7-12a7 7 0 1 1 14 0c0 4.8-7 12-7 12Z" strokeLinejoin="round" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      );
    case "train":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="3" width="16" height="13" rx="3" />
          <path d="M4 11h16M9 16l-2 4M15 16l2 4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8.5" cy="13.5" r="0.6" fill="currentColor" />
          <circle cx="15.5" cy="13.5" r="0.6" fill="currentColor" />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
  }
}

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <span className={styles.stars} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rounded ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function SpotPage({
  name,
  typeBadge,
  breadcrumb,
  tagline,
  rating,
  heroImage,
  gallery,
  description,
  highlights,
  practicalInfo,
  openToday,
  mapQuery,
  mapCaption,
  insiderTip,
  ctaLabel,
  ctaHref,
  relatedArticles,
  nearby,
}: {
  name: string;
  typeBadge: string;
  breadcrumb?: BreadcrumbItem[];
  tagline?: string;
  rating?: RatingInfo;
  heroImage?: SanityImageSource;
  gallery?: SanityImageSource[] | null;
  description?: PortableTextBlock[];
  highlights?: Highlight[] | null;
  practicalInfo: PracticalInfoRow[];
  /** When set, shows an "Open today" / "Closed today" badge in the card header. */
  openToday?: boolean;
  mapQuery?: string;
  mapCaption?: string;
  insiderTip?: string;
  ctaLabel: string;
  ctaHref?: string;
  relatedArticles?: ArticleCardData[] | null;
  nearby?: NearbyItem[];
}) {
  // GROQ returns null (not undefined) for empty/unset arrays, so default
  // parameter values above wouldn't catch it — normalize explicitly here.
  const galleryList = gallery ?? [];
  const relatedList = relatedArticles ?? [];
  const highlightList = highlights ?? [];
  const nearbyList = nearby ?? [];
  const infoRows = practicalInfo.filter(
    (row) => row.value || row.lines?.length || row.rows?.length || row.link
  );
  const [mainImage, ...sideImages] = galleryList;

  return (
    <main>
      {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}

      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>{typeBadge} · Montmartre Moi</p>
          <h1 className={styles.title}>{name}</h1>
          {tagline && <p className={styles.tagline}>{tagline}</p>}

          {rating && (
            <div className={styles.ratingRow}>
              <Stars value={rating.value} />
              <span className={styles.ratingText}>
                <strong>{rating.value.toFixed(1)}</strong>
                {rating.reviewCount
                  ? ` · ${rating.reviewCount.toLocaleString("en-US")}+ reviews on Google`
                  : null}
              </span>
              {rating.mmPick && <span className={styles.mmPick}>MM Pick</span>}
            </div>
          )}
        </div>

        <div className={styles.heroImageWrap}>
          {heroImage ? (
            <Image
              src={urlFor(heroImage).width(900).height(675).url()}
              alt={name}
              width={900}
              height={675}
              className={styles.heroImage}
              priority
            />
          ) : (
            <div className={styles.heroPlaceholder} />
          )}
          <span className={styles.heroBadge}>{typeBadge}</span>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          {highlightList.length > 0 && (
            <section className={styles.loves}>
              <h2 className={styles.lovesTitle}>What we love about it</h2>
              {highlightList.map((h, i) => (
                <div key={i} className={styles.loveItem}>
                  {h.icon && <span className={styles.loveIcon}>{h.icon}</span>}
                  <div>
                    <strong className={styles.loveItemTitle}>{h.title}</strong>
                    {h.text && <span className={styles.loveItemText}>{h.text}</span>}
                  </div>
                </div>
              ))}
            </section>
          )}

          {description && <ArticleBody value={description} />}

          {insiderTip && (
            <div className={styles.tip}>
              <p className={styles.tipLabel}>Montmartre Moi tip</p>
              <p>{insiderTip}</p>
            </div>
          )}

          {galleryList.length > 0 && (
            <div className={styles.gallery}>
              {mainImage && (
                <Image
                  src={urlFor(mainImage).width(720).height(640).url()}
                  alt={`${name} — photo 1`}
                  width={720}
                  height={640}
                  className={styles.galleryMain}
                />
              )}
              {sideImages.length > 0 && (
                <div className={styles.gallerySide}>
                  {sideImages.slice(0, 2).map((img, i) => (
                    <Image
                      key={i}
                      src={urlFor(img).width(420).height(310).url()}
                      alt={`${name} — photo ${i + 2}`}
                      width={420}
                      height={310}
                      className={styles.gallerySideImage}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {mapQuery && (
            <MapStopList title={name} mapQuery={mapQuery} mapCaption={mapCaption} items={[]} />
          )}

          {nearbyList.length > 0 && (
            <MapStopList
              title="Nearby"
              items={nearbyList.map((spot) => ({
                href: spot.href,
                icon: spot.icon,
                name: spot.name,
                subtitle: spot.tagline ? `${spot.categoryLabel} · ${spot.tagline}` : spot.categoryLabel,
                meta: spot.distanceLabel,
              }))}
            />
          )}

          {relatedList.length > 0 && (
            <section className={styles.related}>
              <h2 className={styles.relatedTitle}>From the blog</h2>
              <div className={styles.relatedGrid}>
                {relatedList.map((a) => (
                  <ArticleCard key={a._id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <h2 className={styles.infoTitle}>Practical info</h2>
              {openToday !== undefined && (
                <span className={openToday ? styles.statusOpen : styles.statusClosed}>
                  {openToday ? "Open today" : "Closed today"}
                </span>
              )}
            </div>

            <div className={styles.infoBody}>
              <dl className={styles.infoList}>
                {infoRows.map((row) => (
                  <div key={row.label} className={styles.infoRow}>
                    {row.icon && (
                      <span className={styles.infoIcon}>
                        <InfoIcon name={row.icon} />
                      </span>
                    )}
                    <div className={styles.infoContent}>
                      <dt className={styles.infoLabel}>{row.label}</dt>
                      {row.rows ? (
                        <div className={styles.hoursGrid}>
                          {row.rows.map((r) => (
                            <div
                              key={r.left}
                              className={
                                r.highlight
                                  ? `${styles.hoursLine} ${styles.hoursLineToday}`
                                  : styles.hoursLine
                              }
                            >
                              <span>{r.left}</span>
                              <span>{r.right}</span>
                            </div>
                          ))}
                        </div>
                      ) : row.lines ? (
                        row.lines.map((line, i) => <dd key={i}>{line}</dd>)
                      ) : row.link ? (
                        <a
                          href={row.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.infoLink}
                        >
                          {row.link.text} →
                        </a>
                      ) : (
                        <dd>{row.value}</dd>
                      )}
                    </div>
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
          </div>
        </aside>
      </div>
    </main>
  );
}
