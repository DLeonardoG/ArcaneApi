import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoriteTarget } from "@prisma/client";
import { EntityEngagement } from "@/components/entity-engagement";
import { getEpisode } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string; slug: string }> };
