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
      orderBy: [{ role: "desc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      take: 100,
    }),
  ]);

  const visiblePending = pending.filter((item) =>
    canReviewRequest(session.user.role, item.requestedRole),
  );

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>Community admin</h1>
        <p>
          Review role requests and manage the vault hierarchy. Signed in as{" "}
          {session.user.role}.
        </p>
      </div>

      <section className="panel profile-section">
        <h2>Pending requests</h2>
        {visiblePending.length === 0 ? (
          <p className="muted">No pending requests you can review.</p>
        ) : (