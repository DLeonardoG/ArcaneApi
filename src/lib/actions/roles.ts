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