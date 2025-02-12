import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocation } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {