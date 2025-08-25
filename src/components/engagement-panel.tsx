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
        </div>
      )}

      <div className="engagement__toolbar">
        <div className="rating-summary">
          <strong>
            {engagement.ratingCount
              ? engagement.averageRating.toFixed(1)
              : "—"}
          </strong>
          <span>/ 5 · {engagement.ratingCount} ratings</span>
        </div>
        {userId ? (
          <FavoriteButton
            targetType={targetType}
            targetId={targetId}
            path={path}
            active={engagement.isFavorite}
          />
        ) : (
          <p className="muted">Sign in to favorite, rate, and comment.</p>
        )}
      </div>

      {userId ? (
        <form className="rating-form" action={upsertRating}>
          <input type="hidden" name="targetType" value={targetType} />
          <input type="hidden" name="targetId" value={targetId} />
          <input type="hidden" name="path" value={path} />
          <label>
            Your rating
            <select
              name="score"
              defaultValue={engagement.userScore ?? 5}
              required
            >
              {[5, 4, 3, 2, 1].map((score) => (
                <option key={score} value={score}>
                  {score} star{score === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </label>
          <button className="btn" type="submit">
            Save rating
          </button>
        </form>
      ) : null}

      <div className="gallery">
        <h3>Gallery</h3>
        {engagement.media.length === 0 ? (
          <p className="muted">No images yet.</p>
        ) : (
          <div className="gallery__grid">
            {engagement.media.map((item) => (
              <figure key={item.id} className="gallery__item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.alt || "Gallery image"} />
                {item.caption ? <figcaption>{item.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        )}

        {userId ? (
          <form className="form-stack panel" action={addMediaAsset}>
            <input type="hidden" name="targetType" value={targetType} />
            <input type="hidden" name="targetId" value={targetId} />
            <input type="hidden" name="path" value={path} />
            {universeId ? (
              <input type="hidden" name="universeId" value={universeId} />
            ) : null}
            <h4 style={{ margin: 0 }}>Add image</h4>