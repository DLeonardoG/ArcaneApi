import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUniverseBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  if (!universe) return { title: "Universe" };
  return {