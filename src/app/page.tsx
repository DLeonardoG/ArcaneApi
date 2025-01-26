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
            A fan wiki for every saga worth arguing about. Arcane opens the
            archive — Piltover, Zaun, and the sisters who split a city in two.
          </p>
          <div className="cta-row">
            <Link href="/u/arcane" className="btn btn-primary">
              Enter Arcane
            </Link>
            <Link href="/universes" className="btn">
              Browse universes
            </Link>
          </div>
        </div>
      </section>

      <section className="section shell">
        <h2>Universes in the vault</h2>