import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUniverseBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  if (!universe) return { title: "Universe" };
  return {
    title: universe.name,
    description: universe.tagline,
  };
}

export default async function UniverseHubPage({ params }: Props) {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  if (!universe) notFound();

  const links = [
    { href: `/u/${slug}/characters`, label: "Characters", count: universe._count.characters },
    { href: `/u/${slug}/episodes`, label: "Episodes", count: universe._count.episodes },
    { href: `/u/${slug}/locations`, label: "Locations", count: universe._count.locations },
    { href: `/u/${slug}/factions`, label: "Factions", count: universe._count.factions },
    { href: `/u/${slug}/articles`, label: "Articles", count: universe._count.articles },
  ];

  return (
    <div className="shell">
      <div className="page-hero">
        <h1 style={{ color: universe.accent }}>{universe.name}</h1>
        <p>{universe.description}</p>
        <div className="meta-row">
          <span>{universe.tagline}</span>
        </div>
      </div>
      <div className="grid-cards">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="entity-card">
            <p className="entity-card__eyebrow">{link.count} entries</p>
            <h3>{link.label}</h3>
            <p>Browse the {link.label.toLowerCase()} of {universe.name}.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
