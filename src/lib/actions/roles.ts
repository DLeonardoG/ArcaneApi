"use server";

import { revalidatePath } from "next/cache";
import { RequestableRole, Role } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import {
  asRole,
  canReviewRequest,
  canSetUserRole,
  type AppRole,
} from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const requestSchema = z.object({
  requestedRole: z.enum(["EDITOR", "ADMIN"]),
  message: z.string().trim().min(20).max(1000),
});

export async function submitRoleRequest(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Sign in required.");

  const parsed = requestSchema.safeParse({
    requestedRole: formData.get("requestedRole"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    throw new Error("Write a short pitch (20–1000 chars) and pick a role.");
  }

  const me = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });
  const current = asRole(me.role);

  if (parsed.data.requestedRole === "EDITOR" && current !== "USER") {
    throw new Error("Only regular users can request editor access.");
  }
  if (parsed.data.requestedRole === "ADMIN" && current !== "EDITOR") {
    throw new Error("Only editors can request admin access.");
  }

  const pending = await prisma.roleRequest.findFirst({
    where: { userId: me.id, status: "PENDING" },
  });
  if (pending) {
    throw new Error("You already have a pending request.");
  }

  await prisma.roleRequest.create({
    data: {
      userId: me.id,
      requestedRole: parsed.data.requestedRole as RequestableRole,
      message: parsed.data.message,
      status: "PENDING",
    },
  });

  revalidatePath("/profile");
  revalidatePath("/admin");
}

export async function reviewRoleRequest(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Sign in required.");

  const requestId = String(formData.get("requestId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const reviewNote = String(formData.get("reviewNote") ?? "").trim() || null;

  if (!requestId || (decision !== "APPROVED" && decision !== "REJECTED")) {
    throw new Error("Invalid review payload.");
  }

  const request = await prisma.roleRequest.findUnique({
    where: { id: requestId },
    include: { user: true },
  });
  if (!request || request.status !== "PENDING") {
    throw new Error("Request not found or already reviewed.");
  }

  if (!canReviewRequest(session.user.role, request.requestedRole)) {
    throw new Error("You cannot review this request.");
  }

  if (decision === "APPROVED") {
    const nextRole = request.requestedRole as Role;
    if (
      !canSetUserRole(session.user.role, request.user.role, nextRole as AppRole)
    ) {
      throw new Error("You cannot assign that role.");
    }

    await prisma.$transaction([
      prisma.roleRequest.update({
        where: { id: request.id },
        data: {
          status: "APPROVED",
          reviewedById: session.user.id,
          reviewNote,
        },
      }),
      prisma.user.update({
        where: { id: request.userId },
        data: { role: nextRole },
      }),
    ]);
  } else {
    await prisma.roleRequest.update({
      where: { id: request.id },
      data: {
        status: "REJECTED",
        reviewedById: session.user.id,
        reviewNote,
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/profile");
}

export async function setUserRole(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Sign in required.");

  const userId = String(formData.get("userId") ?? "");
  const nextRole = asRole(String(formData.get("role") ?? "USER"));

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) throw new Error("User not found.");

  if (!canSetUserRole(session.user.role, target.role, nextRole)) {
    throw new Error("You cannot set that role.");
  }

  if (target.id === session.user.id && nextRole !== asRole(target.role)) {
    throw new Error("You cannot change your own role here.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: nextRole },
  });

  revalidatePath("/admin");
}
