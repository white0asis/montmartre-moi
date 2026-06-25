import Link from "next/link";
import { getNavCategories } from "@/lib/categories";
import Logo from "./Logo";
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
          {categories.map((cat) => (
            <Link key={cat._id} href={`/category/${cat.slug}`}>
              {cat.name}
            </Link>
          ))}
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <a
          className={styles.instagram}
          href="https://instagram.com/montmartremoi"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow on Instagram
        </a>
      </div>

      <p className={styles.copyright}>© {year} Montmartre Moi. All rights reserved.</p>
    </footer>
  );
}
