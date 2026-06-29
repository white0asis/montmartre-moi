import Link from "next/link";
import { getNavCategories } from "@/lib/categories";
import Logo from "./Logo";
import MobileNavToggle from "./MobileNavToggle";
import styles from "./Nav.module.css";

export default async function Nav() {
  const categories = await getNavCategories();

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <Logo height={40} />

        <nav className={styles.links} aria-label="Primary">
          {categories.map((cat) => (
            <Link key={cat._id} href={`/category/${cat.slug}`}>
              {cat.name}
            </Link>
          ))}
          <Link href="/events">Events</Link>
          <Link href="/about">About</Link>
          <Link href="/itineraries" className={styles.buildWalk}>
            Build your walk
          </Link>
        </nav>

        <MobileNavToggle categories={categories} />
      </div>
    </header>
  );
}
