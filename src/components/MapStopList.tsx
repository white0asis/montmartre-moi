import Link from "next/link";
import styles from "./MapStopList.module.css";

export type MapListItem = {
  /** When set, the row links out (e.g. to a place page). Plain text row otherwise. */
  href?: string;
  /** Emoji/icon marker. Ignored when `order` is set. */
  icon?: string;
  /** 1-based position — renders a numbered marker instead of an icon, for itinerary stops. */
  order?: number;
  name: string;
  /** e.g. "Museum · 8 min walk" or stop type. */
  subtitle?: string;
  /** Right-aligned meta, e.g. a distance label or "15 min". */
  meta?: string;
  /** Small badge next to the name, e.g. "MM Pick". */
  badge?: string;
};

/**
 * Shared "map + list" block used for a place's Nearby section and for an
 * itinerary's stop-by-stop route. Renders a Google Maps embed (optional)
 * followed by a list of rows — either icon-led (nearby) or numbered
 * (itinerary stops), controlled by whether each item has `order` set.
 */
export default function MapStopList({
  title,
  mapQuery,
  mapCaption,
  items,
}: {
  title: string;
  mapQuery?: string;
  mapCaption?: string;
  items: MapListItem[];
}) {
  if (items.length === 0 && !mapQuery) return null;

  return (
    <section className={styles.wrap}>
      {mapQuery && (
        <div className={styles.mapWrap}>
          <iframe
            title={`Map — ${title}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
            className={styles.map}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
      {mapCaption && <p className={styles.mapCaption}>{mapCaption}</p>}

      {items.length > 0 && (
        <div className={styles.list}>
          <h2 className={styles.listTitle}>{title}</h2>
          {items.map((item, i) => {
            const key = item.href ?? `${item.name}-${i}`;
            const numbered = item.order != null;
            const content = (
              <>
                <span className={numbered ? styles.markerNumbered : styles.marker}>
                  {numbered ? item.order : item.icon}
                </span>
                <span className={styles.info}>
                  <span className={styles.itemName}>
                    {item.name}
                    {item.badge && <span className={styles.badge}>{item.badge}</span>}
                  </span>
                  {item.subtitle && <span className={styles.subtitle}>{item.subtitle}</span>}
                </span>
                {item.meta && <span className={styles.meta}>{item.meta}</span>}
              </>
            );
            return item.href ? (
              <Link key={key} href={item.href} className={styles.item}>
                {content}
              </Link>
            ) : (
              <div key={key} className={styles.item}>
                {content}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
