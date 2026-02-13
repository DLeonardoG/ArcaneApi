"use server";

import { revalidatePath } from "next/cache";
import { FavoriteTarget } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { canModerateComments } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const commentSchema = z.object({
  targetType: z.nativeEnum(FavoriteTarget),
  targetId: z.string().min(1),
  body: z.string().trim().min(2).max(2000),