import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";

export async function SiteHeader() {
  let session: Awaited<ReturnType<typeof auth>> = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }