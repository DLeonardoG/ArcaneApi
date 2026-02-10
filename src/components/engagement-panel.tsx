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

        {canEditCover ? (
          <form className="form-stack panel" action={addMediaAsset}>
            <input type="hidden" name="targetType" value={targetType} />
            <input type="hidden" name="targetId" value={targetId} />
            <input type="hidden" name="path" value={path} />
            {universeId ? (
              <input type="hidden" name="universeId" value={universeId} />
            ) : null}
            <h4 style={{ margin: 0 }}>Add image (editors only)</h4>
            <label>
              Image URL
              <input name="url" type="url" placeholder="https://..." />
            </label>
            <label>
              Or upload file
              <input name="file" type="file" accept="image/*" />
            </label>
            <label>
              Alt text
              <input name="alt" maxLength={160} />
            </label>
            <label>
              Caption
              <input name="caption" maxLength={280} />
            </label>
            <label className="checkbox-row">
              <input name="isCover" type="checkbox" />
              Set as cover
            </label>
            <button className="btn btn-primary" type="submit">
              Upload image
            </button>
          </form>
        ) : userId ? (
          <p className="muted">
            Image uploads are reserved for editors. Request editor access from
            your profile.
          </p>
        ) : null}
      </div>

      <div className="comments">
        <h3>Comments</h3>
        {userId ? (
          <form className="form-stack" action={addComment}>
            <input type="hidden" name="targetType" value={targetType} />
            <input type="hidden" name="targetId" value={targetId} />
            <input type="hidden" name="path" value={path} />
            <label>
              Add a comment
              <textarea name="body" required minLength={2} maxLength={2000} rows={3} />
            </label>
            <button className="btn btn-primary" type="submit">
              Post comment
            </button>
          </form>
        ) : null}

        <ul className="comment-list">
          {engagement.comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-item__meta">
                <strong>{comment.user.name ?? "Fan"}</strong>
                <span>{comment.createdAt.toLocaleString()}</span>
              </div>
              <p>{comment.body}</p>
              {userId &&
              (userId === comment.userId || canEditCover) ? (
                <form
                  action={deleteComment.bind(null, comment.id, path)}
                >
                  <button type="submit" className="link-button">
                    Delete
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
