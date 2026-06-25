import Link from "next/link";
import type { NavCategory } from "@/lib/types";
import styles from "./CategoryTile.module.css";

export default function CategoryTile({ category }: { category: NavCategory }) {
  return (
    <Link href={`/category/${category.slug}`} className={styles.tile}>
      <span className={styles.name}>{category.name}</span>
    </Link>
  );
}
