import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/sanity/image";
import { slugify } from "@/lib/portableText";
import styles from "./ArticleBody.module.css";

function textOf(children: unknown): string {
  if (!Array.isArray(children)) return "";
  return children
    .map((c) => (typeof c === "string" ? c : ""))
    .join("");
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => {
      const id = slugify(textOf(children));
      return (
        <h2 id={id} className={styles.h2}>
          {children}
        </h2>
      );
    },
    h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
    blockquote: ({ children }) => <blockquote className={styles.pullQuote}>{children}</blockquote>,
    normal: ({ children }) => <p className={styles.paragraph}>{children}</p>,
  },
  types: {
    image: ({ value }) => (
      <div className={styles.imageBlock}>
        <Image
          src={urlFor(value).width(1200).url()}
          alt={value.alt || ""}
          width={1200}
          height={800}
          className={styles.image}
        />
      </div>
    ),
  },
};

export default function ArticleBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className={styles.body}>
      <PortableText value={value} components={components} />
    </div>
  );
}
