import styles from "./PlanYourWalkCard.module.css";

export const PLAN_YOUR_WALK_URL = "https://montmartre-walk.vercel.app/";

const features = [
  "Pick what you’re after (history, art, religious places, iconic cinema locations).",
  "Set your pace and how long you’ve got on the hill.",
  "Choose to stop for a meal or a coffee at one of our recommended spots.",
];

/**
 * Shared CTA linking out to the standalone walk-generator app
 * (https://montmartre-walk.vercel.app/). Per product decision, this stays an
 * external link rather than an embedded interactive builder.
 *
 * - "banner": full-width two-column section (homepage).
 * - "compact": single card for sidebars (article, itinerary hub).
 */
export default function PlanYourWalkCard({
  variant = "banner",
}: {
  variant?: "banner" | "compact";
}) {
  if (variant === "compact") {
    return (
      <a
        href={PLAN_YOUR_WALK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open the Montmartre walk generator"
        className={styles.compactCard}
      >
        <span className={styles.eyebrow}>Montmartre Walk</span>
        <h3 className={styles.compactTitle}>Plan your walk</h3>
        <p className={styles.compactText}>
          Answer a few questions to build a tailor-made route through the streets of the
          Montmartre hill.
        </p>
        <span className={styles.cta}>Start</span>
      </a>
    );
  }

  return (
    <a
      href={PLAN_YOUR_WALK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open the Montmartre walk generator"
      className={styles.banner}
    >
      <div className={styles.text}>
        <p className={styles.intro}>
          Answer a few questions and we&rsquo;ll map a Montmartre route made just for you.
        </p>
        <ul className={styles.list}>
          {features.map((f) => (
            <li key={f}>
              <span className={styles.dot} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.visual}>
        <div className={styles.card}>
          <span className={styles.eyebrow}>Montmartre Walk</span>
          <h3 className={styles.cardTitle}>Plan your walk</h3>
          <p className={styles.cardText}>
            Answer a few questions to build a tailor-made route through the streets of the
            Montmartre hill.
          </p>
          <span className={styles.cta}>Start</span>
        </div>
      </div>
    </a>
  );
}
