import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoriteTarget } from "@prisma/client";
import { auth } from "@/auth";
import { FavoriteButton } from "@/components/favorite-button";
import { getCharacter } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe, slug } = await params;
  const character = await getCharacter(universe, slug);
  if (!character) return { title: "Character" };
  return {
    title: `${character.name} · ${character.universe.name}`,