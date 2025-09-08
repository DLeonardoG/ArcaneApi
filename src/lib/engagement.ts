import { FavoriteTarget } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getEngagement(
  targetType: FavoriteTarget,
  targetId: string,
  userId?: string,
) {
  const [comments, ratingAgg, userRating, favorite, media] = await Promise.all([
    prisma.comment.findMany({
      where: { targetType, targetId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { id: true, name: true } } },
    }),
    prisma.rating.aggregate({
      where: { targetType, targetId },
      _avg: { score: true },
      _count: { score: true },
    }),
    userId
      ? prisma.rating.findUnique({
          where: {
            userId_targetType_targetId: { userId, targetType, targetId },
          },
        })
      : Promise.resolve(null),
    userId
      ? prisma.favorite.findUnique({
          where: {
            userId_targetType_targetId: { userId, targetType, targetId },
          },
        })
      : Promise.resolve(null),
    prisma.mediaAsset.findMany({
      where: { targetType, targetId },
      orderBy: [{ isCover: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return {
    comments,
    averageRating: ratingAgg._avg.score ?? 0,
    ratingCount: ratingAgg._count.score,
    userScore: userRating?.score ?? null,
    isFavorite: Boolean(favorite),
    media,
  };
}

export function canPublish(role?: string) {
  return role === "EDITOR" || role === "ADMIN";
}
