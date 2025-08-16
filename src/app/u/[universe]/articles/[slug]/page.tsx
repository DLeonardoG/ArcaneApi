import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoriteTarget } from "@prisma/client";
import { EntityEngagement } from "@/components/entity-engagement";
import { MarkdownLite } from "@/components/markdown-lite";
import { getArticle } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ universe: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { universe, slug } = await params;
  const article = await getArticle(universe, slug);
  if (!article) return { title: "Article" };
  return {
    title: `${article.title} · ${article.universe.name}`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { universe, slug } = await params;
  const article = await getArticle(universe, slug);
  if (!article) notFound();

  const path = `/u/${universe}/articles/${slug}`;

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>{article.title}</h1>
        <p>{article.summary}</p>
        <div className="meta-row">
          <span>{article.author?.name ?? "Archive"}</span>
        </div>
      </div>
      <article className="panel">
        <MarkdownLite content={article.body} />
      </article>
      <EntityEngagement
        targetType={FavoriteTarget.ARTICLE}
        targetId={article.id}
        universeId={article.universeId}