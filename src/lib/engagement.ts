import { FavoriteTarget } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export { canPublish, canUploadMedia } from "@/lib/permissions";

export async function getEngagement(
  targetType: FavoriteTarget,
  targetId: string,
  userId?: string,
) {
  const [comments, ratingAgg, userRating, favorite, media] = await Promise.all([