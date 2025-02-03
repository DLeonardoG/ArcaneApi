import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityCard } from "@/components/entity-card";
import { getArticles, getUniverseBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  return { title: universe ? `Articles · ${universe.name}` : "Articles" };
}

export default async function ArticlesPage({ params }: Props) {
  const { universe: slug } = await params;
  const universe = await getUniverseBySlug(slug);
  if (!universe) notFound();
  const articles = await getArticles(slug);

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>Articles</h1>
        <p>Essays and deep dives inside {universe.name}.</p>
      </div>
      <div className="grid-cards">
        {articles.map((article) => (
          <EntityCard
            key={article.id}
            href={`/u/${slug}/articles/${article.slug}`}
            title={article.title}