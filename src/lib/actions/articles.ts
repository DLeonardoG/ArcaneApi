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
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    throw new Error("Invalid article fields.");
  }

  const universe = await prisma.universe.findUnique({
    where: { slug: parsed.data.universeSlug },
  });
  if (!universe) throw new Error("Universe not found.");

  await prisma.article.create({
    data: {
      universeId: universe.id,
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      body: parsed.data.body,
      authorId: session.user.id,
      published: true,
    },
  });

  revalidatePath(`/u/${universe.slug}`);
  revalidatePath(`/u/${universe.slug}/articles`);
  redirect(`/u/${universe.slug}/articles/${parsed.data.slug}`);
}
