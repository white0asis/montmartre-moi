"use client";

import { useState, type FormEvent } from "react";
import styles from "./NewsletterForm.module.css";

/**
 * Footer email signup. No email-marketing provider is connected yet (that's
 * tracked separately under "Fonctionnalités transverses"), so this only
 * validates the field and shows a confirmation message locally — nothing is
 * sent anywhere. Swap the `handleSubmit` body for a real API call once a
 * provider (e.g. Mailchimp/Resend) is wired up.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  if (submitted) {
    return <p className={styles.confirmation}>Thanks — check your inbox to confirm.</p>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="your@email.com"
        aria-label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Subscribe
      </button>
    </form>
  );
}
