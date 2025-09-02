"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { FavoriteTarget } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { canPublish } from "@/lib/engagement";
import { prisma } from "@/lib/prisma";

const mediaSchema = z.object({
  targetType: z.nativeEnum(FavoriteTarget),
  targetId: z.string().min(1),
  universeId: z.string().optional(),
  url: z.string().url().optional(),
  alt: z.string().max(160).optional(),
  caption: z.string().max(280).optional(),
  isCover: z.coerce.boolean().optional(),
  path: z.string().min(1),
});

async function resolveUploadUrl(formData: FormData, fallbackUrl?: string) {
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error(
        "File upload needs BLOB_READ_WRITE_TOKEN. Paste an image URL instead, or add Vercel Blob.",
      );
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image uploads are allowed.");
    }
    if (file.size > 4_500_000) {
      throw new Error("Image must be under 4.5MB.");
    }
    const blob = await put(`lorevault/${Date.now()}-${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }
  if (fallbackUrl) return fallbackUrl;
  throw new Error("Provide an image URL or upload a file.");
}

export async function addMediaAsset(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Sign in required.");
  }

  const parsed = mediaSchema.safeParse({
    targetType: formData.get("targetType"),
    targetId: formData.get("targetId"),
    universeId: formData.get("universeId") || undefined,
    url: formData.get("url") || undefined,
    alt: formData.get("alt") || undefined,
    caption: formData.get("caption") || undefined,
    isCover: formData.get("isCover") === "on" || formData.get("isCover") === "true",
    path: formData.get("path"),
  });

  if (!parsed.success) {
    throw new Error("Invalid media fields.");
  }

  // Fans can add gallery images; cover changes require editors
  if (parsed.data.isCover && !canPublish(session.user.role)) {
    throw new Error("Only editors can set cover images.");
  }

  const url = await resolveUploadUrl(formData, parsed.data.url);

  if (parsed.data.isCover) {
    await prisma.mediaAsset.updateMany({
      where: {
        targetType: parsed.data.targetType,
        targetId: parsed.data.targetId,
        isCover: true,
      },
      data: { isCover: false },
    });

    await setEntityCover(
      parsed.data.targetType,
      parsed.data.targetId,
      url,
    );
  }

  await prisma.mediaAsset.create({
    data: {
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      universeId: parsed.data.universeId || null,
      url,
      alt: parsed.data.alt,
      caption: parsed.data.caption,
      isCover: Boolean(parsed.data.isCover),
      uploadedById: session.user.id,
    },
  });

  revalidatePath(parsed.data.path);
}

async function setEntityCover(
  targetType: FavoriteTarget,
  targetId: string,
  url: string,
) {
  switch (targetType) {
    case "CHARACTER":
      await prisma.character.update({
        where: { id: targetId },
        data: { imageUrl: url },
      });
      break;
    case "EPISODE":
      await prisma.episode.update({
        where: { id: targetId },
        data: { imageUrl: url },
      });
      break;
    case "LOCATION":
      await prisma.location.update({
        where: { id: targetId },
        data: { imageUrl: url },
      });
      break;
    case "FACTION":
      await prisma.faction.update({
        where: { id: targetId },
        data: { imageUrl: url },
      });
      break;
    case "ARTICLE":
      await prisma.article.update({
        where: { id: targetId },
        data: { imageUrl: url },
      });
      break;
  }
}
