"use server";

import { revalidatePath } from "next/cache";
import { FavoriteTarget } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ratingSchema = z.object({
  targetType: z.nativeEnum(FavoriteTarget),
  targetId: z.string().min(1),