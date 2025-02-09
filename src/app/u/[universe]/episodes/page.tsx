import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityCard } from "@/components/entity-card";
import { getEpisodes, getUniverseBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  return { title: universe ? `Episodes · ${universe.name}` : "Episodes" };
}

export default async function EpisodesPage({ params }: Props) {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  if (!universe) notFound();
  const episodes = await getEpisodes(slug);

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>Episodes</h1>
        <p>Season beats for {universe.name}.</p>
      </div>
      <div className="grid-cards">
        {episodes.map((episode) => (
          <EntityCard
            key={episode.id}
            href={`/u/${slug}/episodes/${episode.slug}`}
            title={episode.title}
            subtitle={`S${episode.season}E${episode.number}`}
            summary={episode.synopsis}
            accent={universe.accent}
          />
        ))}
      </div>
    </div>
  );
}
