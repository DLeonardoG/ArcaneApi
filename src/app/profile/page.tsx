import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const characterIds = favorites
    .filter((item) => item.targetType === "CHARACTER")
    .map((item) => item.targetId);

  const characters = characterIds.length
    ? await prisma.character.findMany({
        where: { id: { in: characterIds } },
        include: { universe: { select: { slug: true, name: true } } },
      })
    : [];

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>{session.user.name ?? "Fan"}</h1>
        <p>
          {session.user.email} · role {session.user.role}
        </p>
      </div>
      <section className="panel">
        <h2 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>
          Favorite characters
        </h2>
        {characters.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>
            No favorites yet. Open a character page and hit save.
          </p>
        ) : (
          <ul>
            {characters.map((character) => (
              <li key={character.id}>