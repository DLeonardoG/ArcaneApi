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