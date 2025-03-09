import { prisma } from "@/lib/prisma";

export async function getUniverses() {
  return prisma.universe.findMany({
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });
}

export async function getUniverseBySlug(slug: string) {
  return prisma.universe.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          characters: true,
          episodes: true,
          locations: true,
          factions: true,
          articles: true,
        },
      },
    },
  });
}

export async function getCharacters(universeSlug: string) {
  return prisma.character.findMany({
    where: { universe: { slug: universeSlug } },
    orderBy: { name: "asc" },
  });
}

export async function getCharacter(universeSlug: string, slug: string) {
  return prisma.character.findFirst({
    where: { slug, universe: { slug: universeSlug } },
    include: { universe: true },
  });
}

export async function getEpisodes(universeSlug: string) {
  return prisma.episode.findMany({
    where: { universe: { slug: universeSlug } },
    orderBy: [{ season: "asc" }, { number: "asc" }],
  });
}

export async function getEpisode(universeSlug: string, slug: string) {
  return prisma.episode.findFirst({
    where: { slug, universe: { slug: universeSlug } },
    include: { universe: true },
  });
}

export async function getLocations(universeSlug: string) {
  return prisma.location.findMany({
    where: { universe: { slug: universeSlug } },
    orderBy: { name: "asc" },
  });
}

export async function getLocation(universeSlug: string, slug: string) {
  return prisma.location.findFirst({
    where: { slug, universe: { slug: universeSlug } },
    include: { universe: true },
  });
}

export async function getFactions(universeSlug: string) {
  return prisma.faction.findMany({
    where: { universe: { slug: universeSlug } },
    orderBy: { name: "asc" },
  });
}

export async function getFaction(universeSlug: string, slug: string) {
  return prisma.faction.findFirst({
    where: { slug, universe: { slug: universeSlug } },
    include: { universe: true },
  });
}

export async function getArticles(universeSlug: string) {
  return prisma.article.findMany({
    where: { universe: { slug: universeSlug }, published: true },
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
  });
}

export async function getArticle(universeSlug: string, slug: string) {
  return prisma.article.findFirst({
    where: { slug, universe: { slug: universeSlug }, published: true },
    include: {
      universe: true,
      author: { select: { name: true } },
    },
  });
}

export async function searchLore(query: string) {
  const q = query.trim();
  if (!q) {
    return {
      characters: [],
      episodes: [],
      articles: [],
      locations: [],
    };
  }

  const [characters, episodes, articles, locations] = await Promise.all([
    prisma.character.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 12,
      include: { universe: { select: { slug: true, name: true } } },