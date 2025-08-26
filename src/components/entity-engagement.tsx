import { FavoriteTarget } from "@prisma/client";
import { auth } from "@/auth";
import { EngagementPanel } from "@/components/engagement-panel";
import { canPublish } from "@/lib/engagement";

export async function EntityEngagement({
  targetType,