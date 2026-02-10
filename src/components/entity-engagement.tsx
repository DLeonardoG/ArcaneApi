import { FavoriteTarget } from "@prisma/client";
import { auth } from "@/auth";
import { EngagementPanel } from "@/components/engagement-panel";
import { canUploadMedia } from "@/lib/permissions";

export async function EntityEngagement({
  targetType,