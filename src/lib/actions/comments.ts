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
  });

  if (!parsed.success) {
    throw new Error("Comment must be between 2 and 2000 characters.");
  }

  await prisma.comment.create({
    data: {
      userId: session.user.id,
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      body: parsed.data.body,
    },
  });

  revalidatePath(parsed.data.path);
}

export async function deleteComment(
  commentId: string,
  path: string,
  formData?: FormData,
): Promise<void> {
  void formData;
  const session = await auth();
  if (!session?.user?.id) return;