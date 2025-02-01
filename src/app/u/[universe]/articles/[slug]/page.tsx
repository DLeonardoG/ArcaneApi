import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>{article.title}</h1>
        <p>{article.summary}</p>
        <div className="meta-row">