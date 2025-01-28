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