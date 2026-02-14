"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { FavoriteTarget } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { canUploadMedia } from "@/lib/permissions";
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