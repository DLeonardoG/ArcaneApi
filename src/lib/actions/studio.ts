"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { canPublish } from "@/lib/engagement";
import { prisma } from "@/lib/prisma";

function requireEditor(role?: string) {
  if (!canPublish(role)) {
    throw new Error("Editors only.");
  }
}

const slugSchema = z
  .string()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

async function universeIdFromSlug(slug: string) {
  const universe = await prisma.universe.findUnique({ where: { slug } });
  if (!universe) throw new Error("Universe not found.");
  return universe;
}

export async function createCharacter(formData: FormData): Promise<void> {
  const session = await auth();
  requireEditor(session?.user?.role);

  const universeSlug = String(formData.get("universeSlug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || null;
  const summary = String(formData.get("summary") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const allegiances = String(formData.get("allegiances") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;

  if (!name || !summary || !bio || !slugSchema.safeParse(slug).success) {
    throw new Error("Invalid character fields.");
  }

  const universe = await universeIdFromSlug(universeSlug);
  await prisma.character.create({
    data: {
      universeId: universe.id,
      name,
      slug,
      title,
      summary,
      bio,
      allegiances,
      imageUrl,
    },
  });

  revalidatePath(`/u/${universe.slug}`);
  redirect(`/u/${universe.slug}/characters/${slug}`);
}

export async function createEpisode(formData: FormData): Promise<void> {
  const session = await auth();
  requireEditor(session?.user?.role);

  const universeSlug = String(formData.get("universeSlug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const season = Number(formData.get("season"));
  const number = Number(formData.get("number"));
  const synopsis = String(formData.get("synopsis") ?? "").trim();
  const airDate = String(formData.get("airDate") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;

  if (
    !title ||
    !synopsis ||
    !slugSchema.safeParse(slug).success ||