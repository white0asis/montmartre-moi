import Link from "next/link";
import styles from "./CategoryTile.module.css";

export type HomeCategory = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  articleCount: number;
};

export default function CategoryTile({ category }: { category: HomeCategory }) {
  return (
    <Link href={`/category/${category.slug}`} className={styles.tile}>
      <div className={styles.heading}>
        <span className={styles.name}>{category.name}</span>
        <span className={styles.count}>{category.articleCount} articles</span>
      </div>
      {category.shortDescription && <p className={styles.description}>{category.shortDescription}</p>}
      <span className={styles.cta}>
        Explore <span className={styles.arrow}>→</span>
      </span>
    </Link>
  );
}
