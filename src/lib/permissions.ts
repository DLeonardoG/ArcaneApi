export type AppRole = "USER" | "EDITOR" | "ADMIN" | "SUPER_ADMIN";

const rank: Record<AppRole, number> = {
  USER: 1,
  EDITOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

export function asRole(role?: string | null): AppRole {
  if (
    role === "USER" ||
    role === "EDITOR" ||
    role === "ADMIN" ||
    role === "SUPER_ADMIN"
  ) {
    return role;
  }
  return "USER";
}

export function canPublish(role?: string | null) {
  return rank[asRole(role)] >= rank.EDITOR;
}

export function canUploadMedia(role?: string | null) {
  return canPublish(role);
}

export function canModerateComments(role?: string | null) {
  return canPublish(role);
}

export function canAccessAdmin(role?: string | null) {
  return rank[asRole(role)] >= rank.ADMIN;
}

export function canModerateRoles(role?: string | null) {
  return canAccessAdmin(role);
}

export function canPromoteAdmin(role?: string | null) {
  return asRole(role) === "SUPER_ADMIN";
}

export function canReviewRequest(
  reviewerRole: string | null | undefined,
  requestedRole: "EDITOR" | "ADMIN",
) {
  if (requestedRole === "ADMIN") {
    return canPromoteAdmin(reviewerRole);
  }
  return canModerateRoles(reviewerRole);
}

export function canSetUserRole(
  actorRole: string | null | undefined,
  targetCurrent: string | null | undefined,
  nextRole: AppRole,
) {