import Link from "next/link";

export function EntityCard({
  href,
  title,
  subtitle,
  summary,
  accent,
}: {
  href: string;
  title: string;
  subtitle?: string;
  summary: string;
  accent?: string;
}) {
  return (
    <Link
      href={href}
      className="entity-card"
      style={accent ? ({ ["--card-accent" as string]: accent } as React.CSSProperties) : undefined}
    >