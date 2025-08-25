import { FavoriteTarget } from "@prisma/client";
import { FavoriteButton } from "@/components/favorite-button";
import { addComment, deleteComment } from "@/lib/actions/comments";
import { addMediaAsset } from "@/lib/actions/media";
import { upsertRating } from "@/lib/actions/ratings";
import { getEngagement } from "@/lib/engagement";

type Props = {
  targetType: FavoriteTarget;
  targetId: string;
  universeId?: string;
  path: string;
  userId?: string;
  canEditCover?: boolean;
  coverUrl?: string | null;
};

export async function EngagementPanel({
  targetType,
  targetId,
  universeId,
  path,
  userId,
  canEditCover,
  coverUrl,
}: Props) {
  const engagement = await getEngagement(targetType, targetId, userId);

  return (
    <section className="engagement">
      {(coverUrl || engagement.media[0]) && (
        <div className="cover-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl || engagement.media[0]?.url}
            alt={engagement.media[0]?.alt || "Cover"}
          />