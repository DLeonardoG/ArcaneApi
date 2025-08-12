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