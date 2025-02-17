import type { Metadata } from "next";
import { EntityCard } from "@/components/entity-card";
import { getUniverses } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Universes",
  description: "Every saga archived in LoreVault.",
};