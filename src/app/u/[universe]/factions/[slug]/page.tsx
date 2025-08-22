import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoriteTarget } from "@prisma/client";
import { EntityEngagement } from "@/components/entity-engagement";
import { getFaction } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe, slug } = await params;
  const faction = await getFaction(universe, slug);
  if (!faction) return { title: "Faction" };
  return {
    title: `${faction.name} · ${faction.universe.name}`,
    description: faction.summary,
  };
}

export default async function FactionPage({ params }: Props) {
  const { universe, slug } = await params;
  const faction = await getFaction(universe, slug);
  if (!faction) notFound();

  const path = `/u/${universe}/factions/${slug}`;

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>{faction.name}</h1>
        <p>{faction.summary}</p>
      </div>
      <article className="panel prose-lite">
        <p>{faction.description}</p>
      </article>
      <EntityEngagement
        targetType={FavoriteTarget.FACTION}
        targetId={faction.id}
        universeId={faction.universeId}
        path={path}
        coverUrl={faction.imageUrl}
      />
    </div>
  );
}
