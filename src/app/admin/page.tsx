import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { reviewRoleRequest, setUserRole } from "@/lib/actions/roles";
import {
  asRole,
  canAccessAdmin,
  canPromoteAdmin,
  canReviewRequest,
} from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!canAccessAdmin(session.user.role)) redirect("/profile");

  const [pending, users] = await Promise.all([
    prisma.roleRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    }),
    prisma.user.findMany({