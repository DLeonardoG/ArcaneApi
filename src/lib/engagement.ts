import { FavoriteTarget } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export { canPublish, canUploadMedia } from "@/lib/permissions";

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