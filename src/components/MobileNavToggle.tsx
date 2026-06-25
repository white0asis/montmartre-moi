"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavCategory } from "@/lib/categories";
import styles from "./MobileNavToggle.module.css";

export default function MobileNavToggle({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.hamburger} ${open ? styles.isOpen : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className={styles.overlay}>
          <nav className={styles.overlayNav}>
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            {categories.map((cat) => (
              <Link key={cat._id} href={`/category/${cat.slug}`} onClick={() => setOpen(false)}>
                {cat.name}
              </Link>
            ))}
            <Link href="/about" onClick={() => setOpen(false)}>
              About
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
