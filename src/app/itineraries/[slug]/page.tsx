import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/sanity/client";
import { itineraryBySlugQuery, itinerarySlugsQuery } from "@/sanity/queries";
import type { ItineraryData } from "@/lib/types";
import Breadcrumb from "@/components/Breadcrumb";
import ArticleBody from "@/components/ArticleBody";
import { difficultyLabel, googleMapsSearchUrl } from "@/lib/itinerary";
import styles from "./itinerary.module.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(itinerarySlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

async function getItinerary(slug: string) {
  return sanityClient.fetch<ItineraryData | null>(itineraryBySlugQuery, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const itinerary = await getItinerary(slug);
  if (!itinerary) return {};
  return {
    title: itinerary.title,
    description: itinerary.tagline,
  };
}

export default async function ItineraryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const itinerary = await getItinerary(slug);
  if (!itinerary) notFound();

  const stops = itinerary.stops ?? [];

  return (
    <main>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Itineraries", href: "/itineraries" },
          { label: itinerary.title },
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroText}>
          {itinerary.tagline && <span className={styles.eyebrow}>{itinerary.tagline}</span>}
          <h1 className={styles.title}>{itinerary.title}</h1>
          {itinerary.description && (
            <div className={styles.description}>
              <ArticleBody value={itinerary.description} />
            </div>
          )}
          <div className={styles.badges}>
            {itinerary.durationLabel && <span className={styles.badge}>🕐 {itinerary.durationLabel}</span>}
            {stops.length > 0 && <span className={styles.badge}>📍 {stops.length} stops</span>}
            {itinerary.distanceKm && <span className={styles.badge}>🚶 {itinerary.distanceKm} km</span>}
            {itinerary.difficulty && (
              <span className={styles.badgeAccent}>{difficultyLabel(itinerary.difficulty)}</span>
            )}
          </div>
          {itinerary.startPoint && (
            <a
              href={googleMapsSearchUrl(itinerary.startPoint)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapButton}
            >
              Open in Google Maps ↗
            </a>
          )}
        </div>
        <div className={styles.heroArt}>
          <span>{itinerary.emoji ?? "🚶"}</span>
        </div>
      </section>

      <div className={styles.layout}>
        <div className={styles.main}>
          {itinerary.whatWeLove && itinerary.whatWeLove.length > 0 && (
            <section className={styles.loveBox}>
              <h2 className={styles.loveTitle}>What we love about this walk</h2>
              {itinerary.whatWeLove.map((item, i) => (
                <div key={i} className={styles.loveItem}>
                  {item.icon && <span className={styles.loveIcon}>{item.icon}</span>}
                  <div>
                    {item.title && <strong className={styles.loveItemTitle}>{item.title}</strong>}
                    {item.text && <p className={styles.loveItemText}>{item.text}</p>}
                  </div>
                </div>
              ))}
            </section>
          )}

          {stops.length > 0 && (
            <section className={styles.stopsSection}>
              <h2 className={styles.sectionTitle}>What you&rsquo;ll find on this walk</h2>
              <ol className={styles.stopsList}>
                {stops.map((stop, i) => {
                  const meta = [stop.stopType, stop.duration, stop.walkTime].filter(Boolean).join(" · ");
                  const href = stop.place ? `/${stop.place._type}/${stop.place.slug}` : undefined;
                  return (
                    <li key={i} className={styles.stop}>
                      <span className={styles.stopNumber}>{i + 1}</span>
                      <div className={styles.stopBody}>
                        <div className={styles.stopHead}>
                          {href ? (
                            <Link href={href} className={styles.stopName}>
                              {stop.name}
                            </Link>
                          ) : (
                            <span className={styles.stopName}>{stop.name}</span>
                          )}
                          {stop.badge && <span className={styles.stopBadge}>{stop.badge}</span>}
                        </div>
                        {meta && <div className={styles.stopMeta}>{meta}</div>}
                        {stop.description && <p className={styles.stopDescription}>{stop.description}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          {itinerary.whatYouShouldKnow && itinerary.whatYouShouldKnow.length > 0 && (
            <section className={styles.knowSection}>
              <h2 className={styles.sectionTitle}>What you should know</h2>
              <div className={styles.knowGrid}>
                {itinerary.whatYouShouldKnow.map((item, i) => (
                  <div key={i} className={styles.knowCard}>
                    <div className={styles.knowHead}>
                      {item.icon && <span className={styles.knowIcon}>{item.icon}</span>}
                      {item.title && <strong>{item.title}</strong>}
                    </div>
                    {item.text && <p>{item.text}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {itinerary.relatedItineraries && itinerary.relatedItineraries.length > 0 && (
            <section className={styles.otherSection}>
              <h2 className={styles.sectionTitle}>Other ways to see the Butte</h2>
              <div className={styles.otherGrid}>
                {itinerary.relatedItineraries.map((rel) => (
                  <Link key={rel._id} href={`/itineraries/${rel.slug}`} className={styles.otherCard}>
                    <span className={styles.otherEmoji}>{rel.emoji ?? "🚶"}</span>
                    <div>
                      {rel.theme && <span className={styles.otherEyebrow}>{rel.theme}</span>}
                      <span className={styles.otherTitle}>{rel.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.glanceCard}>
            <div className={styles.glanceHead}>The route at a glance</div>
            {itinerary.durationLabel && (
              <div className={styles.glanceRow}>
                <span>🕐</span>
                <div>
                  <div className={styles.glanceLabel}>Total time</div>
                  <div className={styles.glanceValue}>{itinerary.durationLabel}</div>
                </div>
              </div>
            )}
            {(stops.length > 0 || itinerary.distanceKm) && (
              <div className={styles.glanceRow}>
                <span>📍</span>
                <div>
                  <div className={styles.glanceLabel}>Stops &amp; distance</div>
                  <div className={styles.glanceValue}>
                    {stops.length} stops{itinerary.distanceKm ? ` · ${itinerary.distanceKm} km on foot` : ""}
                  </div>
                </div>
              </div>
            )}
            {itinerary.startPoint && (
              <div className={styles.glanceRow}>
                <span>🚇</span>
                <div>
                  <div className={styles.glanceLabel}>Start</div>
                  <div className={styles.glanceValue}>
                    {itinerary.startPoint}
                    {itinerary.startMetro && (
                      <>
                        <br />
                        {itinerary.startMetro}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            {itinerary.bestTime && (
              <div className={styles.glanceRow}>
                <span>🌤️</span>
                <div>
                  <div className={styles.glanceLabel}>Best time</div>
                  <div className={styles.glanceValue}>{itinerary.bestTime}</div>
                </div>
              </div>
            )}
            {itinerary.difficulty && (
              <div className={styles.glanceRow}>
                <span>🥾</span>
                <div>
                  <div className={styles.glanceLabel}>Difficulty</div>
                  <div className={styles.glanceValue}>{difficultyLabel(itinerary.difficulty)}</div>
                </div>
              </div>
            )}
          </div>

          {itinerary.tip && (
            <div className={styles.tipBox}>
              <span className={styles.tipLabel}>Montmartre Moi tip</span>
              <p>{itinerary.tip}</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
