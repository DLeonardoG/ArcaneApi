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