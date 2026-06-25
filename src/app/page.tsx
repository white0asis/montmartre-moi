import styles from "./page.module.css";

// Placeholder homepage — sera remplacée par l'export Claude Design
// (cahier des charges, section 6.1 Homepage : Hero, Catégories, Editor's
// picks, Start Here, Recently published, Editorial break).
export default function Home() {
  return (
    <main className={styles.hero}>
      <p className={styles.eyebrow}>Montmartre Moi</p>
      <h1 className={styles.title}>The way locals see it</h1>
      <p className={styles.subtitle}>
        Stack confirmée : Next.js 15 + design system (palette, Cormorant
        Garamond / Inter). Cette page d&rsquo;accueil sera remplacée par
        l&rsquo;export Claude Design (Phase 1).
      </p>
    </main>
  );
}
