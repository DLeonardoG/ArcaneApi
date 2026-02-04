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