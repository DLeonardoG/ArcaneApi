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
          <ul className="admin-list">
            {visiblePending.map((item) => (
              <li key={item.id} className="admin-card">
                <div>
                  <strong>
                    {item.user.name ?? "Fan"} → {item.requestedRole}
                  </strong>
                  <p className="muted">
                    {item.user.email} · currently {item.user.role}
                  </p>
                  <p>{item.message}</p>
                </div>
                <form className="form-stack" action={reviewRoleRequest}>
                  <input type="hidden" name="requestId" value={item.id} />
                  <label>
                    Note
                    <input name="reviewNote" maxLength={280} />
                  </label>
                  <div className="cta-row">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      name="decision"
                      value="APPROVED"
                    >
                      Approve
                    </button>
                    <button
                      className="btn"
                      type="submit"
                      name="decision"
                      value="REJECTED"
                    >
                      Reject
                    </button>
                  </div>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel profile-section">
        <h2>Members</h2>
        <ul className="admin-list">
          {users.map((user) => {
            const role = asRole(user.role);
            const canEdit =
              role !== "SUPER_ADMIN" &&
              (canPromoteAdmin(session.user.role) ||
                (canAccessAdmin(session.user.role) &&
                  role !== "ADMIN" &&
                  user.id !== session.user.id));

            return (
              <li key={user.id} className="admin-card">
                <div>
                  <strong>{user.name ?? "Fan"}</strong>
                  <p className="muted">
                    {user.email} · {user.role}
                  </p>