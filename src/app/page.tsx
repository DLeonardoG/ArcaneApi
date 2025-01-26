import Link from "next/link";
import { EntityCard } from "@/components/entity-card";
import { getUniverses } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const universes = await getUniverses();
  const featured = universes.find((item) => item.isFeatured) ?? universes[0];

  return (
    <>
      <section className="hero shell">
        <div className="hero__content">
          <h1 className="hero__brand">LoreVault</h1>
          <p className="hero__lead">