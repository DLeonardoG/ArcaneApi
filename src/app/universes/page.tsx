import type { Metadata } from "next";
import { EntityCard } from "@/components/entity-card";
import { getUniverses } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Universes",
  description: "Every saga archived in LoreVault.",
};

export default async function UniversesPage() {
  const universes = await getUniverses();

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>Universes</h1>
        <p>Pick a shelf. Arcane is live; other realms are waiting for lore.</p>
      </div>
      <div className="grid-cards">
        {universes.map((universe) => (
          <EntityCard
            key={universe.id}
            href={`/u/${universe.slug}`}
            title={universe.name}
            subtitle={universe.tagline}
            summary={universe.description}