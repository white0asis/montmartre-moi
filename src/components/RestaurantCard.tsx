import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { RestaurantCardData } from "@/lib/types";
import styles from "./RestaurantCard.module.css";

export default function RestaurantCard({ restaurant }: { restaurant: RestaurantCardData }) {
  return (
    <article className={styles.card}>
      <Link href={`/restaurant/${restaurant.slug}`} className={styles.imageLink}>
        {restaurant.mainImage ? (
          <Image
            src={urlFor(restaurant.mainImage).width(800).height(480).url()}
            alt={restaurant.name}
            width={800}
            height={480}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
        {restaurant.priceRange && <span className={styles.priceBadge}>{restaurant.priceRange}</span>}
      </Link>
      <div className={styles.body}>
        {restaurant.cuisineType && <span className={styles.eyebrow}>{restaurant.cuisineType}</span>}
        <h3 className={styles.title}>
          <Link href={`/restaurant/${restaurant.slug}`}>{restaurant.name}</Link>
        </h3>
        {restaurant.shortTagline && <p className={styles.tagline}>{restaurant.shortTagline}</p>}
      </div>
    </article>
  );
}
