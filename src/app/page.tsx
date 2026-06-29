import Image from "next/image";
import { sanityClient } from "@/sanity/client";
import { homepageQuery } from "@/sanity/queries";
import type { ArticleCardData, NavCategory } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import CategoryTile from "@/components/CategoryTile";
import Logo from "@/components/Logo";
import MapStopList from "@/components/MapStopList";
import PlanYourWalkCard from "@/components/PlanYourWalkCard";
import styles from "./page.module.css";

export const revalidate = 3600;

type HomepageData = {
  categories: NavCategory[];
  editorsPicks: ArticleCardData[];
  recent: ArticleCardData[];
};

const startHereSteps = [
  { step: "01", title: "Read the history", text: "Start with why Montmartre looks the way it does — village roots, the Commune, the artists who never left." },
  { step: "02", title: "Pick a walk", text: "No itinerary needed. Follow one neighborhood thread — street art, viewpoints, or quiet backstreets." },
  { step: "03", title: "Eat where locals eat", text: "Skip the tourist terraces on the Place du Tertre. Our restaurant guides point past them." },
  { step: "04", title: "Go off-peak", text: "Early morning or after 6pm — the same streets, a different Montmartre." },
];

// Static editorial facts — same pattern as `startHereSteps` above, no schema
// needed since this is fixed copy rather than per-article data.
const montmartreFacts = [
  { icon: "⛰️", number: "130m", label: "Above sea level", caption: "The highest point in Paris" },
  { icon: "🏛️", number: "1860", label: "Annexed by Paris", caption: "Independent for centuries before Haussmann’s redesign" },
  { icon: "🎨", number: "200+", label: "Artists lived here", caption: "Renoir, Picasso, Utrillo — all within a few streets" },
  { icon: "🍇", number: "1934", label: "The vineyard", caption: "The Clos Montmartre still harvests grapes every October" },
];

export default async function Home() {
  const data = await sanityClient.fetch<HomepageData>(homepageQuery);
  const { categories, editorsPicks, recent } = data;
  const [firstPick, ...otherPicks] = editorsPicks;

  return (
    <main>
      <section className={styles.hero}>
        <Logo height={88} />
        <h1 className={styles.heroTitle}>The way locals see it.</h1>
        <p className={styles.heroSubtitle}>
          Montmartre beyond the postcard — history, food, hidden gems and practical tips.
        </p>
      </section>

      {firstPick && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Editor&rsquo;s picks</h2>
          <div className={styles.picksGrid}>
            <ArticleCard article={firstPick} size="large" />
            <div className={styles.picksSecondary}>
              {otherPicks.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.planWalkSection}>
        <PlanYourWalkCard variant="banner" />
      </section>

      {categories.length > 0 && (
        <section className={styles.section}>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <CategoryTile key={cat._id} category={cat} />
            ))}
          </div>
        </section>
      )}

      <section className={styles.startHere}>
        <div className={styles.startHereInner}>
          <h2 className={styles.startHereTitle}>Start here</h2>
          <div className={styles.startHereGrid}>
            {startHereSteps.map((s) => (
              <div key={s.step} className={styles.startHereCard}>
                <span className={styles.startHereStep}>{s.step}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className={styles.section}>
          <MapStopList
            title="Explore the map"
            mapQuery="Montmartre, Paris"
            items={recent.slice(0, 5).map((article) => ({
              href: `/article/${article.slug}`,
              icon: "📍",
              name: article.title,
              subtitle: article.category?.title,
            }))}
          />
        </section>
      )}

      <section className={styles.aboutSection}>
        <div className={styles.aboutInner}>
          <div className={styles.aboutText}>
            <span className={styles.aboutEyebrow}>About Montmartre</span>
            <h2 className={styles.aboutTitle}>
              A village inside <em>a city</em>
            </h2>
            <p>
              Montmartre has always refused to be fully absorbed. Even after Haussmann&rsquo;s
              sweeping redesign of Paris, the hilltop village clung to its identity — narrow
              streets, village squares, the rhythm of neighborhood life.
            </p>
            <p>
              Today it remains Paris&rsquo;s most village-like neighborhood, where locals still
              gather in the same cafés their grandparents knew, and where the pace of life slows
              as the hill rises.
            </p>
          </div>
          <div className={styles.factsGrid}>
            {montmartreFacts.map((fact) => (
              <div key={fact.label} className={styles.factCard}>
                <span className={styles.factIcon}>{fact.icon}</span>
                <span className={styles.factNumber}>{fact.number}</span>
                <span className={styles.factLabel}>{fact.label}</span>
                <span className={styles.factCaption}>{fact.caption}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recently published</h2>
          <div className={styles.recentGrid}>
            {recent.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      )}

      <section className={styles.editorialBreak}>
        <Image
          src="/logo.png"
          alt=""
          width={140}
          height={114}
          className={styles.editorialIllustration}
        />
        <p className={styles.editorialQuote}>
          &ldquo;Montmartre doesn&rsquo;t reveal itself from a viewpoint. It reveals itself on foot,
          slowly, to the people willing to get a little lost.&rdquo;
        </p>
      </section>
    </main>
  );
}
