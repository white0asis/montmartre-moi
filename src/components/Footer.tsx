import Link from "next/link";
import { getNavCategories } from "@/lib/categories";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import styles from "./Footer.module.css";

export default async function Footer() {
  const categories = await getNavCategories();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo height={44} />
          <p className={styles.tagline}>The way locals see it.</p>
        </div>

        <nav className={styles.links} aria-label="Footer">
          <span className={styles.colLabel}>Explore</span>
          {categories.map((cat) => (
            <Link key={cat._id} href={`/category/${cat.slug}`}>
              {cat.name}
            </Link>
          ))}
          <Link href="/about">About</Link>
        </nav>

        <div className={styles.newsletter}>
          <span className={styles.colLabel}>The newsletter</span>
          <p className={styles.newsletterText}>
            One email a month — a new walk, a place worth your time, no noise.
          </p>
          {/*
            Visual only for now: no email-marketing provider is wired up yet
            (tracked under "Fonctionnalités transverses"). Submitting just
            shows a confirmation message rather than posting anywhere.
          */}
          <NewsletterForm />
        </div>
      </div>

      <div className={styles.bottomRow}>
        <p className={styles.copyright}>© {year} Montmartre Moi. All rights reserved.</p>
        <div className={styles.bottomLinks}>
          <a
            href="https://instagram.com/montmartremoi"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
