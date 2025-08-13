import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createArticle } from "@/lib/actions/articles";
import {
  createCharacter,
  createEpisode,
  createFaction,
  createLocation,
  createUniverse,
} from "@/lib/actions/studio";
import { canPublish } from "@/lib/engagement";
import { getUniverses } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Studio",
};

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function StudioPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!canPublish(session.user.role)) redirect("/profile");

  const { tab = "character" } = await searchParams;
  const universes = await getUniverses();

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>LoreVault Studio</h1>
        <p>
          Publish new universes, characters, episodes, places, factions,
          articles — and attach cover art.
        </p>
      </div>

      <nav className="studio-tabs">
        {[
          "character",
          "episode",