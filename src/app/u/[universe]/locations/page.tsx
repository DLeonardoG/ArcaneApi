import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityCard } from "@/components/entity-card";
import { getLocations, getUniverseBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  return { title: universe ? `Locations · ${universe.name}` : "Locations" };
}

export default async function LocationsPage({ params }: Props) {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  if (!universe) notFound();
  const locations = await getLocations(slug);

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>Locations</h1>
        <p>Maps and memory of {universe.name}.</p>
      </div>
      <div className="grid-cards">
        {locations.map((location) => (
          <EntityCard
            key={location.id}
            href={`/u/${slug}/locations/${location.slug}`}
            title={location.name}
            subtitle={location.region ?? undefined}
            summary={location.summary}
            accent={universe.accent}
          />
        ))}
      </div>
    </div>
  );
}
