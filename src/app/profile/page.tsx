import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { submitRoleRequest } from "@/lib/actions/roles";
import { asRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const role = asRole(session.user.role);

  const [favorites, ratings, comments, pendingRequest, recentRequests] =
    await Promise.all([
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
      prisma.roleRequest.findFirst({
        where: { userId: session.user.id, status: "PENDING" },
      }),
      prisma.roleRequest.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
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
          where: { id: { in: articleIds } },
          include: { universe: { select: { slug: true, name: true } } },
        })
      : Promise.resolve([]),
  ]);

  const canRequestEditor = role === "USER" && !pendingRequest;
  const canRequestAdmin = role === "EDITOR" && !pendingRequest;

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>{session.user.name ?? "Fan"}</h1>
        <p>
          {session.user.email} · role {session.user.role}
        </p>
      </div>

      <section className="panel profile-section">
        <h2>Role access</h2>
        {pendingRequest ? (
          <p>
            Pending request for <strong>{pendingRequest.requestedRole}</strong>.
            Admins will review it soon.
          </p>
        ) : null}

        {canRequestEditor ? (
          <form className="form-stack" action={submitRoleRequest}>
            <input type="hidden" name="requestedRole" value="EDITOR" />
            <p className="muted">
              Editors publish lore and upload curated images. Pitch why you
              should join the desk.
            </p>
            <label>
              Why should you be an editor?
              <textarea name="message" required minLength={20} maxLength={1000} rows={4} />
            </label>
            <button className="btn btn-primary" type="submit">
              Request editor access
            </button>
          </form>
        ) : null}

        {canRequestAdmin ? (
          <form className="form-stack" action={submitRoleRequest}>
            <input type="hidden" name="requestedRole" value="ADMIN" />
            <p className="muted">
              Admins review community requests. Only a Super Admin can approve
              this.
            </p>
            <label>
              Why should you be an admin?
              <textarea name="message" required minLength={20} maxLength={1000} rows={4} />
            </label>
            <button className="btn btn-primary" type="submit">
              Request admin access
            </button>
          </form>
        ) : null}

        {!canRequestEditor && !canRequestAdmin && !pendingRequest ? (
          <p className="muted">No role applications available for your current rank.</p>
        ) : null}

        {recentRequests.length > 0 ? (
          <ul>
            {recentRequests.map((item) => (
              <li key={item.id}>
                {item.requestedRole} · {item.status.toLowerCase()}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="panel profile-section">
        <h2>Favorites</h2>
        {characters.length + episodes.length + articles.length === 0 ? (
          <p className="muted">No favorites yet. Save lore from any detail page.</p>
        ) : (
          <ul>
            {characters.map((character) => (
              <li key={character.id}>
                <Link
                  href={`/u/${character.universe.slug}/characters/${character.slug}`}
                >
                  {character.name} · {character.universe.name}
                </Link>
              </li>
            ))}
            {episodes.map((episode) => (
              <li key={episode.id}>
                <Link
                  href={`/u/${episode.universe.slug}/episodes/${episode.slug}`}
                >
                  {episode.title} · {episode.universe.name}
                </Link>
              </li>
            ))}
            {articles.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/u/${article.universe.slug}/articles/${article.slug}`}
                >
                  {article.title} · {article.universe.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel profile-section">
        <h2>Recent ratings</h2>
        {ratings.length === 0 ? (
          <p className="muted">No ratings yet.</p>
        ) : (
          <ul>
            {ratings.map((rating) => (
              <li key={rating.id}>
                {rating.targetType.toLowerCase()} · {rating.score}/5
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel profile-section">
        <h2>Your comments</h2>
        {comments.length === 0 ? (
          <p className="muted">No comments yet.</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.targetType.toLowerCase()}</strong>:{" "}
                {comment.body.slice(0, 120)}
                {comment.body.length > 120 ? "…" : ""}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
