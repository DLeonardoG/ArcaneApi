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