import Link from "next/link";

export function EntityCard({
  href,
  title,
  subtitle,
  summary,
  accent,
}: {
  href: string;
  title: string;
  subtitle?: string;
  summary: string;
  accent?: string;