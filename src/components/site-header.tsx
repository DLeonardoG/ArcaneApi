import Link from "next/link";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import { canAccessAdmin, canPublish } from "@/lib/permissions";

export async function SiteHeader() {
  let session: Session | null = null;
  try {
    session = await auth();