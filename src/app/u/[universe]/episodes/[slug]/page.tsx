import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEpisode } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe, slug } = await params;
  const episode = await getEpisode(universe, slug);
  if (!episode) return { title: "Episode" };
  return {
    title: `${episode.title} · ${episode.universe.name}`,
    description: episode.synopsis,
  };
}

export default async function EpisodePage({ params }: Props) {
  const { universe, slug } = await params;
  const episode = await getEpisode(universe, slug);
  if (!episode) notFound();

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>{episode.title}</h1>
        <p>
          Season {episode.season}, Episode {episode.number}
          {episode.airDate ? ` · ${episode.airDate}` : ""}