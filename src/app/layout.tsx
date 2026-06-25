import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

// Titres (H1, H2, H3) — Cormorant Garamond, serif
const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Corps de texte — Inter, sans-serif
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Montmartre Moi — The way locals see it.",
    template: "%s | Montmartre Moi",
  },
  description:
    "Montmartre Moi — an English-language travel blog uncovering Montmartre beyond the postcard: history, food, hidden gems and practical tips, the way locals see it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${inter.variable}`}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
