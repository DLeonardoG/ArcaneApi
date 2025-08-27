import { FavoriteTarget } from "@prisma/client";
import { auth } from "@/auth";
import { EngagementPanel } from "@/components/engagement-panel";
import { canPublish } from "@/lib/engagement";

export async function EntityEngagement({
  targetType,
  targetId,
  universeId,
  path,
  coverUrl,
}: {
  targetType: FavoriteTarget;
  targetId: string;
  universeId?: string;
  path: string;
  coverUrl?: string | null;
}) {
  const session = await auth();

  return (
    <EngagementPanel
      targetType={targetType}
      targetId={targetId}
      universeId={universeId}
      path={path}
      userId={session?.user?.id}
      canEditCover={canPublish(session?.user?.role)}