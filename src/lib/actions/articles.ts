"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const articleSchema = z.object({
  universeSlug: z.string().min(1),
  title: z.string().min(3).max(120),
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(10).max(400),
  body: z.string().min(20),
});

function canEdit(role?: string) {
  return role === "EDITOR" || role === "ADMIN";
}

export async function createArticle(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user || !canEdit(session.user.role)) {
    throw new Error("Editors only.");
  }

  const parsed = articleSchema.safeParse({
    universeSlug: formData.get("universeSlug"),