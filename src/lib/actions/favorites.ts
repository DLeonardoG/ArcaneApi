"use server";

import { revalidatePath } from "next/cache";
import { FavoriteTarget } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(
  targetType: FavoriteTarget,
  targetId: string,
  path: string,
  _formData?: FormData,
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    return;
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_targetType_targetId: {
        userId: session.user.id,
        targetType,
        targetId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({
      data: {
        userId: session.user.id,
        targetType,
        targetId,
      },
    });
  }

  revalidatePath(path);
  revalidatePath("/profile");
}
