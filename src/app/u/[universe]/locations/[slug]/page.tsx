import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoriteTarget } from "@prisma/client";
import { EntityEngagement } from "@/components/entity-engagement";
import { getLocation } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe, slug } = await params;
  const location = await getLocation(universe, slug);
  if (!location) return { title: "Location" };
  return {
    title: `${location.name} · ${location.universe.name}`,
    description: location.summary,
  };
}
