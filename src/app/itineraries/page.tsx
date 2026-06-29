import Link from "next/link";
import type { Metadata } from "next";
import { sanityClient } from "@/sanity/client";
import { itinerariesQuery } from "@/sanity/queries";
import Breadcrumb from "@/components/Breadcrumb";
import { difficultyLabel } from "@/lib/itinerary";
import styles from "./itineraries.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Itineraries — Curated Walks Through Montmartre",
  description:
    "A handful of ready-made routes through the Butte, each built around a theme, with every stop, café break and viewpoint already mapped out.",
};

type ItineraryListItem = {
  _id: string;
  title: string;
  slug: string;
  theme?: string;
  emoji?: string;
  tagline?: string;
  durationLabel?: string;
  distanceKm?: number;
  difficulty?: string;
  stopCount?: number;
};

// A small fixed set of gradients, cycled by index — mirrors the "Other
// itineraries" cards in the design, no per-itinerary art direction needed.
const GRADIENTS = [
  "linear-gradient(135deg, #C4622D 0%, #E8A87C 40%, #C4A882 70%, #7D9B76 100%)",
  "linear-gradient(135deg, #3D2B1F, #6B4F3A)",
  "linear-gradient(135deg, #2E3A4D, #5A6B7D)",
  "linear-gradient(135deg, #7D9B76, #B5CBAF)",
  "linear-gradient(135deg, #C4A882, #E8D5B0)",
];

export default async function ItinerariesPage() {
  const itineraries = await sanityClient.fetch<ItineraryListItem[]>(itinerariesQuery);

  return (
    <main>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Itineraries" }]} />

      <section className={styles.hero}>
        <span className={styles.eyebrow}>Curated walks</span>
        <h1 className={styles.title}>A few ways to see the Butte</h1>
        <p className={styles.intro}>
          Ready-made routes through Montmartre, each built around a theme and timed to the
          light, with every stop and café break already mapped out. Pick one and go.
        </p>
      </section>

      <section className={styles.grid}>
        {itineraries.length === 0 ? (
          <p className={styles.empty}>No itineraries published yet — check back soon.</p>
        ) : (
          itineraries.map((it, i) => (
            <Link key={it._id} href={`/itineraries/${it.slug}`} className={styles.card}>
              <div
                className={styles.cardThumb}
                style={{ background: GRADIENTS[i % GRADIENTS.length] }}
              >
                <span>{it.emoji ?? "🚶"}</span>
              </div>
              <div className={styles.cardBody}>
                {it.theme && <span className={styles.cardEyebrow}>{it.theme}</span>}
                <h2 className={styles.cardTitle}>{it.title}</h2>
                {it.tagline && <p className={styles.cardTagline}>{it.tagline}</p>}
                <div className={styles.cardMeta}>
                  {it.stopCount ? <span>{it.stopCount} stops</span> : null}
                  {it.durationLabel ? <span>{it.durationLabel}</span> : null}
                  {it.distanceKm ? <span>{it.distanceKm} km</span> : null}
                  {it.difficulty ? <span>{difficultyLabel(it.difficulty)}</span> : null}
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}
