import Image from "next/image";
import Link from "next/link";

export default function Logo({ height = 48 }: { height?: number }) {
  // Source image is square-ish (1139x928); scale width proportionally.
  const width = Math.round(height * (1139 / 928));
  return (
    <Link href="/" aria-label="Montmartre Moi — home" style={{ display: "inline-flex" }}>
      <Image
        src="/logo.png"
        alt="Montmartre Moi"
        height={height}
        width={width}
        priority
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}
