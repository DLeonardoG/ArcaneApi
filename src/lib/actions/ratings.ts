"use server";

import { revalidatePath } from "next/cache";
import { FavoriteTarget } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ratingSchema = z.object({
  targetType: z.nativeEnum(FavoriteTarget),
  targetId: z.string().min(1),
  score: z.coerce.number().int().min(1).max(5),
  path: z.string().min(1),
});

export async function upsertRating(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Sign in to rate.");
  }

  const parsed = ratingSchema.safeParse({
    targetType: formData.get("targetType"),
    targetId: formData.get("targetId"),
    score: formData.get("score"),
    path: formData.get("path"),
  });

  if (!parsed.success) {
    throw new Error("Pick a rating from 1 to 5.");
  }

  await prisma.rating.upsert({