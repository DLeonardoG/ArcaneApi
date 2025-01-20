import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createArticle } from "@/lib/actions/articles";
import { getUniverses } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Editor",
};

export default async function EditorPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "EDITOR" && session.user.role !== "ADMIN") {
    redirect("/profile");
  }