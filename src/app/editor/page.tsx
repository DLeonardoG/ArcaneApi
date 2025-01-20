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

  const universes = await getUniverses();

  return (
    <div className="shell">
      <div className="page-hero">
        <h1>Editor desk</h1>
        <p>Publish a wiki article into any universe shelf.</p>
      </div>
      <form className="form-stack panel" action={createArticle} style={{ maxWidth: "40rem" }}>
        <label>
          Universe
          <select name="universeSlug" required defaultValue="arcane">
            {universes.map((universe) => (
              <option key={universe.id} value={universe.slug}>
                {universe.name}
              </option>