import Link from "next/link";
import type { Metadata } from "next";
import { sanityClient } from "@/sanity/client";
import { eventsQuery } from "@/sanity/queries";
import type { EventCategory, EventData } from "@/lib/types";
import Breadcrumb from "@/components/Breadcrumb";
import {
  eventDay,
  eventWeekday,
  eventMonth,
  eventDateLabel,
  eventDateShort,
  eventDateRange,
  eventCategoryLabel,
  googleCalendarUrl,
} from "@/lib/eventDates";
import styles from "./events.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events in Montmartre",
  description:
    "What's on this season on the hill — festivals, concerts, markets, and the weekly rituals worth showing up for.",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function buildHref(cat: string | undefined) {
  const qs = new URLSearchParams();
  if (cat) qs.set("cat", cat);
  const query = qs.toString();
  return query ? `?${query}` : "?";
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const events = await sanityClient.fetch<EventData[]>(eventsQuery);

  const now = Date.now();

  const oneOff = events
    .filter((e) => e.schedule !== "recurring" && e.startDate)
    .filter((e) => new Date(e.startDate!).getTime() >= now)
    .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());

  const recurring = events.filter((e) => e.schedule === "recurring");
  const featuredEvent = events.find((e) => e.featured);

  const [nextEvent, ...laterEvents] = oneOff;
  const upNext = laterEvents.slice(0, 2);

  // Category chips are derived from whatever categories are actually used by
  // upcoming events — same approach as the Category page's subcategory
  // filter, no separate taxonomy to keep in sync.
  const categoriesInUse = Array.from(
    new Set(oneOff.map((e) => e.category).filter((c): c is EventCategory => Boolean(c)))
  );

  const filtered = cat ? oneOff.filter((e) => e.category === cat) : oneOff;

  const monthGroups: { month: string; events: EventData[] }[] = [];
  for (const ev of filtered) {
    const month = eventMonth(ev.startDate!);
    let group = monthGroups.find((g) => g.month === month);
    if (!group) {
      group = { month, events: [] };
      monthGroups.push(group);
    }
    group.events.push(ev);
  }

  return (
    <main>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Events" }]} />

      <section className={styles.hero}>
        <div className={styles.heroIntro}>
          <span className={styles.eyebrow}>Events in Montmartre</span>
          <p className={styles.heroQuote}>
            The hill keeps its own calendar — harvest festivals, jazz nights, open-air cinema, and
            the slow rituals of a village that still throws a party for its grapes.
          </p>
          <p className={styles.heroText}>
            Everything worth showing up for this season, from one-off concerts on the
            Sacr&eacute;-C&oelig;ur steps to the markets and recitals that come around every week.
          </p>
        </div>

        <div className={styles.heroSide}>
          {nextEvent ? (
            <div className={styles.nextCard}>
              <span className={styles.nextLabel}>Next up</span>
              <span className={styles.nextDate}>{eventDateLabel(nextEvent.startDate!)}</span>
              {nextEvent.category && (
                <span className={styles.categoryTag}>{eventCategoryLabel(nextEvent.category)}</span>
              )}
              <h3 className={styles.nextTitle}>{nextEvent.title}</h3>
              <span className={styles.nextMeta}>
                {nextEvent.locationName}
                {nextEvent.locationName ? " · " : ""}
                {formatTime(nextEvent.startDate!)}
              </span>
              <a
                href={googleCalendarUrl(nextEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.calendarButton}
              >
                Add to calendar
              </a>
            </div>
          ) : (
            <p className={styles.emptyHero}>No upcoming events scheduled yet — check back soon.</p>
          )}

          {upNext.length > 0 && (
            <div className={styles.upNext}>
              <span className={styles.upNextLabel}>Then on the hill</span>
              {upNext.map((e) => (
                <div key={e._id} className={styles.upNextRow}>
                  <span className={styles.upNextDate}>{eventDateShort(e.startDate!)}</span>
                  <div className={styles.upNextInfo}>
                    <span className={styles.upNextTitle}>{e.title}</span>
                    <span className={styles.upNextMeta}>
                      {e.locationName}
                      {e.locationName ? " · " : ""}
                      {formatTime(e.startDate!)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionNumber}>01</span>What&rsquo;s on this season
        </h2>

        {categoriesInUse.length > 1 && (
          <nav aria-label="Filter events by category" className={styles.filterBar}>
            <Link href={buildHref(undefined)} className={!cat ? styles.chipActive : styles.chip}>
              All
            </Link>
            {categoriesInUse.map((c) => (
              <Link key={c} href={buildHref(c)} className={cat === c ? styles.chipActive : styles.chip}>
                {eventCategoryLabel(c)}
              </Link>
            ))}
          </nav>
        )}

        {monthGroups.length === 0 ? (
          <p className={styles.empty}>No upcoming events match this filter yet.</p>
        ) : (
          monthGroups.map((group) => (
            <div key={group.month} className={styles.monthGroup}>
              <div className={styles.monthHeading}>
                <span>{group.month}</span>
                <span className={styles.monthRule} />
              </div>
              {group.events.map((ev) => (
                <div key={ev._id} className={styles.eventRow}>
                  <div className={styles.eventDate}>
                    <span className={styles.eventDay}>{eventDay(ev.startDate!)}</span>
                    <span className={styles.eventWeekday}>{eventWeekday(ev.startDate!)}</span>
                  </div>
                  <div className={styles.eventInfo}>
                    {ev.category && (
                      <span className={styles.categoryTag}>{eventCategoryLabel(ev.category)}</span>
                    )}
                    <span className={styles.eventTitle}>{ev.title}</span>
                    <span className={styles.eventMeta}>
                      {ev.locationName}
                      {ev.locationName ? " · " : ""}
                      {formatTime(ev.startDate!)}
                    </span>
                  </div>
                  {ev.price && <span className={styles.eventPrice}>{ev.price}</span>}
                </div>
              ))}
            </div>
          ))
        )}
      </section>

      {featuredEvent && (
        <section className={styles.featuredSection}>
          <div className={styles.featuredInner}>
            <div className={styles.featuredText}>
              <span className={styles.featuredEyebrow}>Don&rsquo;t miss</span>
              <h2 className={styles.featuredTitle}>{featuredEvent.title}</h2>
              {featuredEvent.description && <p>{featuredEvent.description}</p>}
              {featuredEvent.officialWebsite && (
                <a
                  href={featuredEvent.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.featuredLink}
                >
                  See the full programme →
                </a>
              )}
            </div>
            <div className={styles.featuredFacts}>
              {featuredEvent.startDate && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>📅</span>
                  <span className={styles.factNumber}>
                    {eventDateRange(featuredEvent.startDate, featuredEvent.endDate)}
                  </span>
                  <span className={styles.factLabel}>When</span>
                </div>
              )}
              {featuredEvent.locationName && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>📍</span>
                  <span className={styles.factNumber}>{featuredEvent.locationName}</span>
                  <span className={styles.factLabel}>Where</span>
                </div>
              )}
              {featuredEvent.price && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>🎟️</span>
                  <span className={styles.factNumber}>{featuredEvent.price}</span>
                  <span className={styles.factLabel}>Price</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {recurring.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>02</span>Every week on the hill
          </h2>
          <div className={styles.recurringGrid}>
            {recurring.map((e) => (
              <div key={e._id} className={styles.recurringCard}>
                <div className={styles.recurringHead}>
                  <span className={styles.recurringName}>{e.title}</span>
                  {e.recurrenceText && <span className={styles.recurringWhen}>{e.recurrenceText}</span>}
                </div>
                {e.description && <p className={styles.recurringDescription}>{e.description}</p>}
                {e.officialWebsite && (
                  <a
                    href={e.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.recurringLink}
                  >
                    Details <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
