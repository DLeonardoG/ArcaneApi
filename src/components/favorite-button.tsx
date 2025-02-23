import { FavoriteTarget } from "@prisma/client";
import { toggleFavorite } from "@/lib/actions/favorites";

export function FavoriteButton({
  targetType,
  targetId,
  path,
  active,
}: {
  targetType: FavoriteTarget;
  targetId: string;
  path: string;
  active: boolean;
}) {