import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "@/sanity/client";
import { homepageQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import type { ArticleCardData } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import CategoryTile, { type HomeCategory } from "@/components/CategoryTile";
import PlanYourWalkCard from "@/components/PlanYourWalkCard";
import FaqAccordion from "@/components/FaqAccordion";
import styles from "./page.module.css";

export const revalidate = 3600;

type HomepageData = {
  categories: HomeCategory[];
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

// Static FAQ copy — practical visitor questions, fixed editorial content like
// `startHereSteps`/`montmartreFacts` above, no schema needed.
const faqs = [
  { q: "When is the best time to visit Montmartre?", a: "Early morning, before 10am, or after 6pm — the streets empty out and the light on the Sacré-Cœur is at its best." },
  { q: "Do I need to book the funicular in advance?", a: "No. It runs on a standard Métro ticket and you can tap in on the spot. A single ticket covers one ride up the hill." },
  { q: "Is Montmartre walkable for everyone?", a: "It's steep in places, with plenty of stairs. Our walk generator can build a gentler route that leans on the funicular and flatter streets." },
  { q: "Where should I avoid eating?", a: "The terraces ringing the Place du Tertre are tourist traps. Step one street back — our Eat & Drink guides point you there." },
  { q: "How long should I plan for a visit?", a: "A focused walk takes about two hours. Half a day lets you slow down for a café stop and a viewpoint or two." },
];

export default async function Home() {
  const data = await sanityClient.fetch<HomepageData>(homepageQuery);
  const { categories, editorsPicks, recent } = data;
  const [firstPick, ...otherPicks] = editorsPicks;
  const favorites = recent.slice(0, 4);
  const mapArticles = recent.slice(0, 5);

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowLine} />
            An English guide to Montmartre
            <span className={styles.heroEyebrowLine} />
          </span>
          <h1 className={styles.heroQuote}>
            Discover Montmartre through the eyes of those who call it home. Beyond the postcard
            views, find the quiet corners, the neighborhood bistros, the stories written into its
            cobblestones.
          </h1>
          <p className={styles.heroBody}>
            We&rsquo;ve spent years walking these streets, talking to locals, and documenting what
            makes this hilltop neighborhood feel alive. This is Montmartre the way we know
            it—unfiltered, authentic, and endlessly surprising.
          </p>
        </div>
        <div className={styles.heroImageWrap}>
          <Image
            src="/painter-montmartre.png"
            alt="Painter painting Montmartre and Sacré-Cœur"
            width={640}
            height={480}
            className={styles.heroImage}
            priority
          />
        </div>
      </section>

      {firstPick && (
        <section className={styles.section}>
          <div className={styles.numberedHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>01</span>Editor&rsquo;s picks
            </h2>
          </div>
          <div className={styles.picksGrid}>
            <ArticleCard article={firstPick} size="large" />
            <div className={styles.picksSecondary}>
              {otherPicks.map((article) => (
                <article key={article._id} className={styles.secondaryPick}>
                  <Link href={`/article/${article.slug}`} className={styles.secondaryPickImage}>
                    {article.mainImage ? (
                      <Image
                        src={urlFor(article.mainImage).width(208).height(208).url()}
                        alt={article.title}
                        width={104}
                        height={104}
                      />
                    ) : (
                      <div className={styles.secondaryPickPlaceholder} />
                    )}
                  </Link>
                  <div className={styles.secondaryPickBody}>
                    {article.category && (
                      <Link href={`/category/${article.category.slug}`} className={styles.secondaryPickEyebrow}>
                        {article.category.title}
                      </Link>
                    )}
                    <h3 className={styles.secondaryPickTitle}>
                      <Link href={`/article/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <div className={styles.secondaryPickMeta}>
                      {article.author?.name && <span>{article.author.name}</span>}
                      {article.readingTime ? <span>{article.readingTime} min read</span> : null}
                    </div>
                  </div>
                </article>
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
          <h2 className={styles.startHereTitle}>
            <span className={styles.sectionNumber}>02</span>Start here
          </h2>
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
          <div className={styles.mapArticlesGrid}>
            <div className={styles.mapSticky}>
              <div className={styles.mapFrame}>
                <Image
                  src="/Montmartre%20carte%20dessin.png"
                  alt="Illustrated map of Montmartre's key landmarks"
                  fill
                  className={styles.mapEmbed}
                />
              </div>
              <Link href="/itineraries" className={styles.mapCta}>
                Your Route Through Montmartre&rsquo;s Icons →
              </Link>
            </div>
            <div>
              <h2 className={styles.numberedHeaderInline}>
                <span className={styles.sectionNumber}>↗</span>Explore the map
              </h2>
              <div className={styles.mapList}>
                {mapArticles.map((article) => (
                  <Link key={article._id} href={`/article/${article.slug}`} className={styles.mapListItem}>
                    {article.mainImage ? (
                      <Image
                        src={urlFor(article.mainImage).width(144).height(144).url()}
                        alt=""
                        width={72}
                        height={72}
                        className={styles.mapListThumb}
                      />
                    ) : (
                      <div className={styles.mapListThumbPlaceholder} />
                    )}
                    <span className={styles.mapListTitle}>{article.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
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
            <Link href="/about" className={styles.aboutCta}>
              Read the full history →
            </Link>
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

      {favorites.length > 0 && (
        <section className={styles.section}>
          <div className={styles.favoritesFaqGrid}>
            <div>
              <h2 className={styles.numberedHeaderInline}>
                <span className={styles.sectionNumber}>★</span>Our favorites
              </h2>
              <div className={styles.favoritesGrid}>
                {favorites.map((article) => (
                  <Link key={article._id} href={`/article/${article.slug}`} className={styles.favoriteCard}>
                    {article.mainImage ? (
                      <Image
                        src={urlFor(article.mainImage).width(480).height(360).url()}
                        alt=""
                        fill
                        className={styles.favoriteImage}
                      />
                    ) : (
                      <div className={styles.favoritePlaceholder} />
                    )}
                    <span className={styles.favoriteOverlay} />
                    <span className={styles.favoriteText}>
                      {article.category && (
                        <span className={styles.favoriteEyebrow}>{article.category.title}</span>
                      )}
                      <span className={styles.favoriteTitle}>{article.title}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className={styles.numberedHeaderInline}>
                <span className={styles.sectionNumber}>?</span>Good to know
              </h2>
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className={styles.section}>
          <div className={styles.numberedHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>04</span>Recently published
            </h2>
          </div>
          <div className={styles.recentGrid}>
            {recent.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
