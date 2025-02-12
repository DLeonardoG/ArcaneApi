import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityCard } from "@/components/entity-card";
import { getFactions, getUniverseBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  return { title: universe ? `Factions · ${universe.name}` : "Factions" };
}

export default async function FactionsPage({ params }: Props) {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  if (!universe) notFound();
  const factions = await getFactions(slug);

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>Factions</h1>
        <p>Powers that shape {universe.name}.</p>
      </div>
      <div className="grid-cards">
        {factions.map((faction) => (
          <EntityCard
            key={faction.id}
            href={`/u/${slug}/factions/${faction.slug}`}
            title={faction.name}
            summary={faction.summary}
            accent={universe.accent}
          />
        ))}
      </div>
    </div>
  );
}
