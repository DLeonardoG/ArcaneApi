import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [favorites, ratings, comments] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
    prisma.rating.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.comment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const characterIds = favorites
    .filter((item) => item.targetType === "CHARACTER")
    .map((item) => item.targetId);
  const episodeIds = favorites
    .filter((item) => item.targetType === "EPISODE")
    .map((item) => item.targetId);
  const articleIds = favorites
    .filter((item) => item.targetType === "ARTICLE")
    .map((item) => item.targetId);

  const [characters, episodes, articles] = await Promise.all([
    characterIds.length
      ? prisma.character.findMany({
          where: { id: { in: characterIds } },
          include: { universe: { select: { slug: true, name: true } } },
        })
      : Promise.resolve([]),
    episodeIds.length
      ? prisma.episode.findMany({
          where: { id: { in: episodeIds } },
          include: { universe: { select: { slug: true, name: true } } },
        })
      : Promise.resolve([]),
    articleIds.length
      ? prisma.article.findMany({
          where: { id: { in: articleIds } },
          include: { universe: { select: { slug: true, name: true } } },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>{session.user.name ?? "Fan"}</h1>
        <p>
          {session.user.email} · role {session.user.role}
        </p>
      </div>

      <section className="panel profile-section">
        <h2>Favorites</h2>
        {characters.length + episodes.length + articles.length === 0 ? (
          <p className="muted">No favorites yet. Save lore from any detail page.</p>
        ) : (
          <ul>
            {characters.map((character) => (
              <li key={character.id}>
                <Link
                  href={`/u/${character.universe.slug}/characters/${character.slug}`}
                >
                  {character.name} · {character.universe.name}
                </Link>
              </li>