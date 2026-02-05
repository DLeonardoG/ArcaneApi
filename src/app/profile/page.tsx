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
