import Image from "next/image";
import { sanityClient } from "@/sanity/client";
import { homepageQuery } from "@/sanity/queries";
import type { ArticleCardData, NavCategory } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import CategoryTile from "@/components/CategoryTile";
import Logo from "@/components/Logo";
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

      {categories.length > 0 && (
        <section className={styles.section}>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <CategoryTile key={cat._id} category={cat} />
            ))}
          </div>
        </section>
      )}

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
