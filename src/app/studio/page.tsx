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
import { canPublish } from "@/lib/permissions";
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
          "location",
          "faction",
          "article",
          "universe",
        ].map((item) => (
          <Link
            key={item}
            href={`/studio?tab=${item}`}
            className={tab === item ? "chip chip-active" : "chip"}
          >
            {item}
          </Link>
        ))}
      </nav>

      {tab === "character" ? (
        <StudioForm title="New character" action={createCharacter}>
          <UniverseSelect universes={universes} />
          <Field name="name" label="Name" required />
          <Field name="slug" label="Slug" required placeholder="jinx" />
          <Field name="title" label="Title" placeholder="The loose cannon" />
          <Area name="summary" label="Summary" required />
          <Area name="bio" label="Bio" required rows={6} />
          <Field
            name="allegiances"
            label="Allegiances (comma-separated)"
            placeholder="Zaun, Silco"
          />
          <Field name="imageUrl" label="Cover image URL" type="url" />
        </StudioForm>
      ) : null}

      {tab === "episode" ? (
        <StudioForm title="New episode" action={createEpisode}>
          <UniverseSelect universes={universes} />
          <Field name="title" label="Title" required />
          <Field name="slug" label="Slug" required />
          <Field name="season" label="Season" type="number" required />
          <Field name="number" label="Episode number" type="number" required />
          <Area name="synopsis" label="Synopsis" required />
          <Field name="airDate" label="Air date" placeholder="2024-11-09" />
          <Field name="imageUrl" label="Cover image URL" type="url" />
        </StudioForm>
      ) : null}

      {tab === "location" ? (
        <StudioForm title="New location" action={createLocation}>
          <UniverseSelect universes={universes} />
          <Field name="name" label="Name" required />
          <Field name="slug" label="Slug" required />
          <Field name="region" label="Region" />
          <Area name="summary" label="Summary" required />
          <Area name="description" label="Description" required rows={6} />
          <Field name="imageUrl" label="Cover image URL" type="url" />
        </StudioForm>
      ) : null}

      {tab === "faction" ? (
        <StudioForm title="New faction" action={createFaction}>
          <UniverseSelect universes={universes} />
          <Field name="name" label="Name" required />
          <Field name="slug" label="Slug" required />
          <Area name="summary" label="Summary" required />
          <Area name="description" label="Description" required rows={6} />
          <Field name="imageUrl" label="Cover image URL" type="url" />
        </StudioForm>
      ) : null}

      {tab === "article" ? (
        <StudioForm title="New article" action={createArticle}>
          <UniverseSelect universes={universes} />
          <Field name="title" label="Title" required />
          <Field name="slug" label="Slug" required />
          <Area name="summary" label="Summary" required />
          <Area name="body" label="Body" required rows={10} />
        </StudioForm>
      ) : null}

      {tab === "universe" ? (
        <StudioForm title="New universe" action={createUniverse}>
          <Field name="name" label="Name" required />
          <Field name="slug" label="Slug" required />
          <Field name="tagline" label="Tagline" required />
          <Area name="description" label="Description" required rows={6} />
          <Field name="accent" label="Accent color" placeholder="#7dd3c0" />
          <Field name="coverUrl" label="Cover image URL" type="url" />
        </StudioForm>
      ) : null}