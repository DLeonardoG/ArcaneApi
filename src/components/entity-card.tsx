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
      {subtitle ? <p className="entity-card__eyebrow">{subtitle}</p> : null}
      <h3>{title}</h3>
      <p>{summary}</p>
    </Link>
  );
}
