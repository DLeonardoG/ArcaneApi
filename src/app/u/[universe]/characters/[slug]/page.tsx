import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoriteTarget } from "@prisma/client";
import { EntityEngagement } from "@/components/entity-engagement";
import { getCharacter } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe, slug } = await params;
  const character = await getCharacter(universe, slug);
  if (!character) return { title: "Character" };
  return {
    title: `${character.name} · ${character.universe.name}`,
    description: character.summary,
  };
}

export default async function CharacterPage({ params }: Props) {
  const { universe, slug } = await params;