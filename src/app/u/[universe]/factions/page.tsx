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