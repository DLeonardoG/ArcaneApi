"use server";

import { revalidatePath } from "next/cache";
import { FavoriteTarget } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const commentSchema = z.object({
  targetType: z.nativeEnum(FavoriteTarget),
  targetId: z.string().min(1),
  body: z.string().trim().min(2).max(2000),
  path: z.string().min(1),
});

export async function addComment(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Sign in to comment.");
  }

  const parsed = commentSchema.safeParse({
    targetType: formData.get("targetType"),
    targetId: formData.get("targetId"),
    body: formData.get("body"),
    path: formData.get("path"),