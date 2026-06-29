import Link from "next/link";
import styles from "./Breadcrumb.module.css";

export type BreadcrumbItem = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className={styles.wrap} aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className={styles.segment}>
          {item.href ? (
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span className={styles.current}>{item.label}</span>
          )}
          {i < items.length - 1 && <span className={styles.sep}>›</span>}
        </span>
      ))}
    </nav>
  );
}
