import type { Metadata } from "next";
import Link from "next/link";
import { searchLore } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Search",
  description: "Find characters, episodes, places, and articles across LoreVault.",
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = await searchLore(q);

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>Search</h1>
        <p>Hunt across every shelf in the vault.</p>
      </div>
      <form className="form-stack" action="/search" method="get">