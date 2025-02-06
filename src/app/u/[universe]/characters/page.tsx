import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityCard } from "@/components/entity-card";
import { getCharacters, getUniverseBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  return { title: universe ? `Characters · ${universe.name}` : "Characters" };
}

export default async function CharactersPage({ params }: Props) {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  if (!universe) notFound();
  const characters = await getCharacters(slug);

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>Characters</h1>
        <p>Faces of {universe.name}.</p>
      </div>
      <div className="grid-cards">
        {characters.map((character) => (
          <EntityCard
            key={character.id}
            href={`/u/${slug}/characters/${character.slug}`}
            title={character.name}