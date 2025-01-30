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
        <label>
          Query
          <input name="q" defaultValue={q} placeholder="Jinx, hextech, Zaun..." />
        </label>
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>

      {q ? (
        <div className="section">
          <ResultBlock
            title="Characters"
            items={results.characters.map((item) => ({
              href: `/u/${item.universe.slug}/characters/${item.slug}`,
              label: `${item.name} · ${item.universe.name}`,
            }))}
          />
          <ResultBlock
            title="Episodes"
            items={results.episodes.map((item) => ({
              href: `/u/${item.universe.slug}/episodes/${item.slug}`,
              label: `${item.title} · ${item.universe.name}`,