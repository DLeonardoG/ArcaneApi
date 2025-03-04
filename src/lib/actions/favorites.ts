"use server";

import { revalidatePath } from "next/cache";
import { FavoriteTarget } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(
  targetType: FavoriteTarget,
  targetId: string,
  path: string,