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
  const action = toggleFavorite.bind(null, targetType, targetId, path);

  return (
    <form action={action}>
      <button type="submit" className={active ? "btn btn-active" : "btn"}>
        {active ? "Saved" : "Save favorite"}
      </button>